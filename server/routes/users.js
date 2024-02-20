import express from "express";
import multer from "multer";
import sharp from "sharp";
import fs from 'fs';

import {
  getUserList,
	getUserListChats,
	getUserListContacts,
  getUser,
  updateUser,	
  deleteUser,

	// * Not RTK Query
	allUsers,

} from "../controllers/users.js";

import { verifyToken } from "../middleware/auth.js";

/* -------------------------------------------------------------------------- */
/*                                   router                                   */
/* -------------------------------------------------------------------------- */
const router = express.Router();

// * Memory Storage
const storage = multer.memoryStorage();

// * Single Upload
const upload = multer({ storage });

/* -------------------------------------------------------------------------- */
/*                                    READ                                    */
/* -------------------------------------------------------------------------- */
router.get("/", getUserList);
router.get("/chats", getUserListChats);
router.get("/contacts", getUserListContacts);
router.get("/:id", verifyToken, getUser);

// * Not RTK Query
router.get("/group-chat/:id/:search", verifyToken, allUsers);

/* -------------------------------------------------------------------------- */
/*                                   Update                                   */
/* -------------------------------------------------------------------------- */
router.patch(
	"/:id/update",
	verifyToken,
	upload.single("profileImgFile"),
	async (req, res) => {

		/* ---------------------------------- Data ---------------------------------- */		
		const {
			userId,
			yourId,
			type,
			// firstName,
			// lastName,
			// email,
			// role,
			// fields,
			profileImg,
      profileImgDB,
    } = req.body;

    let imgProfileName = "";

		/* ----------------------------------- Log ---------------------------------- */
		// console.log(req);
		// console.log("User ID: " + userId);
		// console.log("Your ID: " + yourId);
		// console.log(firstName);
		// console.log(lastName);
		// console.log(email);
		// console.log(role);
		// console.log(fields);
		// console.log(profileImg);
		// console.log(profileImgDB);

		/* ---------------------- Delete Image from File System --------------------- */				

		// * Check if Profile pic Exist
		// const profileImgExist = fs.existsSync(`./public/profile/${profileImgDB}`)
		
		// * Async with Return callback
		if (profileImg && userId == yourId) {

			fs.unlink(`./public/profile/${profileImgDB}`, function(err) {
				if (err) {
					throw err
				} else {
					console.log(`${profileImgDB}: Successfully deleted the file.`)
				}
			})

		}

		// * Sync (Other Option)
		// try {
		// 	fs.unlinkSync(pathToFile)
		// 	console.log("Successfully deleted the file.")
		// } catch(err) {
		// 	throw err
		// }

		/* ---------------------------- Upload New Image ---------------------------- */

    // * Name for Image
		let newImgName = "";

		if(profileImg && userId == yourId){

			// * Name for Upload Image
			newImgName = req.file.fieldname + "_" + Date.now() + "_" + req.file.originalname;

			// * Set Image Cover
			if (profileImg === req.file.originalname) {
				imgProfileName = newImgName;
			}
	
			// * Control the Image
			await sharp(req.file.buffer)
				.resize({
					width: 800,
					height: 400,
					fit: "fill",
					kernel: sharp.kernel.nearest,
					withoutEnlargement: true,
				})
				.toFormat("jpeg")
				.jpeg({ quality: 90 })
				.toFile('./public/profile/' +  newImgName);
		}

		// * if upload doesn't exist set from Database
		if (!profileImg && userId == yourId) {
			imgProfileName = profileImgDB;
		}

		/* ----------------------------------- Log ---------------------------------- */
		// console.log(imgProfileName);

		/* ---------------------------- Controller Update --------------------------- */
		updateUser(req, res, imgProfileName);

	},
);

/* -------------------------------------------------------------------------- */
/*                                   Delete                                   */
/* -------------------------------------------------------------------------- */
router.delete(
	"/:id/delete",
	verifyToken,
	upload.single("profileImgFile"),
	async (req, res) => {

		/* ---------------------------------- Data ---------------------------------- */
		const {
			userId,
			yourId,
			// firstName,
			// lastName,
			// email,
			// role,
			// fields,
			// profileImg,
      profileImgDB,
			type,
    } = req.body;

		/* ----------------------------------- Log ---------------------------------- */
		// console.log(req);
		// console.log(userId);
		// console.log(yourId);
		// console.log(profileImgDB);
		// console.log(req.files);

		// * Check if Profile pic Exist
		const profileImgExist = fs.existsSync(`./public/profile/${profileImgDB}`)

		/* ---------------------- Delete Image from File System --------------------- */		
		// * Async with Return callback
		if (
			type == "website" && 
			userId == yourId && 
			profileImgExist
		) {
			
			fs.unlink(`./public/profile/${profileImgDB}`, function(err) {
				if (err) {
					throw err
				} else {
					console.log(`${profileImgDB}: Successfully deleted the file.`)
				}
			})
			
		}

		/* ---------------------------- Controller Delete --------------------------- */
		deleteUser(req, res);
	}
);

export default router;
