import sharp from "sharp";
import fs from 'fs'

import {
  createMobile,
} from "../controllers/mobiles.js";

import { multi_upload } from "../config/mutler.js";

/* -------------------------------------------------------------------------- */
/*                                 mobilePost                                 */
/* -------------------------------------------------------------------------- */
const mobilePost = (app, verifyToken) => {

  /* -------------------------------------------------------------------------- */
  /*                                    Post                                    */
  /* -------------------------------------------------------------------------- */
  app.post(
    '/mobiles',
    verifyToken,
    multi_upload,
    async (req, res) => {

      /* ---------------------------------- Data ---------------------------------- */
      const imgCover = req.body.imgCover;
      const images = req.body.images;

      // * Image Cover
		  let imgCoverName = "";

      /* ------------------ Check if Folder from FileSyste Exist ------------------ */
      fs.access('./public/mobiles/', (err) => {
        if(err) {
          fs.mkdirSync('./public/mobiles/')
        }
      })

      /* -------------------------- Save Image to Server -------------------------- */
      const newImg = [];

      req.files.map(async file => {
        // console.log(file)

        // * Make Name for Image
        const newImgName = file.fieldname + "_" + Date.now() + "_" + file.originalname;

        // * Set Image Cover
        if (imgCover === file.originalname){
          imgCoverName = newImgName;
        } else {          
          newImg.push(newImgName);
        }

        // * Controll the Images
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
          .toFile('./public/mobiles/' +  newImgName);
      })

      /* ----------------------------------- Log ---------------------------------- */
      // console.log(newImg);
      // console.log(req.body.images.map((item, index) => item));
      // console.log(req.files.map((item, index) => item.buffer));

      /* ---------------------------- Save to Database ---------------------------- */
      createMobile(req, res, imgCoverName , newImg);
    },    
  );
    
}

export default mobilePost;