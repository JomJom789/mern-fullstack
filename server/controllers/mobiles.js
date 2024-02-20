import asyncHandler from "express-async-handler";

// * Model
import User from "../models/UserModel.js";
import Mobile from "../models/MobileModel.js";


//* -------------------------------------------------------------------------- */
//*                                 Create Mobile                              */
//* -------------------------------------------------------------------------- */
export const createMobile = async (req, res, imgCoverName, newImg) => {
  try {

    /* ------------------- Request Body (With Multiple Image) ------------------- */
    const {
      userId,
      title,
      description,
      category,
      features,
      genres,
      url
    } = req.body;

    /* ----------------------------------- Log ---------------------------------- */
    // console.log(req)

    // console.log(
    //   "userID: " + userId,
    //   "Title: " + title,
    //   "Description: " + description,
    //   "category: " + category,    
    //   "imgCover: " + imgCover,
    //   "images: " + images,
    //   "features: " + features,
    //   "url: " + url
    // );

    /* -------------------------------- Find User ------------------------------- */
    const user = await User.findById(userId);
        
    /* ------------------------------- Data Model ------------------------------- */
    const newMobile = new Mobile({
      userId,
      title,
      description,
      category,      
      imgCover: imgCoverName,
      images: newImg,
      features,
      genres,
      url,
    });
    
    /* ------------------------------- Save to DB ------------------------------- */
    await newMobile.save();

    /* --------------------------------- Return --------------------------------- */
    const mobile = await Mobile.find();
    res.status(201).json(mobile);

  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

//* -------------------------------------------------------------------------- */
//*                                   Get Mobiles                              */
//* -------------------------------------------------------------------------- */
export const getMobiles = asyncHandler(async (req, res) => {
  try {
    
    /* -------------------------------------------------------------------------- */
    /*                                 Data Query                                 */
    /* -------------------------------------------------------------------------- */
    const { 
      search = "",
      filter = '',      
      sort = null,
      page = 1,
      pageSize = 10,
    } = req.query;
    
    /* -------------------------------------------------------------------------- */
    /*                                   Filter                                   */
    /* -------------------------------------------------------------------------- */
    
    // * generateFilter (Old)
    // const generateFilter = () => {
      
    //   const newData = []

    //   const jsonParsed = JSON.parse(filter);

    //   for (const key in jsonParsed) {

    //     if(jsonParsed[key].name === "title") {
    //       // newData.push({title: jsonParsed[key].name, filter: jsonParsed[key].filter});
    //       newData.push(jsonParsed[key].name);
    //     }

    //     if (jsonParsed[key].name === "description") {
    //       newData.push(jsonParsed[key].name);
    //     }

    //     if (jsonParsed[key].name === "category") {
    //       newData.push(jsonParsed[key].name);
    //     }
        
    //     if (jsonParsed[key].name === "url") {
    //       newData.push(jsonParsed[key].name);
    //     }

    //     if (jsonParsed[key].name === "features") {
    //       newData.push(jsonParsed[key].name);
    //     }
    //   }

    //   return newData;
    // };
    
    // * generateFilter (Current)
    const generateFilter = () => {
      
      const newData = []

      const jsonParsed = JSON.parse(filter);

      for (const key in jsonParsed) {

        newData.push(jsonParsed[key].name);
        
      }

      return newData;
    };

    // * filterFormatted (Current)
    const filterFormatted = Boolean(filter) ? generateFilter() : {};

    // * filterFormatted (Old)
    // const filterFormatted = Boolean(filter) ? generateFilter() : (genre = [...genreOptions]);
    		
    /* -------------------------------------------------------------------------- */
    /*                                    Sort                                    */
    /* -------------------------------------------------------------------------- */

    // * Sort: formatted sort should look like { userId: -1 }
    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort ? 1 : -1),
      };

      return sortFormatted;
    };
    
    // * sortFormatted
    const sortFormatted = Boolean(sort) ? generateSort() : {};

    /* -------------------------------------------------------------------------- */
    /*                                 Get Mobiles                                */
    /* -------------------------------------------------------------------------- */
    
    // * Get Mobiles 
    const mobilesAll = await Mobile.find(
      search ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
            { features: { $regex: search, $options: "i" } },
            { url: { $regex: search, $options: "i" } },
            { genres: { $regex: search, $options: "i" } },
          ],
        } 
      : {}
    )
    // .select(filter) // Select Specific Field
    .sort(sortFormatted)
    .skip(page * pageSize)
    .limit(pageSize);

    // * Get Mobiles with Filter
    const mobilesFilter = await Mobile.find(
      search ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
            { features: { $regex: search, $options: "i" } },
            { url: { $regex: search, $options: "i" } },
            { genres: { $regex: search, $options: "i" } },
          ],
        } 
      : {}
    )
    // .select(filter) // Select Specific Field
    .where("genres")
		.in([...filterFormatted])
    .sort(sortFormatted)
    .skip(page * pageSize)
    .limit(pageSize);

    const mobiles = filterFormatted.length > 0 ? mobilesFilter : mobilesAll;

    /* -------------------------------------------------------------------------- */
    /*                                    total                                   */
    /* -------------------------------------------------------------------------- */
    const total = await Mobile.countDocuments(
      search ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
            { features: { $regex: search, $options: "i" } },
            { url: { $regex: search, $options: "i" } },
            { genres: { $regex: search, $options: "i" } },
          ],
        } 
      : {}
    );

    /* -------------------------------------------------------------------------- */
    /*                                   Return                                   */
    /* -------------------------------------------------------------------------- */
    res.status(200).json({
      mobiles,
      total,

      // filter,
      // filterFormatted,
      // genre,

      // sort,
      // sortFormatted,
    });

    /* -------------------------------------------------------------------------- */
    /*                                     Log                                    */
    /* -------------------------------------------------------------------------- */
    // console.log(search);

    // console.log(filter);
    // console.log(filterFormatted);

    // console.log(sort);
    // console.log(sortFormatted);

    // console.log(page);
    // console.log(pageSize);

    // console.log(mobiles);
    // console.log(total);

  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

//* -------------------------------------------------------------------------- */
//*                              Get Mobile By ID                              */
//* -------------------------------------------------------------------------- */
export const getMobileById = async (req, res) => {
  try {
    /* ---------------------------------- Data ---------------------------------- */
    const { id } = req.params;

    /* ------------------------------- Return Data ------------------------------ */
    const mobile = await Mobile.find({ _id: id });
    res.status(200).json(mobile);

    // res.redirect('/')
    /* ----------------------------------- Log ---------------------------------- */
    // console.log(id);
    // console.log(mobile);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

//* -------------------------------------------------------------------------- */
//*                               Get Mobile By User                           */
//* -------------------------------------------------------------------------- */
export const getMobilesByUser = async (req, res) => {
  try {
    /* ---------------------------------- Data ---------------------------------- */
    const { userId } = req.params;

    /* ---------------------------------- Return -------------------------------- */
    const mobile = await Mobile.find({ userId });
    res.status(200).json(mobile);

  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

//* -------------------------------------------------------------------------- */
//*                                Update Mobile                               */
//* -------------------------------------------------------------------------- */
export const updateMobile = async (req, res, imgCoverName, newImg) => {
  try {

    /* ---------------------------------- Data ---------------------------------- */
    const { id } = req.params;

    /* -------------------------------- Req Body -------------------------------- */
    const {
      userId,
      title,
      description,
      category,
      features,
      genres,
      url
    } = req.body;

    /* ----------------------------------- Log ---------------------------------- */
    // console.log(req)
    // console.log(newImg)

    // console.log(
    //   "Web ID: " + id,
    //   "userID: " + userId,
    //   "Title: " + title,
    //   "Description: " + description,
    //   "category: " + category,
    //   "imgCover: " + imgCover,
    //   "images: " + images,
    //   "features: " + features,
    //   "genres: " + genres,
    //   "url: " + url
    // );

    /* --------------------------------- Get Web -------------------------------- */
    const app = await Mobile.findById({ _id: id });

    /* ----------------------------- Update Function ---------------------------- */
    if (app.userId == userId) {      
      
      await Mobile.findByIdAndUpdate({ _id: id}, {
        userId,
        title,
        description,
        category,
        imgCover : imgCoverName,
        images : newImg,
        features,
        genres,
        url
      });

    } else {
      console.log("cant find user");
    }

    /* --------------------------------- Return --------------------------------- */
    // res.status(200).json({ message: 'Website updated successfully' })

    const mobile = await Mobile.find();
    res.status(202).json(mobile);

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};


//* -------------------------------------------------------------------------- */
//*                                Delete Mobile                               */
//* -------------------------------------------------------------------------- */
export const deleteMobile = async (req, res) => {
  try {
    
    /* ---------------------------------- Data ---------------------------------- */
    const { id } = req.params;

    /* --------------------------------- Get Web -------------------------------- */
    const app = await Mobile.findById({ _id: id });

    /* --------------------------------- Delete --------------------------------- */
    if (app.userId == req.body.userId) {
      // console.log("user found");
      await Mobile.deleteOne({ _id: id });
    } else {
      console.log("cant find user");
    }

    // res.status(200).json({ message: 'Deleted Successfully' });

    /* ------------------------------- Return Data ------------------------------ */
    const mobile = await Mobile.find();
    res.status(200).json(mobile);

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

//* -------------------------------------------------------------------------- */
//*                         Delete All Website By User                         */
//* -------------------------------------------------------------------------- */
export const deleteAllMobilesByUser = async (req, res) => {
  try {
    
    /* ---------------------------------- Data ---------------------------------- */
    const id = [];
    const userId = [];

    /* ----------------------------------- Log ---------------------------------- */
    // console.log(req.body);

    req.body.map(item => {
      id.push(item._id);
      userId.push(item.userId);

      // console.log(item._id);
      // console.log(item.userId);
      // console.log(item.title);
      // console.log(item.description);
      // console.log(item.category);
      // console.log(item.type);
      // console.log(item.imgCover);
      // console.log(item.images);
      // console.log(item.features);
      // console.log(item.url);
      // console.log(item.genres);
    });

    // console.log(id);

    /* --------------------------------- Get Web -------------------------------- */
    const mobileFound = await Mobile.find({ _id: { $in: id } });

    /* --------------------------------- Delete --------------------------------- */
    const mobileDelete = await Mobile.deleteMany({ _id: { $in: id } });

    // * Sample
    // const web = await Web.deleteMany({ id: { $in: ['123','456','789'] } })

    /* ----------------------------------- Log ---------------------------------- */
    // console.log(mobileFound);
    // console.log(mobileDelete);

    /* ------------------------------- Return Data ------------------------------ */
    // res.status(200).json({ message: 'Deleted Successfully' });
    
    const mobile = await Mobile.find();
    res.status(200).json(mobile);

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};