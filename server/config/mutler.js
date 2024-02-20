import multer from "multer";

/* ------------------------------- DiskStorage ------------------------------ */
// const storage = multer.diskStorage({
//   destination: function (req, file , cb) {
//     cb(null, "public/websites");
//   },
//   filename: function (req, file, cb) {      
//     cb(null, file.fieldname + "_" + month + "-" + day + "-" +  year + "_" + file.originalname);
//   },
// });

/* ----------------------------- Memory Storage ----------------------------- */
const storage = multer.memoryStorage();
  
    
/* ------------------------------ Single Upload ----------------------------- */
// const upload = multer({ storage });


/* ------------------------------ Multi Upload ------------------------------ */
export const multi_upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpeg' ||
      file.mimetype == 'image/jpg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      const err = new Error('Only .jpg .jpeg .png images are supported!');
      err.name = 'ExtensionError';
      return cb(err);
    }
  },
}).array('imgWebFile', 7);