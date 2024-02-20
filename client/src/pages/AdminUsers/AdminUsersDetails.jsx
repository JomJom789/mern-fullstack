import React, {
  useEffect,
  useState,
  // useCallback,
} from 'react';

/* --------------------------------- Router --------------------------------- */
import {
  // useNavigate,
  useParams,
} from 'react-router-dom';

/* ---------------------------------- Redux --------------------------------- */
import {   
  useSelector,
  useDispatch,
} from "react-redux";

import { setLogin } from "../../state/authReducer";

/* ------------------------------ State Reducer ----------------------------- */
import { setLogout } from "../../state/authReducer";

/* ------------------------------- Material UI ------------------------------ */
import {
  Box,
  // InputBase,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';

/* -------------------------------- MUI Icon -------------------------------- */
import {
  DeleteOutlined,
  EditOutlined,
  CloseOutlined,
  Visibility,
  CloseFullscreenOutlined,
} from '@mui/icons-material';

/* -------------------------------- Dropzone -------------------------------- */
import Dropzone, { 
  // useDropzone,
} from 'react-dropzone';

/* ------------------------------- Components ------------------------------- */
import { Loading } from '../../components';
import DeleteModal from '../../components/Modal/DeleteModal';
import FlexBetween from '../../components/MuiComponents/FlexBetween'

/* -------------------------------------------------------------------------- */
/*                              AdminUsersDetails                             */
/* -------------------------------------------------------------------------- */
const AdminUsersDetails = () => {

  /* -------------------------------------------------------------------------- */
  /*                                    Param                                   */
  /* -------------------------------------------------------------------------- */
  const { id } = useParams();
  // const navigate = useNavigate();

  /* -------------------------------------------------------------------------- */
  /*                             Redux State Reducer                            */
  /* -------------------------------------------------------------------------- */
  const dispatch = useDispatch();

  const { _id } = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  
  /* -------------------------------------------------------------------------- */
  /*                                  Triggers                                  */
  /* -------------------------------------------------------------------------- */
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  
  // * Show Current Password
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showConfirmCurrentPassword, setShowConfirmCurrentPassword] = useState(false);

  // * Show New Password
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // * Update Password
  const [currentPasswordUpdateTrigger, setCurrentPasswordUpdateTrigger] = useState(true);
  const [newPasswordUpdateTrigger, setNewPasswordUpdateTrigger] = useState(true);

  /* -------------------------------------------------------------------------- */
  /*                                    Data                                    */
  /* -------------------------------------------------------------------------- */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [type, setType] = useState("");
  const [activated, setActivated] = useState(false);

  // * Profile
  const [profileImg, setProfileImg] = useState(null);
  const [profileImgDB, setprofileImgDB] = useState("");

  // * Fields
  const [fieldList, setFieldList] = useState([]);
  const [field, setField] = useState("");

  // * Auth
  const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  
  // * Password Input
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [currentConfirmPasswordInput, setCurrentConfirmPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [newConfrimPasswordInput, setNewConfirmPasswordInput] = useState("");

  // * Log Password Input
  // console.log(currentPasswordInput);
  // console.log(currentConfirmPasswordInput);
  // console.log(newPasswordInput);
  // console.log(newConfrimPasswordInput);
  
  // * Followers
  const [followers, setFollowers] = useState([]);

  // * Date
  const [createdAt, setCreateAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  /* -------------------------------------------------------------------------- */
  /*                                Projects Data                               */
  /* -------------------------------------------------------------------------- */
  
  // * Projects
  const [webs, setWebs] = useState([]);
  const [mobiles, setMobiles] = useState([]);

  // * Triggers
  const [isWebLoading, setIsWebLoading] = useState(true);
  const [isMobileLoading, setIsMobileLoading] = useState(true);

  /* -------------------------------------------------------------------------- */
  /*                                     Log                                    */
  /* -------------------------------------------------------------------------- */
  // console.log("User ID: " + id);
  // console.log("Your ID: " + _id);
  // console.log(firstName);
  // console.log(lastName);
  // console.log(email);
  // console.log(password);
  // console.log(role);
  // console.log("Profile Img: " + profileImg);
  // console.log("Profile Img DB: " + profileImgDB);
  // console.log(type);
  // console.log(fieldList);

  /* -------------------------------------------------------------------------- */
  /*                                    Error                                   */
  /* -------------------------------------------------------------------------- */
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");  
  const [roleError, setRoleError] = useState("");
  const [profileImgError, setProfileImgError] = useState("");
  const [fieldsError, setFieldsError] = useState("");

  // * Auth Error
  const [emailError, setEmailError] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");

  /* -------------------------------------------------------------------------- */
  /*                               Get User By ID                               */
  /* -------------------------------------------------------------------------- */
  const getUserById = async () => {
    
    // * Fetch
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // * Response
    const data = await response.json();
    
    // * Data
    setFirstName(data.firstName);
    setLastName(data.lastName);
    setEmail(data.email);
    // setPassword(data.password);
    setRole(data.role);
    setprofileImgDB(data.picturePath);
    setType(data.type);
    setActivated(data.activated);
    setFieldList(data.fields);
    setFollowers(data.followers);
    setCreateAt(data.createdAt);
    setUpdatedAt(data.updatedAt);

    // * Loading
    setIsLoading(false);

  };

  /* -------------------------------------------------------------------------- */
  /*                               Get Webs By User ID                          */
  /* -------------------------------------------------------------------------- */
  const getWebsById = async () => {
    
    // * Fetch
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/webs/${_id}/webs`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // * Response
    const data = await response.json();

    // * Data
    setWebs(data);
    // console.log(data);

    // * Loading
    setIsWebLoading(false);

  };

  /* -------------------------------------------------------------------------- */
  /*                              Get Mobiles By User ID                        */
  /* -------------------------------------------------------------------------- */
  const getMobilesById = async () => {
    
    // * Fetch
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/mobiles/${_id}/mobiles`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // * Response
    const data = await response.json();
    
    // * Data
    setMobiles(data);
    // console.log(data);

    // * Loading
    setIsMobileLoading(false);

  };

  /* -------------------------------------------------------------------------- */
  /*                                 Use Effect                                 */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    getUserById();
    getWebsById();
    getMobilesById();
    setIsUpdated(false);
  }, [isUpdated, id]); // eslint-disable-line react-hooks/exhaustive-deps

  /* -------------------------------------------------------------------------- */
  /*                                 Use Effect                                 */
  /* -------------------------------------------------------------------------- */
  // useEffect(() => {
  //   getUserById();
  //   getWebsById();
  //   getMobilesById();
  //   setIsUpdated(false);
  // }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  
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
  /*                                  SnackBar                                  */
  /* -------------------------------------------------------------------------- */

	// * SnackBar
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [errorSnackbar, setErrorSnackbar] = useState("");
  const [severity, setSeverity] = useState("");

	// * handleClose
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

	// * action
  const action = (
    <React.Fragment>
      <Button 
				color="secondary" 
				size="small" 
				onClick={handleClose}
			>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseFullscreenOutlined 
					fontSize="small" 
				/>
      </IconButton>
    </React.Fragment>
  );
  
  /* -------------------------------------------------------------------------- */
  /*                                   Fields                                   */
  /* -------------------------------------------------------------------------- */

  // * Add Field
  const addField = () => {
    if(field === "") {
      setFieldsError("Please enter field");
      return
    } else {
      setFieldsError("");
      setFieldList([...fieldList, field]);
    }
  }

  // * Remove Field
  const removeField = (item) => {
    setFieldList(current =>
      current.filter(position => {
        return position !== item;
      }),
    );
  }

  // * Remove All Fields
  // const removeAllFields = () => {
  //   setFieldList([]);
  // }

  /* -------------------------------------------------------------------------- */
  /*                              Current Password                              */
  /* -------------------------------------------------------------------------- */

  // * handlecurrentPassword
  const handleCurrentPassword = (currentPassword) => {
    if (currentPassword.length <= 9) {
      setCurrentPasswordUpdateTrigger(false);
      setCurrentPasswordError("Current Password is too short");
    }  if (currentPassword.length === 0) {
      setCurrentPasswordUpdateTrigger(true);
      setCurrentPasswordInput(currentPassword);
      setCurrentPasswordError("");
    } else {
      setCurrentPasswordUpdateTrigger(true);
      setCurrentPasswordInput(currentPassword);
      setCurrentPasswordError("");
    }
  }

  // * handleConfirmCurrentPassword
  const handleConfirmCurrentPassword = (confirmPassword) => {
    if(currentPasswordInput !== confirmPassword) {
      setCurrentPasswordUpdateTrigger(false);
      setCurrentPasswordError("Password are not match");
    } else if (confirmPassword.length === 0) {
      setCurrentPasswordUpdateTrigger(true);
      setCurrentPasswordError("");
    } else {
      setCurrentPasswordUpdateTrigger(true);
      setCurrentConfirmPasswordInput(confirmPassword);
      setCurrentPasswordError("");
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                New Password                                */
  /* -------------------------------------------------------------------------- */
  // ? Check strong, normal, weak
  // ? Combination of AlphaNumeric
  // ? Check Pattern

  // * handleNewPassword
  const handleNewPassword = (newPassword) => {
    if (newPassword.length <= 9) {
      setNewPasswordUpdateTrigger(false);
      setNewPasswordError("New Password is too short");
    } else if (newPassword.length === 0) {
      setNewPasswordUpdateTrigger(true);
      setNewPasswordInput(newPassword);
      setNewPasswordError("");
    } else {
      setNewPasswordUpdateTrigger(true);
      setNewPasswordInput(newPassword);
      setNewPasswordError("");
    }
  }

  // * handleConfirmNewPassword
  const handleConfirmNewPassword = (confirmPassword) => {
    if (newPasswordInput !== confirmPassword){
      setNewPasswordUpdateTrigger(false);
      setNewPasswordError("Password are not match");
    } else if (confirmPassword.length === 0) {
      setNewPasswordUpdateTrigger(true);
      setNewPasswordError("");
    } else {
      setNewPasswordUpdateTrigger(true);
      setNewConfirmPasswordInput(confirmPassword);
      setNewPasswordError("");
    }
  }
  
  /* -------------------------------------------------------------------------- */
  /*                                Handle Submit                               */
  /* -------------------------------------------------------------------------- */
  const handleSubmit = async () => {
    
    /* ------------------------------- Validation ------------------------------- */

    // * id
    if (id !== _id) {
			setOpenSnackbar(true);
      setSeverity("error");
			setErrorSnackbar("You can't change the data of other users");
			return
		} else {
      setIsLoading(true);
    }
    
    // * firstName
    if (firstName === "" ) {
      setFirstNameError("First Name Required");
      return
    } else {
      setFirstNameError("");
    }

    // * lastName
    if (lastName === "" ) {
      setLastNameError("Last Name Required");
      return
    } else {
      setLastNameError("");
    }
        
    // * role
    if (role === "" ) {
      setRoleError("Role Required");
      return
    } else {
      setRoleError("");
    }

    // * fieldList
    if(fieldList.length === 0) {
      setFieldsError("Please Insert at least 1 Field");
    } else {
      setFieldsError("");
    }
    
    // * profileImg
    if (profileImg === null && profileImgDB === null) {
      setProfileImgError("Profile Image Required");
      return
    } else {
      setProfileImgError("");
    }

    // * email
    // if (email === "" ) {
    //   setEmailError("Email Required");
    //   return
    // } else {
    //   setEmailError("");
    // }

    // * Current Password
    // if (currentPasswordInput === "") {
    //   // setCurrentPasswordUpdateTrigger(false);
    //   setCurrentPasswordError("Please Enter Current Password");
    //   setIsLoading(false);
    //   return;
    // } else if (currentPasswordInput !== currentConfirmPasswordInput){
    //   // setCurrentPasswordUpdateTrigger(false);
    //   setCurrentPasswordError("Current password are not match");
    //   setIsLoading(false);
    //   return;
    // } else {
    //   // setCurrentPasswordUpdateTrigger(true);
    // }

    if (currentPasswordInput !== currentConfirmPasswordInput){
      // setCurrentPasswordUpdateTrigger(false);
      setCurrentPasswordError("Current password are not match");
      setIsLoading(false);
      return;
    }

    // * New Password
    // if (newPasswordInput === "") {
    //   // setNewPasswordUpdateTrigger(false);
    //   setNewPasswordError("Please Enter New Password");
    //   setIsLoading(false);
    //   return;
    // } else if (newPasswordInput !== newConfrimPasswordInput) {
    //   // setNewPasswordUpdateTrigger(false);
    //   setNewPasswordError("New password are not match");
    //   setIsLoading(false);
    //   return;
    // } else {
    //   // setNewPasswordUpdateTrigger(true);
    // }
      
    if (newPasswordInput !== newConfrimPasswordInput) {
      // setNewPasswordUpdateTrigger(false);
      setNewPasswordError("New password are not match");
      setIsLoading(false);
      return;
    } 

    /* ----------------------------- Data Structure ----------------------------- */
    const formData = new FormData();
    formData.append("userId", id);
    formData.append("yourId", _id);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("currentPassword", currentPasswordInput);
    formData.append("newPassword", newPasswordInput);
    formData.append("role", role);
    formData.append("type", type);
    formData.append("activated", activated);

    // * Fields
    fieldList.forEach((field) => (
      formData.append("fields", field)
    ));

    // * Profile Image (Upload)
    if (profileImg) {
      profileImg.forEach(img => ((
        formData.append("profileImgFile", img),
        formData.append("profileImg", img.name)
      )));
    }

    // * Profile Image Db (From Database)
    if (profileImgDB) {
      formData.append("profileImgDB", profileImgDB)
    }

    /* ----------------------------- Send to Server ----------------------------- */

    // console.log("Curent: " + currentPasswordUpdateTrigger);
    // console.log("New: " + newPasswordUpdateTrigger);

    if (currentPasswordUpdateTrigger && newPasswordUpdateTrigger) {

      // * Fetch
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/${id}/update`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      // * Response
      const data = await response.json();

      // * Log
      // console.log(data);

      // * Store to Redux
      if (data.userResponse && data.token) {

        // * Redux
        dispatch(
          setLogin({
            user: data.userResponse,
            token: data.token,
          })
        );

        // * Snackbar
        setOpenSnackbar(true);
        setSeverity("success");
        setErrorSnackbar("Successfully Updated");

        // * Update to call getwebsite
        setIsUpdated(true);

        // * Reset Data so you can call data from DB
        setFirstName("");
        setLastName("");
        setEmail("");
        setRole("");
        setProfileImg(null);
        setprofileImgDB(null);
        setFieldList([]);
        setCurrentPasswordInput("");
        setCurrentConfirmPasswordInput("");
        setNewPasswordInput("");
        setNewConfirmPasswordInput("");

        // * Reset Loading
        setIsLoading(false);

      } else {

        // * Snackbar
        setOpenSnackbar(true);
        setSeverity("error");
        setErrorSnackbar(data.msg);

        // * Reset Loading
        setIsLoading(false);

      }

    } else {
      
      // * Snackbar
      setOpenSnackbar(true);
      setSeverity("error");
      setErrorSnackbar("Fetch Failed");

      // * Reset Loading
      setIsLoading(false);
    }

  };

  /* -------------------------------------------------------------------------- */
  /*                                Handle Delete                               */
  /* -------------------------------------------------------------------------- */
  const handleDelete = async () => {

    // * Validation
    if (id !== _id) {
			
      // * Snackbar
      setOpenSnackbar(true);
      setSeverity("error");
			setErrorSnackbar("You can't change the data of other users");
			return;

		} else {
      setIsLoading(true);
    }

    // * Delete
    deleteWebs();
    deleteMobiles();
    deleteUser();

    // * Back to Prev Page
    // navigate(-1);

  }
  
  /* -------------------------------------------------------------------------- */
  /*                                 Delete Webs                                */
  /* -------------------------------------------------------------------------- */
  const deleteWebs = async () => {
        
    // * Send to Server
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/webs/${_id}/delete-all`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(webs),
    });

    // * Response
    // const data = await response.json();

    // * Log
    // console.log(data);

  }

  /* -------------------------------------------------------------------------- */
  /*                               Delete Mobiles                               */
  /* -------------------------------------------------------------------------- */
  const deleteMobiles = async () => {

    // * Send to Server
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/mobiles/${_id}/delete-all`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mobiles),
    });

    // * Response
    // const data = await response.json();

    // * Log
    // console.log(data);

  }

  /* -------------------------------------------------------------------------- */
  /*                                 Delete User                                */
  /* -------------------------------------------------------------------------- */
  const deleteUser = async () => {

    // * Data Structure
    const formData = new FormData();
    formData.append("yourId", _id);
    formData.append("userId", id);
    formData.append("type", type);

    // * profileImgDB (From Database)
    if (profileImgDB) {
      formData.append("profileImgDB", profileImgDB)
    }

    // * Send to Server
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/${id}/delete`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    // * Response
    const data = await response.json();

    // * Logout
    if(data.length === 0) {
      dispatch(setLogout());
    }

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

            {/* -------------------------------- SnackBar -------------------------------- */}
            <Snackbar
              open={ openSnackbar }
              autoHideDuration={6000}
              onClose={ handleClose }
              message={ errorSnackbar }
              action={ action }
            >
              {
                severity === "success"
                ? 
                  <Alert 
                    onClose={ handleClose } 
                    severity="success"
                    sx={{ width: '100%' }}
                  >
                    { errorSnackbar }
                  </Alert>
                : 
                  <Alert 
                    onClose={ handleClose } 
                    severity="error"
                    sx={{ width: '100%' }}
                  >
                    { errorSnackbar }
                  </Alert>
              }

            </Snackbar>

            {/* --------------------------------- Delete --------------------------------- */}
            <DeleteModal 
              title={ firstName + " " + lastName }
              isDeleted={ isDeleted }
              setIsDeleted={ setIsDeleted }
              handleDelete={ handleDelete }
            />

            {/* --------------------------------- Header --------------------------------- */}
            <div 
              className={`
                w-full
                justify-between
                md:flex
                border
                rounded-lg
                p-5
              `}
            >
              <div className='xx:w-full md:w-5/6 md:flex items-center'>
                <img
                  src={ 
                    type ==="website" 
                    ? `${process.env.REACT_APP_BASE_URL}/profile/${profileImgDB}`
                    : profileImgDB
                  }
                  alt={ profileImgDB }
                  className={`
                    xx:text-center
                    md:text-start
                    xx:mx-auto
                    md:mx-0

                    w-24 
                    h-24
                    rounded-full
                    shadow-lg
                  `}
                />

                <div 
                  className={`
                    xx:ml-0 md:ml-5 
                    xx:text-center md:text-start
                    xx:mt-5 md:mt-0
                  `} 
                >
                  {/* Name */}
                  <h1
                    className={`
                      xx:text-xl
                      md:text-3xl
                      font-bold
                      text-gray-700
                      dark:text-white
                    `}
                  >
                    {firstName + " " + lastName}
                  </h1>

                  {/* Email */}
                  <span 
                    className={`
                      text-base
                      text-gray-500 
                      dark:text-gray-400
                    `}
                  >
                    { email }
                  </span>

                </div>
              </div>

              {/* Delete User */}
              <button 
                type="button"
                onClick={ () => setIsDeleted(!isDeleted) }
                className={`
                  xx:w-full
                  md:w-1/6
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
                Delete User
              </button>

            </div>

            {/* ---------------------------------- Form ---------------------------------- */}
            <div 
              className={`
                w-full
                justify-between
                
                border
                rounded-lg
                p-5
                mt-5
              `}
            >
              {/* --------------------------------- Header --------------------------------- */}
              <div 
                className={`
                  w-full
                  justify-between
                  md:flex
                  mb-5
                `}
              >
                <h1 
                  className={`
                    text-gray-700
                    text-3xl font-bold
                    xx:text-center md:text-start
                  `}
                >
                  User Info
                </h1>
                
                {/* Time */}
                <ul
                  className={`
                    xx:w-full
                    md:w-auto
                    text-gray-800
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
                  <li>Created: {createdAt}</li>
                  {/* <li>Updated: {updatedAt}</li> */}
                </ul>

              </div>

              <hr />

              <div className='mt-5'>
              
                <FlexBetween gap="0.5rem" className='mx-auto'>
                
                  {/* ------------------------------- First Name ------------------------------- */}
                  <TextField
                    label="Fields"
                    placeholder="First Name"
                    onChange={(e) => setFirstName(e.target.value)}
                    value={ firstName }
                    sx={inputStyle}
                  />
                  
                  {/* ------------------------------- Last Name ------------------------------- */}
                  <TextField
                    label="Last Name"
                    placeholder="Last Name"
                    onChange={(e) => setLastName(e.target.value)}
                    value={ lastName }
                    sx={inputStyle}
                  />
                  
                </FlexBetween>

                {/* Error Log */}
                <div className={firstNameError ? `mt-1 text-center p-2 bg-red-400 text-white` : `` } >
                  { firstNameError }
                </div>

                {/* Error Log */}
                <div className={lastNameError ? `mt-1 text-center p-2 bg-red-400 text-white` : `` } >
                  { lastNameError }
                </div>

                {/* -------------------------------- Cateogry -------------------------------- */ }
                <Select 
                  label="Role"
                  placeholder="Role"
                  onChange={(e) => setRole(e.target.value)}
                  value={role}
                  sx={inputStyle}
                >
                  <MenuItem value="superadmin">Super Admin</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                </Select>

                {/* Error Log */}
                <div className={roleError ? `mt-1 text-center p-2 bg-red-400 text-white` : ``} >
                  {roleError}
                </div>

                {/* ------------------------------ Profile Image ----------------------------- */}
                <Dropzone
                  disabled={type === "website" ? false : true}
                  acceptedFiles=".jpg,.jpeg,.png"
                  multiple={ false }
                  onDrop={(acceptedFiles, rejectedFiles, images) => 
                    setProfileImg(acceptedFiles.map(file =>
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
                        
                        {/* Label */}
                        <div className='mt-1 mb-2'>
                          <h1 
                            className={`
                              text-gray-600
                              text-base font-bold
                            `}
                          >
                            Profile Picture
                          </h1>
                        </div>

                        {/* Input Image */}
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
                            profileImg
                            ? (
                                <div className='relative '>

                                  {
                                    profileImg.map(file => (
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
                                    key={profileImgDB}
                                    src={
                                      profileImgDB 
                                      ? type === "website" 
                                        ? `${process.env.REACT_APP_BASE_URL}/profile/${profileImgDB}`
                                        : profileImgDB
                                      : ``
                                    }
                                    alt={profileImgDB}
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
                        
                          {
                            profileImg && (
                              <IconButton
                                onClick={() => setProfileImg(null)}
                                sx={{ width: "10%" }}
                              >
                                <DeleteOutlined />
                              </IconButton>
                            )
                          }

                        </div>
                        
                      </Box>
                      
                    </FlexBetween>
                  )}
                </Dropzone>

                {/* --------------------------------- Fields --------------------------------- */}
                <div>
                  
                  <TextField
                    label="Fields"
                    placeholder="Fields"
                    onChange={(e) => setField(e.target.value)}
                    value={ field }
                    sx={inputStyle}
                  />
                  
                  <button
                    onClick={ addField }
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
                    Add Field
                  </button>

                  {/* Error Log */}
                  <div className={fieldsError ? `mt-1 text-center p-2 bg-red-400 text-white` : ``}>
                    {fieldsError}
                  </div>

                  {
                    fieldList.map((item, index) => (
                      <ul key={index} className={`border mt-5 p-2 rounded-md`}>
                        <li className='relative'>
                          {item}

                          <button
                            type='button'
                            onClick={() => removeField(item)}
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
                              w-5 h-5
                              hover:fill-secondary-400
                              `} 
                            />
                          </button>

                        </li>
                      </ul>
                    ))      
                  }
                </div>
                
                <hr className='my-10' />

                {/* ---------------------------------- Email --------------------------------- */}
                <TextField
                  label="Email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={ email }
                  sx={inputStyle}
                  disabled={type === "website" ? false : true}
                />

                {/* Error Log */}
                <div className={emailError ? `mt-1 text-center p-2 bg-red-400 text-white` : `` } >
                  { emailError }
                </div>

                {/* ---------------------------- Current Password ---------------------------- */}
                
                {/* Input Password */}
                <div 
                  style={{
                    position: 'relative', display: 'inline-block',
                    width: "100%", color: "#595959", marginTop: 10
                  }}
                >
                  <TextField
                    label="Current Password"
                    placeholder="Current Password"
                    type={ showCurrentPassword ? "text" : "password" }
                    // value={ currentPasswordInput }
                    onChange={ (e) => handleCurrentPassword(e.target.value) }
                    disabled={type === "website" ? false : true}
                    sx={{width: "100%"}}
                  />

                  <Visibility 
                    onClick={() => {setShowCurrentPassword(!showCurrentPassword)}}
                    style={{
                      position: 'absolute', 
                      right: 10, top: 15, 
                      width: 25, height: 25,
                      color: "#898da3",
                      zIndex: "5"
                    }}
                  />
                </div>
                
                {/* Confrim Password */}
                <div 
                  style={{
                    position: 'relative', display: 'inline-block',
                    width: "100%", color: "#595959", marginTop: 10
                  }}
                >
                  <TextField
                    label="Confirm Current Password"
                    placeholder="Confirm Current Password"
                    type={showConfirmCurrentPassword ? "text" : "password"}
                    // value={ currentConfirmPasswordInput }
                    onChange={ (e) => handleConfirmCurrentPassword(e.target.value) }
                    disabled={type === "website" ? false : true}
                    sx={{width: "100%"}}
                  />

                  <Visibility 
                    onClick={() => {setShowConfirmCurrentPassword(!showConfirmCurrentPassword)}}
                    style={{
                      position: 'absolute', 
                      right: 10, top: 15, 
                      width: 25, height: 25,
                      color: "#898da3",
                      zIndex: "5"
                    }}
                  />
                </div>

                {/* Error Log */}
                <div className={currentPasswordError ? `mt-2 text-center p-2 bg-red-400 text-white` : `` } >
                  { currentPasswordError }
                </div>

                {/* ------------------------------ New Password ------------------------------ */}
                
                {/* Input Password */}
                <div 
                  style={{
                    position: 'relative', display: 'inline-block',
                    width: "100%", color: "#595959", marginTop: 10
                  }}
                >
                  <TextField
                    label="New Password"
                    placeholder="New Password"
                    type={showNewPassword ? "text" : "password"}
                    // value={ newPasswordInput }
                    onChange={ (e) => handleNewPassword(e.target.value) }
                    disabled={type === "website" ? false : true}
                    sx={{width: "100%"}}
                  />

                  <Visibility 
                    onClick={() => {setShowNewPassword(!showNewPassword)}} 
                    style={{
                      position: 'absolute', 
                      right: 10, top: 15, 
                      width: 25, height: 25,
                      color: "#898da3",
                      zIndex: "5"
                    }}
                  />
                </div>
                
                {/* Confirm Password */}
                <div 
                  style={{
                    position: 'relative', display: 'inline-block',
                    width: "100%", color: "#595959", marginTop: 10
                  }}
                >
                  <TextField
                    label="Confirm New Password"
                    placeholder="Confirm New Password"
                    type={showConfirmNewPassword ? "text" : "password"}
                    // value={ newConfrimPasswordInput }
                    onChange={ (e) => handleConfirmNewPassword(e.target.value) }
                    disabled={type === "website" ? false : true}
                    sx={{width: "100%"}}
                  />

                  <Visibility 
                    onClick={() => {setShowConfirmNewPassword(!showConfirmNewPassword)}}
                    style={{
                      position: 'absolute', 
                      right: 10, top: 15, 
                      width: 25, height: 25,
                      color: "#898da3",
                      zIndex: "5"
                    }}
                  />
                </div>

                {/* Error Log */}
                <div className={ newPasswordError ? `mt-2 text-center p-2 bg-red-400 text-white` : `` } >
                  { newPasswordError }
                </div>
                
                {/* --------------------------------- Button --------------------------------- */}
                <button
                  onClick={handleSubmit}
                  className={`
                    w-full
                    bg-sky-400
                    px-3 py-3
                    mt-5
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
      }
    </div>
  )
}

export default AdminUsersDetails;
