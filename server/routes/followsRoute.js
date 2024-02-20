import express from "express";

import {
	getFollowersByUserId,
	followAndUnfollowUser,
	viewedFollowers,
	confirmFollower,
	removeFollower,
} from "../controllers/followsController.js";

import { verifyToken } from "../middleware/auth.js";

/* -------------------------------------------------------------------------- */
/*                                   router                                   */
/* -------------------------------------------------------------------------- */
const router = express.Router();


/* -------------------------------------------------------------------------- */
/*                                Get Followers                               */
/* -------------------------------------------------------------------------- */
router.get(
	"/:id", 
	verifyToken, 
	getFollowersByUserId
);

/* -------------------------------------------------------------------------- */
/*                             Follow And Unfollow                            */
/* -------------------------------------------------------------------------- */
router.patch(
	"/:id/:userId",
	verifyToken,	
	followAndUnfollowUser
);

/* -------------------------------------------------------------------------- */
/*                                Update Viewed                               */
/* -------------------------------------------------------------------------- */
router.patch(
	"/update/viewed/:id",
	verifyToken,
	viewedFollowers
);

/* -------------------------------------------------------------------------- */
/*                              Confirm Follower                              */
/* -------------------------------------------------------------------------- */
router.patch(
	"/confirm/:id/:userId",
	verifyToken,
	confirmFollower
);

/* -------------------------------------------------------------------------- */
/*                               Remove Follower                              */
/* -------------------------------------------------------------------------- */
router.patch(
	"/remove/:id/:userId",
	verifyToken,
	removeFollower
);

export default router;