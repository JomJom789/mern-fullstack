import express from "express";

import {
  allMessages,
  sendMessage,
  deleteMessage,
} from "../controllers/messageControllers.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                                     GET                                    */
/* -------------------------------------------------------------------------- */
router.get(
  "/:chatId",
	verifyToken,
	allMessages
);

/* -------------------------------------------------------------------------- */
/*                                    POST                                    */
/* -------------------------------------------------------------------------- */
router.post(
  "/send/:id",
	verifyToken,
	sendMessage
);

/* -------------------------------------------------------------------------- */
/*                                   Delete                                   */
/* -------------------------------------------------------------------------- */
router.delete(
	"/delete/:id/:chatId/:messageId",
	verifyToken,
	deleteMessage,
);

export default router;
