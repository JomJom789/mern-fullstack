import React, { 
  useEffect, 
  useState, 
  useCallback 
} from 'react';

/* --------------------------------- Router --------------------------------- */
import { useNavigate, useParams } from 'react-router-dom';

/* ---------------------------------- Redux --------------------------------- */
import { 
  // useDispatch, 
  useSelector 
} from "react-redux";
// import { setWebs } from "../../state/authReducer";

/* ------------------------------- Material UI ------------------------------ */
import {
  Box,
  // InputBase,
  IconButton,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';

/* -------------------------------- MUI Icon -------------------------------- */
import {
  DeleteOutlined,
  EditOutlined,  
  ArrowUpwardOutlined,
  CloseOutlined,
} from '@mui/icons-material';

/* -------------------------------- Dropzone -------------------------------- */
import Dropzone, { 
  useDropzone 
} from 'react-dropzone';

/* -------------------------------- Component ------------------------------- */
import FlexBetween from '../../components/MuiComponents/FlexBetween'
import DeleteModal from '../../components/Modal/DeleteModal';
import { Loading } from '../../components';


//* -------------------------------------------------------------------------- */
//*                                AdminWebsites                               */
//* -------------------------------------------------------------------------- */
const AdminWebsiteDetails = () => {

  /* -------------------------------------------------------------------------- */
  /*                                    Param                                   */
  /* -------------------------------------------------------------------------- */
  const { id } = useParams();
  const navigate = useNavigate();

  const [isDeleted, setIsDeleted] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /* -------------------------------------------------------------------------- */
  /*                                Website Data                                */
  /* -------------------------------------------------------------------------- */
  
  // * Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("client");  
  const [type, setType] = useState("static");
  
  // * Image Cover
  const [imgCover, setImgCover] = useState(null);
  const [imgCoverDb, setImgCoverDb] = useState(null);
  
  // * Images
  const [images, setImages] = useState([]);  
  const [imagesDb, setImagesDb] = useState([]);
  const [imagesDel, setImagesDel] = useState([]);
  const [imagesAll, setImagesAll] = useState([]);  
  const [imagesRejected, setImagesRejected] = useState([])
  
  // * Features
  const [features, setFeatures] = useState([])
  const [feature, setFeature] = useState("")
  const [url, setUrl] = useState("")
  
  // * Genres
  const [genreList, setGenreList] = useState([]);
  const [genre, setGenre] = useState("");

  /* -------------------------------------------------------------------------- */
  /*                                    Error                                   */
  /* -------------------------------------------------------------------------- */
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");  
  const [categoryError, setCategoryError] = useState("");
  const [typeError, setTypeError] = useState("");  
  const [imgCoverError, setImgCoverError] = useState("");
  const [imagesError, setImagesError] = useState("");
  const [featureError, setFeatureError] = useState("");
  const [urlError, setUrlError] = useState("");  
  const [genreError, setGenreError] = useState("");

  /* -------------------------------------------------------------------------- */
  /*                                  Log Data                                  */
  /* -------------------------------------------------------------------------- */
  
  // * Fields
  // console.log(title);
  // console.log(description);
  // console.log(category);
  // console.log(type);
  // console.log(url);
  // console.log(features);
  // console.log(genreList);

  // * ImgCover
  // console.log("imgCover: " + imgCover);
  // console.log("imgCoverDB: " + imgCoverDb);

  // * Images
  // console.log("images");
  // console.log(images);
  // console.log("imagesDel");
  // console.log(imagesDel);
  // console.log("imagesDb");
  // console.log(imagesDb);
  // console.log("imagesAll");
  // console.log(imagesAll);
  
  
  /* -------------------------------------------------------------------------- */
  /*                             Redux State Reducer                            */
  /* -------------------------------------------------------------------------- */
  // const dispatch = useDispatch();

  const { _id } = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  // const webs = useSelector((state) => state.auth.webs);

  /* -------------------------------------------------------------------------- */
  /*                                Get Websites                                */
  /* -------------------------------------------------------------------------- */
  const getWebById = async () => {
    
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/webs/${id}`, {
      method: "GET",
    });

    const data = await response.json();

    data.map(item => ((
      setTitle(item.title),
      setDescription(item.description),
      setCategory(item.category),
      setType(item.type),
      setImgCoverDb(item.imgCover),
      setImagesDb(item.images),
      setImagesAll(item.images),
      setFeatures(item.features),
      setGenreList(item.genres),
      setUrl(item.url)
    )));
    
    setIsLoading(false);

  };

  /* -------------------------------------------------------------------------- */
  /*                                 Use Effect                                 */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    getWebById();
  }, [isUpdated]); // eslint-disable-line react-hooks/exhaustive-deps

  /* -------------------------------------------------------------------------- */
  /*                                 inputStyle                                 */
  /* -------------------------------------------------------------------------- */
  const inputStyle = {
		width: "100%",
    color: "#595959",
    // border: 1,
    // borderColor: "#CCCCCC",
    // borderRadius: "0.5rem",
    // padding: "0.5rem 0.5rem",
    my: 1
	};

  /* -------------------------------------------------------------------------- */
  /*                                  Features                                  */
  /* -------------------------------------------------------------------------- */

  // * addFeatures
  const addFeatures = () => {
    if (features.length >= 3) {
      setFeatureError("You already added 3 features")
      return
    } else if (feature === "") {
      setFeatureError("Please enter feature");
      return
    } else {
      setFeatureError("");
      setFeatures([...features, feature ]);
    }

    // after pushing the value, you may want to reset the input field
    setFeature('');
  };

  // * removeFeature
  const removeFeature = (item) => {
    setFeatures(current =>
      current.filter(position => {
        return position !== item;
      }),
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                    Genre                                   */
  /* -------------------------------------------------------------------------- */

  // * addGenre
  const addGenre = () => {
    if(genre === "") {
      setGenreError("Please enter genre");
      return
    } else {
      setGenreError("");
      setGenreList([...genreList, genre]);
    }
  }

  // * removeGenre
  const removeGenre = (item) => {
    setGenreList(current =>
      current.filter(position => {
        return position !== item;
      }),
    );
  }

  // * removeAllGenre
  // const removeAllGenre = () => {
  //   setGenreList([]);
  // }

  /* -------------------------------------------------------------------------- */
  /*                               Dropzone onDrop                              */
  /* -------------------------------------------------------------------------- */
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles?.length) {      
      if (acceptedFiles.length > 6) {
        setImagesError("Images are more than 6");
        return
      } else {

        setImagesError("");

        setImages(previousFiles => [
          ...previousFiles,
          ...acceptedFiles.map(file =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
          )
        ])

      }
    }

    if (rejectedFiles?.length) {
      setImagesRejected(previousFiles => [...previousFiles, ...rejectedFiles])
    }
  }, [])

  /* -------------------------------------------------------------------------- */
  /*                               Dropzone Hooks                               */
  /* -------------------------------------------------------------------------- */
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': []
    },
    maxSize: 1024 * 1024,
    maxFiles: 6,
    onDrop
  })

  /* -------------------------------------------------------------------------- */
  /*                            UseEffect for Images                            */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => images.forEach(file => URL.revokeObjectURL(file.preview))
  }, [images])

  /* -------------------------------------------------------------------------- */
  /*                                 removeFile                                 */
  /* -------------------------------------------------------------------------- */
  const removeFile = name => {
    setImages(files => files.filter(file => file.name !== name));
    setImagesAll(files => files.filter(file => file !== name));
  }

  /* -------------------------------------------------------------------------- */
  /*                          Remove File from Database                         */
  /* -------------------------------------------------------------------------- */
  const removeFileDb = name => {    
    // Remove From Local Variable
    setImagesDel([...imagesDel, name]);
    setImagesDb(files => files.filter(file => file !== name));
    setImagesAll(files => files.filter(file => file !== name));
  }

  /* -------------------------------------------------------------------------- */
  /*                                  removeAll                                 */
  /* -------------------------------------------------------------------------- */
  const removeAll = () => {
    // If you remove all save the Images all to imageDel inorder to delete Image on server
    setImagesDel(imagesAll);
    setImages([]);
    setImagesRejected([]);
    setImagesDb([]);
    setImagesAll([]);
  }

  /* -------------------------------------------------------------------------- */
  /*                               removeRejected                               */
  /* -------------------------------------------------------------------------- */
  const removeRejected = name => {
    setImagesRejected(files => files.filter(({ file }) => file.name !== name))
  }

  /* -------------------------------------------------------------------------- */
  /*                                handleSubmit                                */
  /* -------------------------------------------------------------------------- */
  const handleSubmit = async () => {
    
    // * Loading
    setIsLoading(true);

    // * Validation
    if (title === "" ) {
      setTitleError("Title Required");
      return
    } else {
      setTitleError("");
    }
    
    if (description === "" ) {
      setDescriptionError("Description Required");
      return
    } else {
      setDescriptionError("");
    }
    
    if (category === "" ) {
      setCategoryError("Category Required");
      return
    } else {
      setCategoryError("");
    }
        
    if (type === "" ) {
      setTypeError("Type Required");
      return
    } else {
      setTypeError("");
    }
        
    if (url === "" ) {
      setUrlError("URL Required");
      return
    } else {
      setUrlError("");
    }
    
    if (features.length === 0) {
      setFeatureError("Feature Required");
      return
    } else {
      setFeatureError("");
    }

    if(genreList.length === 0) {
      setGenreError("Please Insert at least 1 Genre");
    } else {
      setGenreError("");
    }

    if (imgCover === null && imgCoverDb === null) {
      setImgCoverError("Image Cover Required");
      return
    } else {
      setImgCoverError("");
    }

    if (images.length === 0 && imagesAll.length === 0) {
      setImagesError("Images Required");
      return
    } else if (images.length + imagesAll.length > 6) {
      setImagesError("You have more than 6 Images");
      return
    } else {
      setImagesError("");
    }

    // * Data Structure
    const formData = new FormData();
    formData.append("userId", _id);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("type", type);
    formData.append("url", url);

    // * Featrures
    features.forEach((feat) => (
      formData.append("features", feat)
    ));

    // * Genre
    genreList.forEach((genre) => (
      formData.append("genres", genre)
    ));

    // * ImageCover (Upload)
    if (imgCover) {
      imgCover.forEach(img => ((
        formData.append("imgWebFile", img),
        formData.append("imgCover", img.name)
      )));
    }

    // * ImageCoverDb (From Database)
    if (imgCoverDb) {
      formData.append("imgCoverDb", imgCoverDb)
    }

    // * Images
    if (images) {
      images.forEach((img) => ((
        formData.append('imgWebFile', img),
        formData.append('images', img.name)
      )));
    }

    // * ImagesDb
    if (imagesDb) {
      imagesDb.forEach((img) => ((
        formData.append('imagesDb', img)
      )));
    }

    // * ImagesAll
    if (imagesAll) {
      imagesAll.forEach((img) => ((
        formData.append('imagesAll', img)
      )));
    }

    // * ImagesDel
    if (imagesDel) {
      imagesDel.forEach((img) => ((
        formData.append('imagesDel', img)
      )));
    }

    // * Log Form Data
    // for (var pair of formData.entries()) {
    //   console.log(pair[0]+ ', ' + pair[1]);
    // }

    // * Send to Server
    // const response = await fetch(`${process.env.REACT_APP_BASE_URL}/webs/${id}/update`, {
    await fetch(`${process.env.REACT_APP_BASE_URL}/webs/${id}/update`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    // * Alert
    // alert(JSON.stringify(`${response.message}, status: ${response.status}`));
    // console.log(response)

    // * Response Data
    // const data = await response.json();

    // * Store in State Redux
    // dispatch(setWebs({ webs: data }));
    
    // * Update to call getwebsite
    setIsUpdated(true);

    // * Reset Data
    setTitle("");
    setDescription("");
    setCategory("client");
    setType("static");
    setImgCover(null);
    setImgCoverDb(null);
    setImages([]);
    setImagesDb([]);
    setImagesDel([]);
    setImagesAll([]);
    setFeatures([]);
    setUrl("");

    // * Reset Loading
    setIsLoading(false);
  };
    
  /* -------------------------------------------------------------------------- */
  /*                                handleDelete                                */
  /* -------------------------------------------------------------------------- */
  const handleDelete = async () => {

    // * Data Structure
    const formData = new FormData();
    formData.append("userId", _id);

    // * ImageCoverDb (From Database)
    if (imgCoverDb) {
      formData.append("imgCoverDb", imgCoverDb)
    }

    // * ImagesDb
    if (imagesDb) {
      imagesDb.forEach((img) => ((        
        formData.append('imagesDb', img)
      )));
    }

    // * Send to Server
    // const response = await fetch(`${process.env.REACT_APP_BASE_URL}/webs/${id}/delete`, {
    await fetch(`${process.env.REACT_APP_BASE_URL}/webs/${id}/delete`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,        
      },
      body: formData,
    });

    // * Return
    // const data = await response.json();
    
    // * Store in State Redux
    // dispatch(setWebs({ webs: data }));

    // * Back to Prev Page
    navigate(-1);

  }

  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div
			className={`
				h-full
				xx:px-4 md:px-14
				py-10
				mt-[45px]
			`}
		>			
      {
        isLoading ? 
          <Loading />
        : 
          <div>
            <DeleteModal 
              title={title}
              isDeleted={isDeleted} 
              setIsDeleted={setIsDeleted}
              handleDelete={handleDelete}
            />

            {/* --------------------------------- Header --------------------------------- */}
            <div 
              className={`
                w-full
                justify-between
                md:flex                
              `}
            >              
              <h1
                className={`
                  xx:text-center
                  md:text-start
                  xx:text-xl
                  md:text-4xl
                  font-bold
                  text-gray-700
                  dark:text-white
                `}
              >
                Update Websites
              </h1> 
              
              {/* Delete Website */}
              <button 
                type="button"
                onClick={ () => setIsDeleted(!isDeleted) }
                className={`
                  xx:w-full
                  md:w-auto
                  text-white
                  bg-red-400
                  hover:bg-red-500
                  xx:text-xs
                  sm:text-sm 
                  font-medium

                  rounded-lg
                  px-5 
                  py-2.5 
                  text-center
                  items-center
                  xx:mt-5
                  md:mt-0
                `}
              >  				
                Delete Website          
              </button>        

            </div>


            {/* ---------------------------------- Form ---------------------------------- */}
            <div
              className={`
                md:mt-10
                md:m-0
                
                border
                rounded-lg
                p-5
                mt-5
              `}
            >
              {/* ---------------------------------- Title --------------------------------- */}
              
              <TextField
                label="Title"
                placeholder="Title"
                onChange={(e) => setTitle(e.target.value)}
                value={ title }
                sx={inputStyle}
              />

              {/* Error Log */}
              <div className={titleError ? `mt-1 text-center p-2 bg-red-400 text-white` : `` } >
                {titleError}
              </div>

              {/* ------------------------------- Description ------------------------------ */}

              <TextField
                label="Description"
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
                value={ description }
                multiline
                rows={4}
                sx={inputStyle}
              />

              {/* Error Log */}
              <div className={descriptionError ? `mt-1 text-center p-2 bg-red-400 text-white` : ``} >
                {descriptionError}
              </div>

              {/* ----------------------------- Cateogry & Type ---------------------------- */}
              <FlexBetween gap="0.5rem" my="0.5rem">
                
                {/* Category */}
                <Select 
                  label="Category"
                  placeholder="Category"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                  sx={inputStyle}
                >
                  <MenuItem value="client">Client</MenuItem>
                  <MenuItem value="demo">Demo</MenuItem>
                </Select>

                {/* Type */}
                <Select 
                  label="Type"
                  placeholder="Type"
                  onChange={(e) => setType(setType.target.value)}
                  value={type}
                  sx={inputStyle}
                >
                  <MenuItem value="static">Static</MenuItem>
                  <MenuItem value="dynamic">Dynamic</MenuItem>
                </Select>

                {/* <select 
                  required
                  onChange={(e) => setType(e.target.value)}
                  className={`
                    w-full 
                    px-2.5
                    py-3
                    border 
                    border-gray-300 
                    text-gray-900 
                    text-sm 
                    rounded-lg 
                    block
                    dark:bg-gray-700 
                    dark:border-gray-600 
                    dark:placeholder-gray-400 
                    dark:text-white
                    capitalize
                  `}
                >
                  <option value={type}>{type}</option>
                  <option value="static">static</option>
                  <option value="dynamic">dynamic</option>
                </select> */}
              
              </FlexBetween>

              {/* Category Error Log */}
              <div className={categoryError ? `mt-1 text-center p-2 bg-red-400 text-white` : ``} >
                {categoryError}
              </div>

              {/* Type Error Log */}
              <div className={typeError ? `mt-1 text-center p-2 bg-red-400 text-white` : ``}>
                {typeError}
              </div>

              {/* ----------------------------------- Url ---------------------------------- */}
              
              <TextField
                label="Url"
                placeholder="URL"
                onChange={(e) => setUrl(e.target.value)}
                value={ url }
                sx={inputStyle}
              />

              {/* Error Log */}
              <div className={urlError ? `mt-1 text-center p-2 bg-red-400 text-white` : ``} >
                {urlError}
              </div>

              {/* -------------------------------- Features -------------------------------- */}
              <div>
                
                {
                  features.length < 3 
                  ? <TextField
                      label="Features"
                      placeholder="3 Features"
                      onChange={(e) => setFeature(e.target.value)}
                      value={ feature }
                      multiline
                      rows={4}
                      sx={inputStyle}
                    />
                  : <></>
                }
                
                <button
                  onClick={addFeatures}
                  className={` 
                    w-full
                    py-1
                    text-base
                    uppercase
                    
                    font-bold
                    text-sky-400
                    border
                    border-sky-400
                    rounded-md
                    px-3
                    hover:bg-sky-400
                    hover:text-white
                    transition-colors 
                  `}
                >
                  Add Features
                </button>
                
                {/* Features Error Log */}
                <div className={featureError ? `mt-1 text-center p-2 bg-red-400 text-white` : ``}>
                  {featureError}
                </div>
                
                {
                  features.map((item, index) => (
                    <ul key={index} className={`border mt-5 p-2 rounded-md`}>
                      <li className='relative'>
                        {item}

                        <button
                          type='button'
                          onClick={() => removeFeature(item)}
                          className={`
                            absolute 
                            -top-5
                            -right-5
                            w-7 
                            h-7 
                            border 
                            border-secondary-400 
                            bg-secondary-400 
                            rounded-full 
                            flex 
                            justify-center 
                            items-center  
                            bg-white
                            hover:bg-white
                          `}
                        >
                          <CloseOutlined 
                            className={`
                              w-5
                              h-5
                              hover:fill-secondary-400
                            `} 
                          />
                        </button>

                      </li>
                    </ul>
                  ))      
                }
              </div>
              
              {/* ---------------------------------- Genre --------------------------------- */}
              <div>
               
                <TextField
                  label="Genre"
                  placeholder="Genre"
                  onChange={(e) => setGenre(e.target.value)}
                  value={ genre }
                  sx={inputStyle}
                />
                
                <button
                  onClick={ addGenre }
                  className={` 
                    w-full
                    py-1
                    text-base
                    uppercase
                    
                    font-bold
                    text-sky-400
                    border
                    border-sky-400
                    rounded-md
                    px-3
                    hover:bg-sky-400
                    hover:text-white
                    transition-colors 
                  `}
                >
                  Add Genre
                </button>

                {/* Error Log */}
                <div className={genreError ? `mt-1 text-center p-2 bg-red-400 text-white` : ``}>
                  {genreError}
                </div>

                {
                  genreList.map((item, index) => (
                    <ul key={index} className={`border mt-5 p-2 rounded-md`}>
                      <li className='relative'>
                        
                        {item}

                        <button
                          type='button'
                          onClick={() => removeGenre(item)}
                          className={`
                            absolute 
                            -top-5
                            -right-5
                            w-7 
                            h-7 
                            border 
                            border-secondary-400 
                            bg-secondary-400 
                            rounded-full 
                            flex 
                            justify-center 
                            items-center  
                            bg-white                                               
                            hover:bg-white
                          `}
                        >
                          <CloseOutlined className={`
                            w-5 
                            h-5                           
                            hover:fill-secondary-400                           
                            `} 
                          />
                        </button>

                      </li>
                    </ul>
                  ))      
                }
              </div>

              {/* ----------------------------- Image Cover ---------------------------- */}
              <Dropzone
                acceptedFiles=".jpg,.jpeg,.png"
                multiple={ false }
                onDrop={(acceptedFiles, rejectedFiles, images) => 
                  setImgCover(acceptedFiles.map(file =>
                    Object.assign(file, { preview: URL.createObjectURL(file) })
                  ))
                }
              > 
                {({ getRootProps, getInputProps }) => (
                  <FlexBetween>
                    <Box
                      {...getRootProps()}
                      // border={`2px dashed ${palette.primary.main}`}
                      width="100%"
                      sx={{ "&:hover": { cursor: "pointer" } }}
                    >
                      <div className='mt-1 mb-2'>
                        <h1 
                          className={`
                            text-gray-600
                            text-base font-bold
                          `}
                        >
                          Image Cover
                        </h1>
                      </div>

                      <div 
                        className={`
                          flex flex-col 
                          items-center 
                          gap-4 border p-4 
                          rounded-lg 
                          border-gray-300                        
                        `}
                      >
                      
                        <input {...getInputProps()} />
                        {
                          imgCover
                          ? (
                              <div className='relative '>
                                {
                                  imgCover.map(file => (
                                    <img
                                      key={file.name}
                                      src={file.preview}
                                      alt={file.name}
                                      width={100}
                                      height={100}
                                      onLoad={() => {
                                        URL.revokeObjectURL(file.preview)
                                      }}
                                      className='h-[50%] w-[50%] object-contain rounded-md mx-auto'
                                    />
                                  ))
                                }
                                
                                <div className='absolute top-2 right-2 p-2 bg-gray-200 rounded-[50%]'>
                                  <EditOutlined className='text-gray-700'/>
                                </div>
                              </div>
                            )
                          : (
                              <div className='relative'>
                                <img
                                  key={imgCoverDb}
                                  src={imgCoverDb ? `${process.env.REACT_APP_BASE_URL}/websites/${imgCoverDb}` : ``}
                                  alt={imgCoverDb}
                                  width={100}
                                  height={100}
                                  className='h-full w-full object-contain rounded-md'
                                />

                                <div className='absolute top-5 right-5'>
                                  <div 
                                    className={`
                                      flex gap-1 
                                      text-center 
                                      bg-gray-400 hover:bg-gray-500 
                                      text-white rounded-full p-2
                                    `}
                                  >
                                    <EditOutlined className='w-5 h-5 fill-current' />
                                  </div>
                                </div>
                              </div>
                            )   
                        }
                      
                        {imgCover && (
                          <IconButton
                            onClick={() => setImgCover(null)}
                            sx={{ width: "10%" }}
                          >
                            <DeleteOutlined />
                          </IconButton>
                        )}
                      </div>
                      
                    </Box>
                    
                  </FlexBetween>
                )}
              </Dropzone>
              
              {/* imgCover Error Log */}
              <div className={imgCoverError ? `mt-1 text-center p-2 bg-red-400 text-white` : ``}>
                {imgCoverError}
              </div>
              
              {/* --------------------------------- Images --------------------------------- */}
              {
                imagesAll.length + images.length >= 6 ? 
                  <div></div>
                : 
                  <div
                    {...getRootProps()}
                  >
                    <div className='mt-1 mb-2'>
                      <h1>Images</h1>
                    </div>
                                  
                    <input {...getInputProps()} />

                    <div 
                      className={`
                        flex flex-col 
                        items-center justify-center 
                        gap-4 cursor-pointer 
                        border p-4 
                        rounded-lg border-gray-300
                      `}
                    
                    >
                      <ArrowUpwardOutlined className='w-5 h-5 fill-current' />
                      {isDragActive ? (
                        <p className='xx:text-xs'>Drop the files here ...</p>
                      ) : (
                        <p className='xx:text-xs lg:text-base'>Drag & drop files here, or click to select files</p>
                      )}
                    </div>

                  </div>
              }

              {/* Preview */}
              <section className='mt-5'>
                            
                {/* Accepted files */}
                <div className='border-b pb-3 flex w-full justify-between'>
                  <h3 className='title text-base font-semibold text-neutral-600'>
                    Accepted Images
                  </h3>
                  <button
                    type='button'
                    onClick={removeAll}
                    className={`
                      mt-1 
                      text-[10px] 
                      uppercase 
                      tracking-wider 
                      font-semibold
                      text-sky-500 
                      border 
                      border-sky-500
                      rounded-md 
                      px-3
                      hover:bg-sky-500
                      hover:text-white 
                      transition-colors
                    `}
                  >
                    Remove all files
                  </button>
                </div>
                
                <ul 
                  className={`
                    mt-6 
                    grid 
                    grid-cols-1 
                    xx:grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-4
                    gap-10
                  `}
                >

                  {              
                    // From File Upload
                    images.map(file => (
                      <li 
                        key={file.name} 
                        className='relative h-32 rounded-md shadow-lg'
                      >
                        <img
                          src={file.preview}
                          alt={file.name}
                          width={100}
                          height={100}
                          onLoad={() => {
                            URL.revokeObjectURL(file.preview)
                          }}
                          className='h-full w-full object-contain rounded-md'
                        />

                        <button
                          type='button'
                          onClick={() => removeFile(file.name)}
                          className={`
                            absolute
                            -top-3
                            -right-3
                            w-7
                            h-7
                            rounded-full
                            flex
                            justify-center
                            items-center
                            bg-red-400
                            text-white
                          `}
                        >
                          <CloseOutlined className={`w-5 h-5`}
                          />
                        </button>

                        <p className='mt-2 text-neutral-500 text-[8px] font-medium'>
                          {file.name}
                        </p>
                      </li>
                    ))
                  }
                  {
                    // From DB Server
                    imagesDb.map(file => (
                      <li 
                        key={file} 
                        className='relative h-32 rounded-md shadow-lg'
                      >
                        <img
                          src={imagesDb ? `${process.env.REACT_APP_BASE_URL}/websites/${file}` : ``}
                          alt={file}
                          width={100}
                          height={100}
                          onLoad={() => {
                            URL.revokeObjectURL(file)
                          }}
                          className='h-full w-full object-contain rounded-md'
                        />

                        <button
                          type='button'
                          onClick={() => removeFileDb(file)}
                          className={`
                            absolute
                            -top-3
                            -right-3
                            w-7
                            h-7
                            rounded-full
                            flex
                            justify-center
                            items-center
                            bg-red-400
                            text-white
                          `}
                        >
                          <CloseOutlined className={`w-5 h-5`} 
                          />
                        </button>
                        <p className='mt-2 text-neutral-500 text-[8px] font-medium'>
                          {file}
                        </p>
                      </li>
                    ))

                  }

                </ul>

                {/* Rejected Images */}
                <h3 
                  className={`title text-base font-semibold text-neutral-600 border-b pb-3 
                    ${images.length > 0 || imagesDb.length > 0 ? `mt-24` : `mt-0`}
                  `}
                >
                  Rejected Images
                </h3>

                <ul className='mt-6 flex flex-col'>
                  {imagesRejected.map(({ file, errors }) => (
                    <li key={file.name} className='flex items-start justify-between'>
                      
                      <div>

                        <p className='mt-2 text-neutral-500 text-sm font-medium'>
                          {file.name}
                        </p>

                        <ul className='text-[12px] text-red-400'>
                          {errors.map(error => (
                            <li key={error.code}>{error.message}</li>
                          ))}
                        </ul>

                      </div>

                      <button
                        type='button'
                        onClick={() => removeRejected(file.name)}
                        className={`
                          mt-1 
                          py-1 
                          text-[12px] 
                          uppercase 
                          tracking-wider 
                          font-bold 
                          text-neutral-500
                          border 
                          border-secondary-400 
                          rounded-md px-3 
                          hover:bg-secondary-400 
                          hover:text-white 
                          transition-colors
                        `}
                      >
                        remove
                      </button>

                    </li>
                  ))}
                </ul>

                {/* Images Error Log */}
                {                
                  <div className={imagesError ? `mt-1 mb-10 text-center p-2 bg-red-400 text-white` : ``} >
                    {imagesError}
                  </div>
                }

              </section>
              
              <button              
                onClick={handleSubmit}
                className={`
                  w-full
                  bg-sky-400
                  px-3
                  py-3
                  uppercase
                  text-xl
                  font-bold
        
                  rounded-md
                  hover:bg-sky-500
                  text-white
                  transition-colors
                `}
              >
                Submit
              </button>

            </div>
          </div>
      }

		</div>
  )
}

export default AdminWebsiteDetails;