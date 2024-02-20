import React, { 
  useCallback, 
  useEffect, 
  useState 
} from 'react'

/* ---------------------------------- Redux --------------------------------- */
import { 
  // useDispatch, 
  useSelector 
} from "react-redux";
// import { setWebs } from '../../state/authReducer';

/* ------------------------------- Material UI ------------------------------ */
import {       
  // Typography,
  // Button,
  Box,
  InputBase, 
  // InputLabel,
  // Select,
  // MenuItem,
  IconButton
} from '@mui/material';

/* -------------------------------- MUI Icons ------------------------------- */
import { 
  DeleteOutlined,
  EditOutlined,
  // TextFields,
  ArrowUpwardOutlined,
  CloseOutlined,
} from '@mui/icons-material';

/* -------------------------------- Dropzone -------------------------------- */
import Dropzone, { 
  useDropzone 
} from 'react-dropzone';

/* -------------------------------- Component ------------------------------- */
import FlexBetween from '../MuiComponents/FlexBetween';

/* -------------------------------------------------------------------------- */
/*                                 CreateModal                                */
/* -------------------------------------------------------------------------- */
const CreateModal = ({
  isOpen, 
  setIsOpen, 
  actionType, 
  websiteAdded, 
  setWebsiteAdded 
}) => {
    
  /* -------------------------------------------------------------------------- */
  /*                                    Date                                    */
  /* -------------------------------------------------------------------------- */
  // const date = new Date();
  // let day = date.getDate();
  // let month = date.getMonth() + 1;
  // let year = date.getFullYear();

  /* -------------------------------------------------------------------------- */
  /*                                Website Data                                */
  /* -------------------------------------------------------------------------- */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("client");  
  const [type, setType] = useState("static");
  
  const [imgCover, setImgCover] = useState(null);
  
  const [images, setImages] = useState([]);
  const [imagesRejected, setImagesRejected] = useState([]);
  
  const [featureList, setFeatureList] = useState([]);
  const [feature, setFeature] = useState("");
  
  const [url, setUrl] = useState("");
  
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
  // console.log(title);
  // console.log(description);
  // console.log(category);
  // console.log(type);
  // console.log(url);
  // console.log(imgCover);
  // console.log(images);
  // console.log(featureList);
  // console.log(genreList);

  /* -------------------------------------------------------------------------- */
  /*                             Redux State Reducer                            */
  /* -------------------------------------------------------------------------- */
  // const dispatch = useDispatch();

  const { _id } = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  
  // console.log(token)

  /* -------------------------------------------------------------------------- */
  /*                                  useEffect                                 */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
		setWebsiteAdded(!websiteAdded);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* -------------------------------------------------------------------------- */
  /*                                  Features                                  */
  /* -------------------------------------------------------------------------- */

  // * addFeatures 
  const addFeatures = () => {
    if (featureList.length >= 3) {
      setFeatureError("You already added 3 features");
      return
    } else if(feature === "") {
      setFeatureError("Please enter feature");
      return
    } else {
      setFeatureError("");
      setFeatureList([...featureList, feature ]);
    }
      
    // after pushing the value, you may want to reset the input field
    setFeature('');
  };
  
  // * Remove Feature 
  const removeFeature = (item) => {
    setFeatureList(current =>
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
   if (genre === "") {
      setGenreError("Please enter genre");
      return
    } else {            
      setGenreList([...genreList, genre]);
      setGenreError("");
      setGenre("");
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
      if(acceptedFiles.length > 6 ) {
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
    maxSize: 1024 * 1000,
    onDrop
  })

  /* -------------------------------------------------------------------------- */
  /*                               File useEffect                               */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => images.forEach(file => URL.revokeObjectURL(file.preview))
  }, [images])

  /* -------------------------------------------------------------------------- */
  /*                                 removeFile                                 */
  /* -------------------------------------------------------------------------- */
  const removeFile = name => {
    setImages(files => files.filter(file => file.name !== name))
  }

  /* -------------------------------------------------------------------------- */
  /*                                  removeAll                                 */
  /* -------------------------------------------------------------------------- */
  const removeAll = () => {
    setImages([])
    setImagesRejected([])
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

    if (featureList.length === 0) {
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

    if (imgCover === null) {
      setImgCoverError("Image Cover Required");
      return
    } else {
      setImgCoverError("");
    }
    
    if (images.length === 0) {
      setImagesError("Images Required");
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
    featureList.forEach((feature) => (
      formData.append("features", feature)
    ));

    // * Genre
    genreList.forEach((genre) => (
      formData.append("genres", genre)
    ));

    // * ImageCover
    if (imgCover) {
      imgCover.forEach(img => ((
        formData.append("imgWebFile", img),
        formData.append("imgCover", img.name)
      )));
    }

    // * Images
    if (images) {
      images.forEach((img) => ((
        formData.append('imgWebFile', img),
        formData.append('images', img.name)
      )));
    }

    // * Log Form Data
    // for (var pair of formData.entries()) {
    //   console.log(pair[0]+ ', ' + pair[1]);
    // }

    // * Send to Server
    // const response = await fetch(`${process.env.REACT_APP_BASE_URL}/webs`, {
    await fetch(`${process.env.REACT_APP_BASE_URL}/webs`, {
      method: "POST",
      headers: {         
        Authorization: `Bearer ${token}`
        // 'Content-Type': 'application/json',
        // 'Content-Type': 'multipart/form-data',
        // 'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
      },
      body: formData,
    });

    // * Alert
    // alert(JSON.stringify(`${response.message}, status: ${response.status}`));
    // console.log(response)

    // * Return
    // const data = await response.json();
    
    // * Store in State Redux
    // dispatch(setWebs({ webs: data }));
    
    // * Refetch Website
    setWebsiteAdded(!websiteAdded);

    // * Reset Data
    setTitle("");
    setDescription("");
    setCategory("client");
    setType("static");
    setImgCover(null);
    setImages([]);
    setFeatureList([]);
    setUrl("");    
  };

  /* -------------------------------------------------------------------------- */
  /*                                    Style                                   */
  /* -------------------------------------------------------------------------- */
  const inputStyle = {
		width: "100%",
    color: "#595959",
    border: 1,
    borderColor: "#CCCCCC",
    borderRadius: "0.5rem",
    padding: "0.5rem 0.5rem",
    my: 1
	};

  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div
      className={`
        relative z-10 
        ${ isOpen ? `block`: `hidden` }
      `}
    >
    
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div 
          className={`
            flex min-h-full 
            items-end 
            justify-center 
            p-4 sm:p-0
            text-center sm:items-center
          `}
        >
        
          <div 
            className={`
              relative transform 
              overflow-hidden rounded-lg 
              bg-white text-left 
              shadow-xl transition-all 
              p-5 my-8 
              xx:w-full
              xs:w-[80%]
              sm:w-[60%]
              md:w-[40%]
            `}
          
          >
          
            {/* Header */}
            <div className='text-lg font-bold text-slate-800 pb-3 border-b'>
              <h1>
                {actionType} Website          
              </h1>

              <button
                type='button'
                onClick={ () => setIsOpen(!isOpen) }
                className={`
                  absolute
                  top-3
                  right-3
                  w-7
                  h-7
                  rounded-full
                  flex
                  justify-center
                  items-center                  
                  text-gray-600
                `}
              >
                <CloseOutlined className={`w-5 h-5`}/>
              </button>
            </div>
           
            {/* Form */}
            <div className='mt-5'>
              
              {/* ---------------------------------- Title --------------------------------- */}
              <InputBase
                placeholder="Title"
                onChange={(e) => setTitle(e.target.value)}
                value={ title }
                sx={inputStyle}
              />
              
              {/* Title Error Log */}
              <div className={titleError ? `mt-1 text-center p-2 bg-red-400 text-white` : `` } >
                {titleError}
              </div>

              {/* ------------------------------- Description ------------------------------ */}
              <InputBase
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
                value={ description }
                multiline
                rows={4}
                sx={inputStyle}
              />

              {/* Description Error Log */}
              <div className={descriptionError ? `mt-1 text-center p-2 bg-red-400 text-white` : ``} >
                {descriptionError}
              </div>
              
              {/* ----------------------------- Category & Type ---------------------------- */}
              <FlexBetween gap="0.5rem" my="0.5rem">

                {/* Category */}
                <select 
                  required
                  onChange={(e) => setCategory(e.target.value)}
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
                  `}
                >
                  <option value="client">Client</option>
                  <option value="demo">Demo</option>                
                </select>

                {/* Type */}
                <select 
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
                  `}
                >
                  <option value="static">Static</option>
                  <option value="dynamic">Dynamic</option>                
                </select>
              
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
              <InputBase
                placeholder="URL"
                onChange={(e) => setUrl(e.target.value)}
                value={ url }
                sx={inputStyle}
              />

              {/* URL Error Log */}
              <div className={urlError ? `mt-1 text-center p-2 bg-red-400 text-white` : ``} >
                {urlError}
              </div>

              {/* -------------------------------- Features -------------------------------- */}
              <div>            
                
                {
                  featureList.length < 3 
                  ? <InputBase
                      placeholder="Features"
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
                  featureList.map((item, index) => (
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

              {/* ---------------------------------- Genre --------------------------------- */}
              <div>
     
                <InputBase
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

                {/* Genre Error Log */}
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

              {/* ------------------------------- Image Cover ------------------------------ */}
              <Dropzone
                acceptedFiles=".jpg,.jpeg,.png"
                multiple={false}
                onDrop={(acceptedFiles) => setImgCover(acceptedFiles.map(file =>
                  Object.assign(file, { preview: URL.createObjectURL(file) })
                  )
                )}
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
                        <h1>Cover Image</h1>
                      </div>

                      <div className='flex flex-col items-center gap-4 border p-4 rounded-lg border-gray-300'>
                                                                                          
                        <input {...getInputProps()} />
                        {
                          !imgCover ? 
                            (
                              <div className='flex gap-4 text-center'>
                                <ArrowUpwardOutlined className='w-5 h-5 fill-current' />
                                <p className=''>Add Cover Photo</p>
                              </div>
                            )
                          : 
                            (
                              <div className='relative'>
                                {imgCover.map(file => (
                                  <img 
                                    key={file.name}
                                    src={file.preview}
                                    alt={file.name}
                                    width={100}
                                    height={100}
                                    onLoad={() => {
                                      URL.revokeObjectURL(file.preview)
                                    }}
                                    className='h-full w-full object-contain rounded-md'
                                  />                            
                                ))}
                                
                                <div className='absolute top-2 right-2 p-2 bg-gray-200 rounded-[50%]'>
                                  <EditOutlined className='text-gray-700'/>  
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
                images.length >= 6 ? 
                  <div></div>
                : 
                  <div
                    {...getRootProps({
                      // className: className
                    })}
                  >
                    <div className='mt-1 mb-2'>
                      <h1>Images</h1>
                    </div>
                                  
                    <input {...getInputProps()} />
      
                    <div className='flex flex-col items-center justify-center gap-4 cursor-pointer border p-4 rounded-lg border-gray-300'>
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
                
                {/* Images Error Log */}
                {                
                  <div className={imagesError ? `mt-1 text-center p-2 bg-red-400 text-white` : ``} >
                    {imagesError}
                  </div>
                }

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

                  {images.map(file => (
                    <li key={file.name} className='relative h-32 rounded-md shadow-lg'>
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
                          border 
                          border-secondary-400 
                          bg-secondary-400 
                          rounded-full 
                          flex 
                          justify-center 
                          items-center                                                 
                          hover:bg-white 
                          transition-colors
                        `}
                      >
                        <CloseOutlined className={`
                          w-5 
                          h-5 
                          fill-white 
                          hover:fill-secondary-400 
                          transition-colors
                          `} 
                        />
                      </button>
                      <p className='mt-2 text-neutral-500 text-[8px] font-medium'>
                        {file.name}
                      </p>
                    </li>
                  ))}

                </ul>

                {/* Rejected Images */}
                <h3 className={`title text-base font-semibold text-neutral-600 border-b pb-3 ${images.length > 0 ? `mt-24` : `mt-0`}`}>
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
        </div>
      </div>

    </div>
  )
}

export default CreateModal
