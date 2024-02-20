import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

// * Model
import User from "../models/UserModel.js";

/* -------------------------------------------------------------------------- */
/*                                Get Followers                               */
/* -------------------------------------------------------------------------- */
export const getFollowersByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(400).json({ msg: "User does not exist. " });    
    
    /* --------------------------------- Return --------------------------------- */
    res.status(200).json(user.followers);

  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                             Follow And Unfollow                            */
/* -------------------------------------------------------------------------- */
export const followAndUnfollowUser = async (req, res) => {
  try {

    /* ------------------------------ Request Param ----------------------------- */
    const { id, userId } = req.params;

    const date = new Date();
    
    /* ----------------------------------- Log ---------------------------------- */
    // console.log("Your ID: " + id);
    // console.log("User ID: " + userId);

    /* -------------------------------- Get User -------------------------------- */
    const user = await User.findById({ _id: id });
    const follow = await User.findById({ _id: userId });

    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    // * Log
    // console.log(user.followers);
    // console.log(follow.followers);

    /* ------------------------ Find Data in Object Array ----------------------- */

    // * Single Array
    // const isFollowed = user.followers.includes(userId);

    // * Object Array
    // const isFollowed = user.followers.filter(e => e._id === userId);
    // const isFollowed = user.followers.find(e => e._id === userId);

    // * Log
    // console.log(isFollowed);

    /* ------------------- Check if you follower with that User ------------------- */
    if (user.following.find(e => e._id === userId)) {
      
      // * Single Array
      // user.followers = user.followers.filter(id => id !== userId);
      // follow.followers = follow.followers.filter(followerId => followerId !== id);

      // * Object Array
      // user.followers = user.followers.filter(e => e._id !== userId);
      // follow.followers = follow.followers.filter(e => e._id !== id);

      // * Delete
      user.following = user.following.filter(e => e._id !== userId);
      follow.followers = follow.followers.filter(e => e._id !== id);
      
      /* ------------------------- Check if Data is Exist ------------------------- */

      if (
        user.followers.find(obj => obj._id === userId) && 
        follow.following.find(obj => obj._id === id)
      ) {

        // * Find User in my Follower List
        const userFollowersIndex = user.followers.findIndex((obj => obj._id == userId));

        // * Update Followers Status into Unfollowed
        user.followers[userFollowersIndex].status = "requested";
        user.followers[userFollowersIndex].date_confirmed = date;

        // * Find My ID in user Following List
        const followFollowingIndex = follow.following.findIndex((obj => obj._id == id));

        // * Update Followers Status into Unfollowed
        follow.following[followFollowingIndex].status = "requested";
        follow.following[followFollowingIndex].date_confirmed = date;

      }

    } else {

      // * Single Array
      // user.followers.push(userId);
      // follow.followers.push(id);

      // * Object Array
      // user.followers.push({ _id: userId, status: "requested" });
      // follow.followers.push({ _id: id, status : "requested"});

      if(user.followers.find(e => e._id === userId) ) {
        
        // * Find User Index
        const objIndex = user.followers.findIndex((obj => obj._id == userId));

        // * Update Followers Status into Confirmed
        user.followers[objIndex].status = "confirmed";
        user.followers[objIndex].date_confirmed = date;

        // * User Following
        user.following.push({ 
          _id: userId,
          name: follow.firstName + " " + follow.lastName,
          profilePicture: follow.picturePath,
          type: follow.type,
          status: "confirmed",
          date_added: date,
          date_confirmed: date,
        });

        // * Follow Back (Save this to their followers field)
        follow.followers.push({
          _id: id,
          name: user.firstName + " " + user.lastName,
          profilePicture: user.picturePath,
          type: user.type,
          status: "confirmed",
          viewed: false,
          date_added: date,
          date_confirmed: date,
        });

        // * Find my id in his following
        const followIndex = follow.following.findIndex((obj => obj._id == id));

        // * Update Following status into Confirmed
        follow.following[followIndex].status = "confirmed";
        follow.following[followIndex].date_confirmed = date;

      } else {
        
        // * User Following
        user.following.push({ 
          _id: userId,
          name: follow.firstName + " " + follow.lastName,
          profilePicture: follow.picturePath,
          type: follow.type,
          status: "requested",
          date_added: date,
          date_confirmed: null,
        });

        // * Follow
        follow.followers.push({
          _id: id,
          name: user.firstName + " " + user.lastName,
          profilePicture: user.picturePath,
          type: user.type,
          status: "requested",
          viewed: false,
          date_added: date,
          date_confirmed: null,
        });

      }      

    }

    // * Log
    // console.log(user.followers);
    // console.log(follower.followers);

    /* ---------------------------------- Save ---------------------------------- */
    
    // * Update Fields
    user.markModified('followers');
    user.markModified('following');
    follow.markModified('followers');
    follow.markModified('following');

    // * Save
    await user.save();
    await follow.save();

    /* -------------------------------- Response -------------------------------- */
    res.status(200).json(user.following);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                              Viewed Followers                              */
/* -------------------------------------------------------------------------- */
export const viewedFollowers = async (req, res) => {
  try {

    /* ---------------------------------- Data ---------------------------------- */
    
    // * Param
    const { id } = req.params;

    // * Log
    // console.log("Your ID: " + id);
    // console.log(req.body);

    /* -------------------------------- Get User -------------------------------- */
    let user = await User.findById({ _id: id });

    /* ------------------- Check if you follower with that User ------------------- */
    
    // * Filter and Get all data with "False Viewed"
    // const foundFollowers = user.followers.filter(e => e.viewed === false);
    // console.log(foundFollowers);

    // * Update Viewed into "True" using map
    // user.followers = foundFollowers.map((item) => {
    //   item.viewed = true;
    //   return item;
    // });

    // * Update Viewed into "True" using forEach
    user.followers.forEach((item) => {
      item.viewed = true;
    });

    // * Log Updated Result
    // console.log(user.followers);
    // console.log(user);

    /* ---------------------------------- Save ---------------------------------- */
    user.markModified('followers');
    await user.save();

    /* -------------------------------- Response -------------------------------- */
    res.status(200).json(user.followers.reverse());

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                              Confirm Follower                              */
/* -------------------------------------------------------------------------- */
export const confirmFollower = async (req, res) => {
  try {

    /* ---------------------------------- Data ---------------------------------- */
    const { id, userId } = req.params;

    const date = new Date();

    /* ----------------------------------- Log ---------------------------------- */
    // console.log("Your ID: " + id);
    // console.log("User ID: " + userId);
    
    /* -------------------------------- Get User -------------------------------- */
    const user = await User.findById({ _id: id });
    const follow = await User.findById({ _id: userId });

    if (!user) return res.status(400).json({ msg: "User does not exist. " });
        
    /* ------------------- Check if you follower with that User ------------------- */
    // if (user.followers.find(e => e._id === userId && e.status === "requested")) {

    //   const updatedUser = user.followers.findIndex(e => e._id === userId);
    //   user.followers[updateUser].status = "confirmed";

    //   const updatedFollower = follower.followers.findIndex(e => e._id === userId);
    //   user.followers[updatedFollower].status = "confirmed";

    // }

    if(user.followers.find(e => e._id === userId) ) {
        
      // * Find User Index
      const objIndex = user.followers.findIndex((obj => obj._id == userId));

      // * Update Followers Status into Confirmed
      user.followers[objIndex].status = "confirmed";
      user.followers[objIndex].date_confirmed = date;

      // * Save the User in Following
      user.following.push({ 
        _id: userId,
        name: follow.firstName + " " + follow.lastName,
        profilePicture: follow.picturePath,
        type: follow.type,
        status: "confirmed",
        date_added: date,
        date_confirmed: date,
      });

      // * Follow Back (Save this to their followers field)
      follow.followers.push({
        _id: id,
        name: user.firstName + " " + user.lastName,
        profilePicture: user.picturePath,
        type: user.type,
        status: "confirmed",
        viewed: false,
        date_added: date,
        date_confirmed: date,
      });

      // * Find my id in his following
      const followIndex = follow.following.findIndex((obj => obj._id == id));

      // * Update Following status into Confirmed
      follow.following[followIndex].status = "confirmed";
      follow.following[followIndex].date_confirmed = date;

    }

    // * Log
    // console.log(user.followers);
    // console.log(follower.followers);

    /* ---------------------------------- Save ---------------------------------- */
    user.markModified('followers');
    user.markModified('following');
    follow.markModified('followers');
    follow.markModified('following');

    await user.save();
    await follow.save();

    /* ----------------------------- Get All Friends ---------------------------- */
    // const followers = await Promise.all(
    //   user.followers.map((id) => User.findById(id))
    // );

    /* ----------------------------- Format Friends ----------------------------- */
    // const formattedFollowers = followers.map(
    //   ({ _id, firstName, lastName, email, picturePath, role, fields }) => {
    //     return {
    //       _id,
    //       firstName,
    //       lastName,
    //       email,
    //       picturePath,
    //       role,
    //       fields,
    //     };
    //   }
    // );

    /* -------------------------------- Response -------------------------------- */
    res.status(200).json({ 
      followersData: user.followers,
      followingData: user.following,
      yourData: follow.followers,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* -------------------------------------------------------------------------- */
/*                               Remove Follower                              */
/* -------------------------------------------------------------------------- */
export const removeFollower = async (req, res) => {
  try {

    /* ---------------------------------- Data ---------------------------------- */
    const { id, userId } = req.params;

    /* ----------------------------------- Log ---------------------------------- */
    // console.log("Your ID: " + id);
    // console.log("User ID: " + userId);

    /* -------------------------------- Get User -------------------------------- */
    const user = await User.findById({ _id: id });
    const follow = await User.findById({ _id: userId });

    if (!user) return res.status(400).json({ msg: "User does not exist. " });
        
    /* ------------------ Remove Data from Users and Followers ------------------ */
    if (user.followers.find(e => e._id === userId)) {
      user.followers = user.followers.filter(e => e._id !== userId);
    }

    if (user.following.find(e => e._id === userId)) {
      user.following = user.following.filter(e => e._id !== userId);
    }

    if (follow.followers.filter(e => e._id === id)) {
      follow.followers = follow.followers.filter(e => e._id !== id);
    }

    if (follow.following.filter(e => e._id === id)) {
      follow.following = follow.following.filter(e => e._id !== id);
    }
    
    /* ----------------------------------- Log ---------------------------------- */
    // console.log(user.followers);
    // console.log(follow.followers);

    /* ---------------------------------- Save ---------------------------------- */
    await user.save();
    await follow.save();

    /* ----------------------------- Get All Friends ---------------------------- */
    const followers = await Promise.all(
      user.followers.map((id) => User.findById(id))
    );

    /* ----------------------------- Format Friends ----------------------------- */
    const formattedFollowers = followers.map(
      ({ _id, firstName, lastName, email, picturePath, role, fields }) => {
        return { 
          _id,
          firstName,
          lastName,
          email,
          picturePath,
          role,
          fields,
        };
      }
    );

    /* -------------------------------- Response -------------------------------- */
    console.log(formattedFollowers);
    res.status(200).json(formattedFollowers);
    
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};