import express from "express";

import {
	accessChat,
	accessGroupChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
	deleteChat,
} from "../controllers/chatControllers.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                                     Get                                    */
/* -------------------------------------------------------------------------- */

// * Get: All Messages
router.get(
  "/:id",
	verifyToken,
	fetchChats
);

/* -------------------------------------------------------------------------- */
/*                                    Post                                    */
/* -------------------------------------------------------------------------- */

// * Single Chat: Create & Access
router.post(
  "/user/:id/:userId",
	verifyToken,
	accessChat
);

// * Group Chat: Access
router.post(
  "/group/:id/:groupChatId",
	verifyToken,
	accessGroupChat
);

// * Group Chat: Create
router.post(
  "/group",
	verifyToken,
	createGroupChat
);

/* -------------------------------------------------------------------------- */
/*                                     Put                                    */
/* -------------------------------------------------------------------------- */

// * Group: Add
router.put(
  "/groupadd",
	verifyToken,
	addToGroup
);

// * Group: Rename
router.put(
  "/rename",
	verifyToken,
	renameGroup
);

// * Group: Remove
router.put(
  "/groupremove",
	verifyToken,
	removeFromGroup
);

/* -------------------------------------------------------------------------- */
/*                                   Delete                                   */
/* -------------------------------------------------------------------------- */
router.delete(
  "/delete/:chatId",
	verifyToken,
	deleteChat
);

export default router;
