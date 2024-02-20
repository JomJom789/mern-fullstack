import multer from "multer";
import sharp from "sharp";
import fs from 'fs'

import { 
  register,
} from "../controllers/auth.js";


/* -------------------------------------------------------------------------- */
/*                                  authPost                                  */
/* -------------------------------------------------------------------------- */
const authPost = (app) => {
  
  // * Memory Storage
  const storage = multer.memoryStorage();

  // * Single Upload
  const upload = multer({ storage });

  /* ---------------------------------- Post ---------------------------------- */
  app.post(
    "/auth/register",
    upload.single("picture"),
    async (req, res) => {

      /* ----------------------- Set the Path of the Images ----------------------- */
      // * Check if Folder from FileSyste Exist
      fs.access('./public/profile/', (err) => {
        if(err) {
          fs.mkdirSync('./public/profile/')
        }
      })

      /* ----------------------------------- Log ---------------------------------- */
      // console.log(req.file);

      /* ------------------------------- Inser Image ------------------------------ */

      // * Set Img Name
      const pictureImg = req.file.fieldname + "_" + Date.now() + "_" + req.file.originalname;

      // * Sharp to Save Single Image
      await sharp(req.file.buffer)
        .resize({
          width: 480, 
          height: 240,  
          fit: "fill",
          kernel: sharp.kernel.nearest,
          withoutEnlargement: true,
        })
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile('./public/profile/' + pictureImg);

      /* -------------------------------- Register -------------------------------- */
      register(req, res, pictureImg);
    }
  );

}

export default authPost;