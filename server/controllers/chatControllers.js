import mongoose from "mongoose";
import asyncHandler from "express-async-handler";

// * Model
import User from "../models/UserModel.js";
import Chat from "../models/ChatModel.js";
import Message from "../models/MessageModel.js";

/* -------------------------------------------------------------------------- */
/*                                 accessChat                                 */
/* -------------------------------------------------------------------------- */
export const accessChat = asyncHandler(async (req, res) => {

  /* --------------------------------- Params --------------------------------- */
  const { 
    id, 
    userId 
  } = req.params;

  // * Log
  // console.log("ID: " + id);

  /* ---------------------------------- Data ---------------------------------- */
  var seen = [];

  /* -------------------------------- Validate -------------------------------- */
  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  /* ------------------------------- Search Chat ------------------------------ */

  //  * Find Chat base on your ID and User ID
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  // * Log All Data
  // console.log(isChat);
  
  /* -------------------------------- Populate -------------------------------- */
  // isChat message model is connected
  // Get sender from message model using latestMesage from chat model
  // Get name pic and email
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "firstName lastName picturePath email type",
  });

  // * Log
  // console.log(isChat);

  /* ---------------------- Check if Chat in Table Exist ---------------------- */
  // * If Exist Update Seen, Else Create
  if (isChat.length > 0) {

    // * Log Populate Data
    // console.log(isChat[0].latestMessage._id);
  
    // * Check if There's a Latest Message
    if(isChat[0].latestMessage !== undefined) {

      // * Store the readBy Data
      seen = isChat[0].latestMessage.readBy;

      // * Check if your id exist in readBy
      if(!seen.includes(id)) {
        
        // * Add your ID in seen
        seen.push(id)

        // * Log
        // console.log(seen);

        // * Update readBy
        await Message.findByIdAndUpdate({ _id: isChat[0].latestMessage._id}, {
          readBy: id 
        });
        
      }

      // * Return Data
      res.send(isChat[0]);

    } else {

      // * Return Data
      res.send(isChat[0]);
      
    }                    

  } else {

    // * Create Data

    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [id, userId],
    };

    try {

      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).json(FullChat);

    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }

  }

});

/* -------------------------------------------------------------------------- */
/*                               accessGroupChat                              */
/* -------------------------------------------------------------------------- */
export const accessGroupChat = asyncHandler(async (req, res) => {

  /* --------------------------------- Params --------------------------------- */
  const { 
    id, 
    groupChatId 
  } = req.params;

  // * Log
  // console.log("Group Chat ID: " + groupChatId);

  /* ---------------------------------- Data ---------------------------------- */
  var seen = [];

  /* -------------------------------- Validate -------------------------------- */
  if (!groupChatId) {
    console.log("group Chat Id not exist");
    return res.sendStatus(400);
  }

  /* -------------------------------- Find Chat ------------------------------- */
  var fullGroupChat = await Chat.findOne({ _id: groupChatId })
  .populate("users", "-password")
  .populate("latestMessage");

  // * Log
  // console.log(fullGroupChat);  

  // * Check if Latest Message Exist if not just return fullGroupChat
  if(fullGroupChat.latestMessage !== undefined) {        
    try {

      // * Log
      // console.log("Accessed");

      // * Store the readBy Data
      seen = fullGroupChat.latestMessage.readBy;
      // console.log(seen);

      // * Check if your id exist in readBy
      if(!seen.includes(id)) {
        
        // * Add your ID in seen
        seen.push(id)

        // * Log
        // console.log(seen);

        // * Update readBy
        await Message.findByIdAndUpdate({ _id: fullGroupChat.latestMessage._id}, {
          readBy: id 
        });
        
      }

      // * Return
      res.status(200).json(fullGroupChat);

    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  } else {
    try {
      
      // * Return
      res.status(200).json(fullGroupChat);

    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }

});

/* -------------------------------------------------------------------------- */
/*                                 fetchChats                                 */
/* -------------------------------------------------------------------------- */
export const fetchChats = asyncHandler(async (req, res) => {
  try {

    /* ---------------------------------- Data ---------------------------------- */
    const { 
      id,
    } = req.params;

    /* ------------------------------- Find Chats ------------------------------- */
    Chat.find({ users: { $elemMatch: { $eq: id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {

        // * Format Results with Sender Data
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "firstName lastName picturePath email type",
        });

        // * Retun Results (Chat, User & Message Model)
        res.status(200).send(results);

      });

  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                               createGroupChat                              */
/* -------------------------------------------------------------------------- */
export const createGroupChat = asyncHandler(async (req, res) => {  
  try {
    
    /* ---------------------------------- Data ---------------------------------- */
    
    // * Body
    const {
      admin,
      name,
      users,
    } = req.body;

    // * Parse Users
    const usersParsed = JSON.parse(users);
    
    // * Include Admin in users
    const allUser = usersParsed.concat(admin);

    /* ------------------------------- Console Log ------------------------------ */
    // console.log(admin);
    // console.log(name);
    // console.log(users);
    // console.log("All User: " + allUser);

    /* ----------------------- Validate User and Chat Name ---------------------- */
    if (!usersParsed || !name) {
      return res.status(400).send({ message: "Please Fill all the feilds" });
    }
  
    /* ------------------------------- Parse User ------------------------------- */
    // var users = JSON.parse(req.body.users);
  
    /* ---------------------- Check if user is less than 2 ---------------------- */
    if (usersParsed.length < 2) {      
      return res
        .status(400)
        .json({error: "More than 2 users are required to form a group chat"})
    }
  
    /* ----------------------- Push Users into local array ---------------------- */
    // users.push(req.user);

    /* --------------------- Insert Group Chat into Database -------------------- */
    var groupChat;
    
    if (mongoose.Types.ObjectId.isValid(admin)) {
      groupChat = await Chat.create({
        chatName: name,
        users: allUser,
        isGroupChat: true,
        groupAdmin: admin,
      });
    }

    /* ----------------------------- Return Populate ---------------------------- */
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    /* -------------------------------- Response -------------------------------- */
    res.status(200).json(fullGroupChat);

  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                                 addToGroup                                 */
/* -------------------------------------------------------------------------- */
export const addToGroup = asyncHandler(async (req, res) => {

  const { 
    chatId, 
    userId 
  } = req.body;

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

/* -------------------------------------------------------------------------- */
/*                                 renameGroup                                */
/* -------------------------------------------------------------------------- */
export const renameGroup = asyncHandler(async (req, res) => {

  const { 
    chatId, 
    chatName 
  } = req.body;

  // new indication of new data will change
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

/* -------------------------------------------------------------------------- */
/*                               removeFromGroup                              */
/* -------------------------------------------------------------------------- */
export const removeFromGroup = asyncHandler(async (req, res) => {

  /* -------------------------------- Req Data -------------------------------- */
  
  // * Body
  const { 
    chatId, 
    userId 
  } = req.body;

  // * Log
  // console.log(chatId);
  // console.log(userId);

  /* ---------------------------- Database Request ---------------------------- */

  // * check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  /* --------------------------------- Return --------------------------------- */
  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }

});

/* -------------------------------------------------------------------------- */
/*                      Delete Chat and it's all Messages                     */
/* -------------------------------------------------------------------------- */
export const deleteChat = async (req, res) => {
  try {
    
    /* ---------------------------------- Param --------------------------------- */    
    const { 
      chatId, 
    } = req.params;
    
    // * Log
    // console.log(chatId);

    /* --------------------------------- Delete --------------------------------- */
    
    // * Sample
    // const web = await Web.deleteMany({ id: { $in: ['123','456','789'] } })

    // * Delete Chat
    const chatDelete = await Chat.deleteOne({ _id: chatId });

    // * Delete All Messages
    const messageDelete = await Message.deleteMany({ chat: { $in: chatId } });
    
    /* ----------------------------------- Log ---------------------------------- */
    // console.log(chatDelete);
    // console.log(messageDelete);

    /* ------------------------------- Return Data ------------------------------ */
    // res.status(200).json({ message: 'Deleted Successfully' });
    
    const chat = await Chat.find();
    res.status(200).json(chat);

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};