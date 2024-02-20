import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

// * Model
import User from "../models/UserModel.js";
import Web from "../models/WebModel.js";
import Mobile from "../models/MobileModel.js";

/* -------------------------------------------------------------------------- */
/*                                    Code                                    */
/* -------------------------------------------------------------------------- */
// 200 success
// 400 bad request
// 404 not found
// 500 internal error

/* -------------------------------------------------------------------------- */
/*                                  allUsers                                  */
/* -------------------------------------------------------------------------- */
export const allUsers = asyncHandler(async (req, res) => {
  
  // * Params
  const { id, search } = req.params;  

  // * Seach name or email in Mongo DB & Regex means pattern
  const keyword = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};
  
  // * req.user._id need an authorization to search other user
  const users = await User.find(keyword).find({ _id: { $ne: id } });
  res.send(users);

});

/* -------------------------------------------------------------------------- */
/*                                  Get User                                  */
/* -------------------------------------------------------------------------- */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                                Get User List                               */
/* -------------------------------------------------------------------------- */
export const getUserList = asyncHandler(async (req, res) => {
  try {
    
    /* ------------------------------- Data Query ------------------------------- */
    const { 
      search = "",
      filter = '',      
      sort = null,
      page = 1,
      pageSize = 10,
    } = req.query;
    
    /* --------------------------------- Filter --------------------------------- */  
    
    // * generateFilter
    const generateFilter = () => {
      
      const newData = []

      const jsonParsed = JSON.parse(filter);

      for (const key in jsonParsed) {

        if(jsonParsed[key].name === "firstName") {

          // * Push Single Data
          newData.push(jsonParsed[key].name);

          // * Push Multiple Data
          // newData.push({
          //   title: jsonParsed[key].name, 
          //   filter: jsonParsed[key].filter
          // });

        }

        if (jsonParsed[key].name === "lastName") {
          newData.push(jsonParsed[key].name);
        }

        if (jsonParsed[key].name === "email") {
          newData.push(jsonParsed[key].name);
        }

        if (jsonParsed[key].name === "role") {
          newData.push(jsonParsed[key].name);
        }

      }

      return newData;
    };
    
    // * filterFormatted
    const filterFormatted = Boolean(filter) ? generateFilter() : {};
    		
    /* ---------------------------------- Sort ---------------------------------- */

    // * Sort: formatted sort should look like { userId: -1 }
    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort ? 1 : -1),
      };

      return sortFormatted;
    };
    
    // * sortFormatted
    const sortFormatted = Boolean(sort) ? generateSort() : {};

    /* -------------------------------- Get Users ------------------------------- */
    
    // * Get Users 
    const usersAll = await User.find(
      search 
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { role: { $regex: search, $options: "i" } },
          ],
        } 
      : {}
    )
    .select("-password")
    .sort(sortFormatted)
    .skip(page * pageSize)
    .limit(pageSize);

    // * Get Users W/Filter
    const usersFilter = await User.find(
      search 
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { role: { $regex: search, $options: "i" } },
          ],
        } 
      : {}
    )
    .select("-password")
    // .select({firstName: search, lastName: search}) // Select Specific Field
    .where("fields")
		.in([...filterFormatted])
    .sort(sortFormatted)
    .skip(page * pageSize)
    .limit(pageSize);

    const users = filterFormatted.length > 0 ? usersFilter : usersAll;

    /* ---------------------------------- total --------------------------------- */
    const total = await User.countDocuments(
      search 
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { role: { $regex: search, $options: "i" } },
          ],
        } 
      : {}
    );

    /* --------------------------------- return --------------------------------- */
    res.status(200).json({
      users,
      total,

      // filter,
      // filterFormatted,

      // sort,
      // sortFormatted,
    });

    /* ----------------------------------- Log ---------------------------------- */
    
    // * Search
    // console.log(search);

    // * Filter
    // console.log(filter);
    // console.log(filterFormatted);

    // * Sort
    // console.log(sort);
    // console.log(sortFormatted);

    // * Page
    // console.log(page);
    // console.log(pageSize);

    // * Return
    // console.log(users);
    // console.log(total);

  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

/* -------------------------------------------------------------------------- */
/*                             getUserListContacts                            */
/* -------------------------------------------------------------------------- */
export const getUserListContacts = asyncHandler(async (req, res) => {
  try {
    
    /* ------------------------------- Data Query ------------------------------- */
    const { 
      search = "",
      filter = "",      
      sort = null,
    } = req.query;

    /* --------------------------------- Filter --------------------------------- */

    // * generateFilter
    const generateFilter = () => {

      const newData = []

      const jsonParsed = JSON.parse(filter);

      for (const key in jsonParsed) {
        newData.push(jsonParsed[key]._id);
      }

      return newData;

    };

    // * filterFormatted
    const filterFormatted = Boolean(filter) ? generateFilter() : {};

    /* ---------------------------------- Sort ---------------------------------- */

    // * Sort: formatted sort should look like { userId: -1 }
    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort ? 1 : -1),
      };

      return sortFormatted;
    };

    // * sortFormatted
    const sortFormatted = Boolean(sort) ? generateSort() : {};

    /* -------------------------------- Get Users ------------------------------- */    
    const usersAll = await User.find(
      search 
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { role: { $regex: search, $options: "i" } },
          ],
        } 
      : {}
    )
    .select("-password")
    .sort(sortFormatted)

    /* ---------------------------- Get Users Filter ---------------------------- */
    const usersFilter = await User.find(
      search 
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { role: { $regex: search, $options: "i" } },
          ],
        } 
      : {}
    )
    .select("-password")
    // .select({firstName: search, lastName: search}) // Remove other field other than Selected Field's
    .where("_id")
		.in([...filterFormatted])
    .sort(sortFormatted)

    /* ---------------------------------- Users --------------------------------- */
    const users = filterFormatted.length > 0 ? usersFilter : usersAll;

    /* ---------------------------------- total --------------------------------- */
    const total = await User.countDocuments(
      search 
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { role: { $regex: search, $options: "i" } },
          ],
        }
      : {}
    );

    /* --------------------------------- return --------------------------------- */
    res.status(200).json({
      users,
      total,

      // filter,
      // filterFormatted,

      // sort,
      // sortFormatted,
    });

    /* ----------------------------------- Log ---------------------------------- */

    // * Search
    // console.log(search);

    // * Filter
    // console.log(filter);
    // console.log(filterFormatted);

    // * Sort
    // console.log(sort);
    // console.log(sortFormatted);

    // * Return
    // console.log(users);
    // console.log(total);

  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

/* -------------------------------------------------------------------------- */
/*                              getUserListChats                              */
/* -------------------------------------------------------------------------- */
export const getUserListChats = asyncHandler(async (req, res) => {
  try {
    
    /* ------------------------------- Data Query ------------------------------- */
    const { 
      search = "",
      filter = '',      
      sort = null,
    } = req.query;
    
    /* --------------------------------- Filter --------------------------------- */  
    
    // * generateFilter
    const generateFilter = () => {
      
      const newData = []

      const jsonParsed = JSON.parse(filter);

      for (const key in jsonParsed) {

        if(jsonParsed[key].name === "firstName") {          

          // * Push Single Data
          newData.push(jsonParsed[key].name);

          // * Push Multiple Data
          // newData.push({
          //   title: jsonParsed[key].name, 
          //   filter: jsonParsed[key].filter
          // });

        }

        if (jsonParsed[key].name === "lastName") {
          newData.push(jsonParsed[key].name);
        }

        if (jsonParsed[key].name === "email") {
          newData.push(jsonParsed[key].name);
        }

        if (jsonParsed[key].name === "role") {
          newData.push(jsonParsed[key].name);
        }

      }

      return newData;
    };
    
    // * filterFormatted
    const filterFormatted = Boolean(filter) ? generateFilter() : {};
    		
    /* ---------------------------------- Sort ---------------------------------- */

    // * Sort: formatted sort should look like { userId: -1 }
    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort ? 1 : -1),
      };

      return sortFormatted;
    };
    
    // * sortFormatted
    const sortFormatted = Boolean(sort) ? generateSort() : {};

    /* -------------------------------- Get Users ------------------------------- */
    
    // * Get Users 
    const usersAll = await User.find(
      search 
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { role: { $regex: search, $options: "i" } },
          ],
        } 
      : {}
    )
    .select("-password")
    .sort(sortFormatted)

    // * Get Users W/Filter
    const usersFilter = await User.find(
      search 
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { role: { $regex: search, $options: "i" } },
          ],
        } 
      : {}
    )
    .select("-password")
    // .select({firstName: search, lastName: search}) // Select Specific Field
    .where("fields")
		.in([...filterFormatted])
    .sort(sortFormatted)

    const users = filterFormatted.length > 0 ? usersFilter : usersAll;

    /* ---------------------------------- total --------------------------------- */
    const total = await User.countDocuments(
      search 
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { role: { $regex: search, $options: "i" } },
          ],
        } 
      : {}
    );

    /* --------------------------------- return --------------------------------- */
    res.status(200).json({
      users,
      total,

      // filter,
      // filterFormatted,

      // sort,
      // sortFormatted,
    });

    /* ----------------------------------- Log ---------------------------------- */
    
    // * Search
    // console.log(search);

    // * Filter
    // console.log(filter);
    // console.log(filterFormatted);

    // * Sort
    // console.log(sort);
    // console.log(sortFormatted);

    // * Return
    // console.log(users);
    // console.log(total);

  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

/* -------------------------------------------------------------------------- */
/*                               Get User By ID                               */
/* -------------------------------------------------------------------------- */
export const getUserById = async (req, res) => {
  try {

    /* ---------------------------------- Data ---------------------------------- */
    const { id } = req.params;

    /* ------------------------------- Return Data ------------------------------ */
    const user = await User.find({ _id: id }).select("-password");
    res.status(200).json(user);

    // res.redirect('/')

    /* ----------------------------------- Log ---------------------------------- */
    // console.log(id);
    // console.log(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                                 Update User                                */
/* -------------------------------------------------------------------------- */
export const updateUser = async (req, res, imgProfileName) => {
  try {

    /* ---------------------------------- Data ---------------------------------- */
    const { id } = req.params;

    /* -------------------------------- Req Body -------------------------------- */
    const {
      yourId,
      firstName,
      lastName,
      email,
      currentPassword,
      userId,
      role,
      fields,
      // picturePath,
      type,
    } = req.body;

    /* ----------------------------------- Log ---------------------------------- */
    // console.log(req.body);
    // console.log("Your ID: " + yourId);
    // console.log("User ID: " + id);
    // console.log("First Name: " + firstName);
    // console.log("LastName: " + lastName);
    // console.log("Email: " + email);
    // console.log("Current Password: " + currentPassword);
    // console.log("New Password: " + newPassword);
    // console.log("Picture Path: " + imgProfileName);
    // console.log("Role: " + role);
    // console.log("Fields: " + fields);

    /* -------------------------------- Get User -------------------------------- */
    var user = await User.findById({ _id: id });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });
    
    if (currentPassword && newPassword) {
      
      /* ---------------------------- Comapare Password --------------------------- */
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Wrong Password. " });

      /* ---------------------------- Encrypt Password ---------------------------- */
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(newPassword, salt);

      /* ----------------------------- Update Function ---------------------------- */
      if (user._id == yourId && isMatch) {
        
        await User.findByIdAndUpdate({ _id: id}, {
          id,
          firstName,
          lastName,
          email,
          password: passwordHash,
          picturePath : imgProfileName,
          role,
          fields,
        });

      } else {
        console.log("User not Found");
        return res.status(404).json({ msg: "User not Found." });
      }

      /* --------------------------------- Return --------------------------------- */
      if (isMatch) {

        // * JWT
        const token = jwt.sign(
          { id: user._id }, 
          process.env.JWT_SECRET
        );

        // * Exclude Password
        delete user.password;

        // * Find User
        var userResponse = await User.findById({ _id: id });

        // * Response
        res.status(200).json({ token, userResponse });
      }

    } else {

      /* ----------------------------- Update Function ---------------------------- */
      if (user._id == yourId) {

        await User.findByIdAndUpdate({ _id: id}, {
          id,
          firstName,
          lastName,
          email,
          picturePath : imgProfileName,
          role,
          fields,
        });

      } else {
        console.log("User not Found");
        return res.status(404).json({ msg: "User not Found." });
      }

      /* --------------------------------- Return --------------------------------- */
      // const token = jwt.sign(
      //   { id: user._id }, 
      //   process.env.JWT_SECRET, 
      //   { expiresIn: '1h' }
      // );

      // * JWT
      const token = jwt.sign(
        { id: user._id }, 
        process.env.JWT_SECRET
      );

      // * Don't Include Password
      delete user.password;

      // * Find User
      var userResponse = await User.findById({ _id: id });

      // * Response
      res.status(200).json({ token, userResponse });

    }

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

/* -------------------------------------------------------------------------- */
/*                                 Delete User                                */
/* -------------------------------------------------------------------------- */
export const deleteUser = async (req, res) => {
  try {
    
    /* ---------------------------------- Data ---------------------------------- */
    
    // * Param
    const { id } = req.params;

    // * Req Body
    const {
      yourId,
      // firstName,
      // lastName,
      // email,
      // password,
      // role,
      // fields,
      // picturePath,
      // type
    } = req.body;

    /* --------------------------------- Get Web -------------------------------- */
    const findUser = await User.findById({ _id: id });

    /* ------------------------------- Delete Web ------------------------------- */
    Web.deleteMany({ userId: findUser._id }).then(function(){
      // * Success
      console.log("Web Datas Deleted"); 
    }).catch(function(error){
      // * Failure
      console.log(error); 
    });

    /* ------------------------------ Delete Mobile ----------------------------- */
    Mobile.deleteMany({ userId: findUser._id }).then(function(){
      // * Success
      console.log("Mobile Datas Deleted"); 
    }).catch(function(error){
      // * Failure
      console.log(error); 
    });

    /* ------------------------------- Delete User ------------------------------ */
    if (findUser._id == yourId) {
      // console.log("user found");
      await User.deleteOne({ _id: yourId });
    } else {
      console.log("cant find user");
      res.status(404).json({ error: err.message });
    }

    /* ------------------------------- Return Data ------------------------------ */
    try {
      const user = await User.find({ _id: yourId });
      res.status(200).json(user);                
    } catch (err) {
      res.status(404).json({ error: err.message });
    }

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
};
