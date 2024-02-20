import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from 'crypto';

/* --------------------------------- Module --------------------------------- */
import User from "../models/UserModel.js";
import Token from "../models/TokenModel.js";
import ForgetPasswordToken from "../models/ForgotPasswordTokenModel.js";

/* ---------------------------------- Utils --------------------------------- */
import { verifyEmails, forgotPasswordEmail } from "../emailServices/authEmails.js";

/* -------------------------------------------------------------------------- */
/*                                REGISTER USER                               */
/* -------------------------------------------------------------------------- */
export const register = async (req, res, pictureImg) => {
  try {

    /* ---------------------------------- Data ---------------------------------- */

    // * Request Body
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
    } = req.body;

    // * Initialize Field
    const fields = [
      "firstName", 
      "lastName", 
      "email", 
      "role"
    ];

    /* -------------------------------- Find User ------------------------------- */
    const user = await User.findOne({ email: email });    
    if (user) return res.status(400).json({ error: "User already exist. " });

    /* ---------------------------- Encrypt Password ---------------------------- */
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    /* -------------------------------- Save User ------------------------------- */
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath: pictureImg,
      type: "website",
      role: "admin",
      fields: fields,
    });

    /* ------------------------------- Save Token ------------------------------- */
    const token = new Token({
      userId: newUser._id,
      token: crypto.randomBytes(32).toString("hex"),
    });

    /* ------------------------------- Send Email ------------------------------- */
		const url = `${process.env.DOMAIN_URL}/users/${newUser._id}/verify/${token.token}`;
		
    await verifyEmails(
      newUser.firstName,
      newUser.lastName,
      newUser.email, 
      "Verify Email in PLAYER ONE",
      "Verify Your Account in PLAYER ONE",
      url,
    );

    /* --------------------------------- Return --------------------------------- */
    const savedUser = await newUser.save();
    const emailToken = await token.save();
    // res.status(201).json(savedUser);

    if(savedUser) {
      res.status(200).json({ 
        success: "Successfully Registered, Please verify your account to your email.",
      })
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                                   Verify                                   */
/* -------------------------------------------------------------------------- */
export const verify = async (req, res) => {
  try {

    /* ----------------------------------- Data --------------------------------- */

    // * Request Body
    const { 
      id,
      token
    } = req.params;

    // * Log    
    // console.log(req.params);
    // console.log("ID: " + id);
    // console.log("Token: " + token);

    /* -------------------------------- Find User ------------------------------- */
		
    // * Find One User
    const user = await User.findOne({ _id: id });
		
    // * Check if User Exist
    if (!user) return res.status(400).send({ error: "User not found!" });

    // * Log
    // console.log(user);

    /* ---------------------------------- Token --------------------------------- */
		
    // * Get Token
    const tokenResponse = await Token.findOne({
			userId: user._id,
			token: token,
		});

    // * Check if Token Exist
		if (!tokenResponse) return res.status(400).send({ error: "Invalid Credentials" });

    // * Log
    // console.log(tokenResponse);

    /* ----------------------- if User verify Remove Token ---------------------- */
		
    // * Update Verify Field
    const userUpdated = await User.updateOne(
      // This is Filter Finding the Field
      {
        _id: user._id,
      },
      // Update Data
      {
        activated: true,
      }
    );

    // * Log
    // console.log(userUpdated);

    // * Remove Token once updated
    await Token.deleteOne({ token });

    /* -------------------------------- Response -------------------------------- */
		res.status(200).send({ success: "You are now verified, please login your account" });

	} catch (error) {
		res.status(500).send({ error: "Internal Server Error" });
	}
}

/* -------------------------------------------------------------------------- */
/*                                 LOGGING IN                                 */
/* -------------------------------------------------------------------------- */
export const login = async (req, res) => {
  try {

    /* ---------------------------------- Data ---------------------------------- */
    const { 
      email,
      password,
    } = req.body;

    /* ----------------------------------- Log ---------------------------------- */
    // console.log(email);
    // console.log(password);

    /* -------------------------------- Find User ------------------------------- */
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ error: "User does not exist. " });

    /* ---------------------------- Comapare Password --------------------------- */
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials. " });

    /* ----------------------------- Check if Verify ---------------------------- */
    if (!user.activated) {
          
      let token = await Token.findOne({ userId: user._id });

      if (!token) {

        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
      

        // * Prepare Url
        const url = `${process.env.DOMAIN_URL}/users/${user._id}/verify/${token.token}`;
        
        // * Send Email
        await verifyEmails(
          user.firstName,
          user.lastName,
          user.email, 
          "Verify Email in PLAYER ONE",
          "Verify Your Account in PLAYER ONE",
          url,
        );

      } else {
        
        // * Prepare Url
        const url = `${process.env.DOMAIN_URL}/users/${user._id}/verify/${token.token}`;
        
        // * Send Email
        await verifyEmails(
          user.firstName,
          user.lastName,
          user.email, 
          "Verify Email in PLAYER ONE",
          "Verify Your Account in PLAYER ONE",
          url,
        );

      }

      return res.status(400).send({ success: "An email sent to your account, please verify" });
    }

    /* -------------------------- Update Active Status -------------------------- */    
    user.activeStatus = true;
    user.markModified('activeStatus');
    await user.save();

    /* -------------------------- Return User and Token ------------------------- */    

    // * Create Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);    
    delete user.password;    
    res.status(200).json({ token, user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                                 Google Auth                                */
/* -------------------------------------------------------------------------- */
export const google = async (req, res) => {
  try {

    /* ---------------------------------- Data ---------------------------------- */
    
    // * Request
    const {
      given_name,
      family_name,
      email,
      picture,
      sub,
    } = req.body;

    // * Log
    // console.log(given_name);
    // console.log(family_name);
    // console.log(email);
    // console.log(picture);
    // console.log(sub);

    // * Initialize Field
    const fields = [
      "firstName", 
      "lastName", 
      "email", 
      "role"
    ];

    /* ---------------------- Check Exisiting User from DB ---------------------- */
    const userFound = await User.findOne({ email })

    if (userFound) {
      
      // * If user exist, Login

      /* ---------------------------- Comapare Password --------------------------- */
      const saltPassword = process.env.AUTH_PASSWORD + sub;
      const isMatch = await bcrypt.compare(saltPassword, userFound.password);
      if (!isMatch) return res.status(400).json({ error: "Invalid credentials. " });

      /* -------------------------- Update Active Status -------------------------- */
      userFound.activeStatus = true;
      userFound.markModified('activeStatus');
      await userFound.save();

      /* -------------------------- Return User and Token ------------------------- */
      const token = jwt.sign({ id: userFound._id }, process.env.JWT_SECRET);
      delete userFound.password;
      res.status(200).json({ token, user: userFound });

    } else {

      // * If user does not exist, Register

      /* ---------------------------- Encrypt Password ---------------------------- */
      const saltPassword = process.env.AUTH_PASSWORD + sub;
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(saltPassword, salt);

      /* -------------------------------- Mongoose -------------------------------- */
      const newUser = new User({
        firstName: given_name,
        lastName: family_name,
        email,
        password: passwordHash,
        picturePath: picture,
        type: "google",
        role: "admin",
        fields: fields,
      });

      /* ------------------------------ Save new User ----------------------------- */
      const user = await newUser.save();
      
      if(user) {
        
        // * Update Active Status
        user.activeStatus = true;
        user.markModified('activeStatus');
        await user.save();

        // * Return User and Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });

      }
 
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                               Forgot Password                              */
/* -------------------------------------------------------------------------- */
export const forgotPassword = async (req, res) => {
  try {

    /* ---------------------------------- Data ---------------------------------- */
    
    // * Request
    const {      
      email,
    } = req.body;

    // * Log
    // console.log(email);

    /* -------------------------------- Find User ------------------------------- */
    const user = await User.findOne({ email: email });    
    if (!user) return res.status(400).json({ error: "User does not exist. " });

    var token = await ForgetPasswordToken.findOne({ userId: user._id });
    
    /* ------------------------------- Save Token ------------------------------- */
    var emailToken;

    if (!token) {
      
      // * Generate Token
      token = new ForgetPasswordToken({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      });
  
      // * Save
      emailToken = await token.save();

    }
    
    /* ------------------------------- Send Email ------------------------------- */

    // * Generate URL
		const url = `${process.env.DOMAIN_URL}/users/${user._id}/reset-password/${token.token}`;
		
    // * Send Email
    await forgotPasswordEmail(
      user.firstName,
      user.lastName,
      user.email, 
      "Reset Password in PLAYER ONE",
      "Reset Your Password in PLAYER ONE",
      url,
    );

    /* --------------------------------- Return --------------------------------- */
    if(emailToken || token.token) {
      return res.status(200).json({success: "Please check your email to reset your password."});
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                               Reset Password                               */
/* -------------------------------------------------------------------------- */
export const resetPassword = async (req, res) => {
  try {

    /* ---------------------------------- Data ---------------------------------- */

    // * Request
    const {
      userId,
      token,
      newPassword,
    } = req.body;

    /* -------------------------------- Find User ------------------------------- */
    const user = await User.findOne({ _id: userId });    
    if (!user) return res.status(400).json({ error: "User does not exist. " });

    /* ---------------------------------- Token --------------------------------- */
    var tokenFound = await ForgetPasswordToken.findOne({ userId: user._id });
    if (!tokenFound) return res.status(400).json({ error: "You have expired token, please send us a request again. " });

    /* ---------------------------- Encrypt Password ---------------------------- */
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(newPassword, salt);

    /* --------------------------------- Update --------------------------------- */
    const userUpdated = await User.updateOne(
      // This is Filter Finding the Field
      {
        _id: user._id,
      },
      // Update Data
      {
        password: passwordHash,
      }
    );

    /* ------------------------ Remove Token once updated ----------------------- */
    await ForgetPasswordToken.deleteOne({ token });
    
    /* -------------------------------- Response -------------------------------- */
    res.status(200).send({ success: "You successfully reset your password." });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                                Active Status                               */
/* -------------------------------------------------------------------------- */
export const activeStatus = async (req, res) => {
  try {

    /* ---------------------------------- Data ---------------------------------- */
    const {
      id,
      online
    } = req.params;
    
    /* -------------------------------- Find User ------------------------------- */
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(400).json({ error: "User does not exist. " });
  
    /* -------------------------- Update Active Status -------------------------- */
    user.activeStatus = online;
    user.markModified('activeStatus');
    await user.save();

    /* -------------------------------- Response -------------------------------- */
    res.status(200).send({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                                   Logout                                   */
/* -------------------------------------------------------------------------- */
export const logout = async (req, res) => {
  try {

    /* ---------------------------------- Data ---------------------------------- */
    const {
      id
    } = req.params;

    /* -------------------------------- Find User ------------------------------- */
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(400).json({ error: "User does not exist. " });
  
    /* -------------------------- Update Active Status -------------------------- */
    user.activeStatus = false;
    user.markModified('activeStatus');
    await user.save();

    /* -------------------------------- Response -------------------------------- */
    res.status(200).send({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};