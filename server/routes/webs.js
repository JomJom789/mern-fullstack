import express from "express";
import sharp from "sharp";
import fs from 'fs'

import {
	getWebs,
	getWebById,
	getWebsByUser,
	updateWeb,
	deleteWebsite,
	deleteAllWebsiteByUser,
} from "../controllers/webs.js";

import { verifyToken } from "../middleware/auth.js";
import { multi_upload } from "../config/mutler.js";

const router = express.Router();

//* -------------------------------------------------------------------------- */
//*                                    Read                                    */
//* -------------------------------------------------------------------------- */
router.get("/", getWebs);
router.get("/:id", getWebById);
router.get("/:userId/webs", verifyToken, getWebsByUser);

//* -------------------------------------------------------------------------- */
//*                                   Update                                   */
//* -------------------------------------------------------------------------- */
router.patch(
	"/:id/update",
	verifyToken,
	multi_upload,
	async (req, res) => {
		
		/* ---------------------------------- Data ---------------------------------- */
		const imgCover = req.body.imgCover;
		const imgCoverDb = req.body.imgCoverDb;
		// Upload Image
		const images = req.body.images;
		// Show Only
		const imagesDb = req.body.imagesDb;
		// Delete Image from File System
		const imagesDel = req.body.imagesDel;
		// Save to Database
		const imagesAll = req.body.imagesAll;

		// Image Cover
		let imgCoverName = "";

		/* ----------------------------------- Log ---------------------------------- */
		// console.log(req.files);
		// console.log(imgCover);
		// console.log(imgCoverDb);
		// console.log(images);
		// console.log(imagesDb);
		// console.log(imagesDel);
		// console.log(imagesAll);

		/* ---------------------- Delete Image from File System --------------------- */				
		// ? Async with Return callback
		if (imgCover) {
			fs.unlink(`./public/websites/${imgCoverDb}`, function(err) {
				if (err) {
					throw err
				} else {
					console.log(`${imgCoverDb}: Successfully deleted the file.`)
				}
			})			
		}

		if (imagesDel !== undefined) {
			imagesDel.map(file => {
				fs.unlink(`./public/websites/${file}`, function(err) {
					if (err) {
						throw err
					} else {
						console.log(`${file}: Successfully deleted the file.`)
					}
				})
			})
		}

		// ? Sync
		// try {
		// 	fs.unlinkSync(pathToFile)
		// 	console.log("Successfully deleted the file.")
		// } catch(err) {
		// 	throw err
		// }

		/* ---------------------------- Upload New Image ---------------------------- */
		let newImg = [];
		
		if(imagesAll) {
			newImg = imagesAll;
		}

		req.files.map(async file => {
			
			// Make Name for Image
			const newImgName = file.fieldname + "_" + Date.now() + "_" + file.originalname;
			
			// Set Image Cover
			if (imgCover === file.originalname){
				imgCoverName = newImgName;
			} else {				
				newImg.push(newImgName);								
			}
						
			// Controll the Images
			await sharp(file.buffer)
				.resize({
					width: 800,
					height: 350,
					fit: "fill",
					kernel: sharp.kernel.nearest,
					withoutEnlargement: true,
				})
				.toFormat("jpeg")
				.jpeg({ quality: 90 })
				.toFile('./public/websites/' +  newImgName);

		})
		
		if (!imgCover) {
			imgCoverName = imgCoverDb;
		}
		
		/* ----------------------------------- Log ---------------------------------- */
		// console.log(imgCoverName);
		// console.log(newImg);

		/* ---------------------------- Controller Update --------------------------- */
		updateWeb(req, res, imgCoverName, newImg);
	},	
);

//* -------------------------------------------------------------------------- */
//*                                   Delete                                   */
//* -------------------------------------------------------------------------- */
router.delete(
	"/:id/delete",
	verifyToken,
	multi_upload,
	async (req, res) => {

		/* ---------------------------------- Data ---------------------------------- */
		const imgCoverDb = req.body.imgCoverDb;
		const imagesDb = req.body.imagesDb;

		/* ----------------------------------- Log ---------------------------------- */
		// console.log(req.files);		
		// console.log(imgCoverDb);		
		// console.log(imagesDb);		

		/* ---------------------- Delete Image from File System --------------------- */
		// ? Async with Return callback		
		fs.unlink(`./public/websites/${imgCoverDb}`, function(err) {
			if (err) {
				throw err
			} else {
				console.log(`${imgCoverDb}: Successfully deleted the file.`)
			}
		})

		imagesDb.map(file => {
			fs.unlink(`./public/websites/${file}`, function(err) {
				if (err) {
					throw err
				} else {
					console.log(`${file}: Successfully deleted the file.`)
				}
			})
		})

		/* ---------------------------- Controller Delete --------------------------- */
		deleteWebsite(req, res);
	}
);

//* -------------------------------------------------------------------------- */
//*                             Delete All By User                             */
//* -------------------------------------------------------------------------- */
router.delete(
	"/:userId/delete-all",
	verifyToken,
	multi_upload,
	async (req, res) => {

		/* ---------------------------------- Data ---------------------------------- */		
		// const imgCover = req.body.webs.imgCover;
		// const images = req.body.webs.images;

		/* ----------------------------------- Log ---------------------------------- */
		// console.log(req.body);
		// console.log(req.body.webs);		
		// console.log(imgCover);
		// console.log(images);

		// req.body.map(item => {
		// 	console.log(item.imgCover);
		// 	console.log(item.images);
		// })

		/* ---------------------- Delete Image from File System --------------------- */				
		// * Async with Return callback
		req.body.map(item => {

			// Image Cover
			fs.unlink(`./public/websites/${item.imgCover}`, function(err) {
				if (err) {
					throw err
				} else {
					console.log(`${item.imgCover}: Successfully deleted the file.`)
				}
			})

			// Images
			item.images.map(file => {
				fs.unlink(`./public/websites/${file}`, function(err) {
					if (err) {
						throw err
					} else {
						console.log(`${file}: Successfully deleted the file.`)
					}
				})
			})

		})

		/* ---------------------------- Controller Delete --------------------------- */
		deleteAllWebsiteByUser(req, res);
	}
);

export default router;
