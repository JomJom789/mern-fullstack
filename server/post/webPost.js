import sharp from "sharp";
import fs from 'fs'

import {
  createWeb,
} from "../controllers/webs.js";

import { multi_upload } from "../config/mutler.js";

/* -------------------------------------------------------------------------- */
/*                                   webPost                                  */
/* -------------------------------------------------------------------------- */
const webPost = (app, verifyToken) => {
  
  
  /* ---------------------------------- Date ---------------------------------- */
  // const date = new Date();
  // let day = date.getDate();
  // let month = date.getMonth() + 1;
  // let year = date.getFullYear();
    
  /* -------------------------------------------------------------------------- */
  /*                                    Post                                    */
  /* -------------------------------------------------------------------------- */
  app.post(
    '/webs',
    verifyToken,
    multi_upload,
    async (req, res) => {

      /* ---------------------------------- Data ---------------------------------- */
      const imgCover = req.body.imgCover;
      const images = req.body.images;

      // * Image Cover
		  let imgCoverName = "";

      /* ------------------ Check if Folder from FileSyste Exist ------------------ */
      fs.access('./public/websites/', (err) => {
        if(err) {
          fs.mkdirSync('./public/websites/')
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
          .toFile('./public/websites/' +  newImgName);
      })

      /* ----------------------------------- Log ---------------------------------- */
      // console.log(newImg);
      // console.log(req.body.images.map((item, index) => item));
      // console.log(req.files.map((item, index) => item.buffer));

      /* ---------------------------- Save to Database ---------------------------- */
      createWeb(req, res, imgCoverName , newImg);
    },    
  );
    
}

export default webPost;