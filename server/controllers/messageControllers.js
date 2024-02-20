import mongoose from "mongoose";
import asyncHandler from "express-async-handler";

// * Model
import User from "../models/UserModel.js";
import Chat from "../models/ChatModel.js";
import Message from "../models/MessageModel.js";

/* -------------------------------------------------------------------------- */
/*                                 allMessages                                */
/* -------------------------------------------------------------------------- */
export const allMessages = asyncHandler(async (req, res) => {
  try {

    /* ---------------------------------- Data ---------------------------------- */
    const { chatId } = req.params;

    if (mongoose.Types.ObjectId.isValid(chatId)) {
      
      /* ------------------------ Find Messages by chat id ------------------------ */
      const messages = await Message.find({ chat: chatId })
      .populate("sender", "firstName lastName picturePath email type")
      .populate("chat");

      /* ------------------------------- Return Data ------------------------------ */
      res.json(messages);

    }
    
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                                 sendMessage                                */
/* -------------------------------------------------------------------------- */
export const sendMessage = asyncHandler(async (req, res) => {  
  try {

    /* ---------------------------------- Data ---------------------------------- */
    const { id } = req.params;
    const { content, chatId } = req.body;

    /* ------------------------------- Validation ------------------------------- */
    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }

    /* -------------------------- Construct new Message ------------------------- */
    var newMessage = {
      sender: id,
      content: content,
      chat: chatId,
    };

    /* --------------------------- Create new Message --------------------------- */
    var message = await Message.create(newMessage);

    /* ------------------------------ Populate Data ----------------------------- */
    message = await message.populate("sender", "firstName lastName picturePath email type");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "firstName lastName picturePath email type",
    });

    /* ----------------------- Update Chat latest Message ----------------------- */
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    /* ------------------------------- Return Data ------------------------------ */
    res.json(message);

  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                                   Delete                                   */
/* -------------------------------------------------------------------------- */
export const deleteMessage = asyncHandler(async (req, res) => {
  try {

    /* ---------------------------------- Data ---------------------------------- */
    const { 
      id, 
      chatId, 
      messageId 
    } = req.params;

    /* ------------------------------ Find Message ------------------------------ */
    const message = await Message.findById({ _id: messageId });

    /* ------------------------------- Validation ------------------------------- */
    if(
      !message.sender === id &&
      !message.chat === chatId &&
      !message._id === messageId
    ) {
      return
    }
    
    /* --------------------------------- Delete --------------------------------- */
    await Message.deleteOne({ _id: messageId });

    /* ------------------------ Find Messages by chat id ------------------------ */
    const messages = await Message.find({ chat: chatId })
    .populate("sender", "firstName lastName picturePath email type")
    .populate("chat");

    // console.log(messages);

    /* -------------------------------- Solution -------------------------------- */
    // * Get the Last Array of Message
    const lastArray = messages.slice(-1);
    
    // * Log
    // console.log(lastArray);

    // * Latest Message that will be replace
    // console.log(lastArray[0].chat.latestMessage);

    // * Update readBy
    await Chat.findByIdAndUpdate({ _id: lastArray[0].chat._id }, {
      latestMessage: lastArray[0]._id 
    });

    // * Update latestMessage base on last Message

    /* --------------------------------- Success -------------------------------- */
    res.status(200).json({
      success: "Successfully Deleted",
      messages: messages,
    });
    
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
