import React, { useState, useRef  } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ------------------------------- React Icons ------------------------------ */
import { FcGoogle } from 'react-icons/fc';

/* ----------------------------------- MUI ---------------------------------- */
import {
  // useMediaQuery,
  // useTheme,
  Box,
  // Typography,
  Button,
  IconButton,
  TextField,
  Checkbox,
  Snackbar,
  Alert,
} from "@mui/material";

/* -------------------------------- MUI Icon -------------------------------- */
import {
  CloseFullscreenOutlined,
  EditOutlined,
  Visibility,
} from '@mui/icons-material';

/* ---------------------------------- Form ---------------------------------- */
import { Formik } from "formik";
import * as yup from "yup";

/* ---------------------------------- Redux --------------------------------- */
import { useDispatch } from "react-redux";
import { setLogin } from "../../state/authReducer";

/* -------------------------------- Dropzone -------------------------------- */
import Dropzone from "react-dropzone";
import FlexBetween from "../../components/MuiComponents/FlexBetween";

/* -------------------------------- Component ------------------------------- */
// import FlexBetween from "components/FlexBetween";

/* ------------------------------- Google Auth ------------------------------ */
import {   
  GoogleOAuthProvider,
  GoogleLogin,
  // useGoogleLogin,
  // useGoogleOneTapLogin,
} from '@react-oauth/google';

import jwt_decode from "jwt-decode";

/* -------------------------------- Recaptcha ------------------------------- */
import ReCAPTCHA from "react-google-recaptcha";

/* -------------------------------------------------------------------------- */
/*                               Register Schema                              */
/* -------------------------------------------------------------------------- */
const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),  
  picture: yup.string().required("required"),
});

/* -------------------------------------------------------------------------- */
/*                                Login Shcema                                */
/* -------------------------------------------------------------------------- */
const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

/* -------------------------------------------------------------------------- */
/*                           Initial Values Register                          */
/* -------------------------------------------------------------------------- */
const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",  
  picture: "",
};

/* -------------------------------------------------------------------------- */
/*                             Initial Values Login                           */
/* -------------------------------------------------------------------------- */
const initialValuesLogin = {
  email: "",
  password: "",
};

//* -------------------------------------------------------------------------- */
//*                                    Form                                    */
//* -------------------------------------------------------------------------- */
const Form = () => {

  /* -------------------------------------------------------------------------- */
  /*                                     ENV                                    */
  /* -------------------------------------------------------------------------- */

  // * Data
  const serverUrl = process.env.REACT_APP_BASE_URL;
  
  // * Google OAuth
  const googleClient = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  // const clientSecret = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;
  
  // * Recaptcha
  const recaptchaSiteKey = process.env.REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY;
  // const recaptchaSecretKey = process.env.REACT_APP_GOOGLE_RECAPTCHA_SECRET_KEY;

  // * Log
  // console.log(serverUrl);
  // console.log(googleClient);
  // console.log(clientSecret);
  // console.log(recaptchaSiteKey);

  /* -------------------------------------------------------------------------- */
  /*                                     MUI                                    */
  /* -------------------------------------------------------------------------- */
  // const { palette } = useTheme();
  // const isNonMobile = useMediaQuery("(min-width:600px)");

  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */
  // * Router 
  const navigate = useNavigate();

  // * Redux
  const dispatch = useDispatch();

  /* -------------------------------------------------------------------------- */
  /*                                  Page Type                                 */
  /* -------------------------------------------------------------------------- */
  const [pageType, setPageType] = useState("login");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  /* -------------------------------------------------------------------------- */
  /*                                Show Password                               */
  /* -------------------------------------------------------------------------- */
  const [showPassword, setShowPassword] = useState(false);  

  /* -------------------------------------------------------------------------- */
  /*                                   Captcha                                  */
  /* -------------------------------------------------------------------------- */
  const captchaRef = useRef(null)

  const [recaptcha, setRecaptcha] = useState("");

  function onChangeRecaptcha(value) {
    // console.log("Captcha value:", value);
    setRecaptcha(value);
  }

  /* -------------------------------------------------------------------------- */
  /*                              Terms & Agreement                             */
  /* -------------------------------------------------------------------------- */
  const [agree, setAgree] = useState(false);

  const handleTermsAndAgreement = (event) => {
    setAgree(event.target.checked);
  };

  /* -------------------------------------------------------------------------- */
  /*                          Images into single Array                          */
  /* -------------------------------------------------------------------------- */
  let newAcceptedFiles = [];
  
  /* -------------------------------------------------------------------------- */
  /*                                  Register                                  */
  /* -------------------------------------------------------------------------- */
  const register = async (values, onSubmitProps) => {

    if (!recaptcha) {
      // * Snackbar
      setOpenSnackbar(true);
      setSeverity("error");
      setErrorSnackbar("Please Verify");
      return;
    }

    if (!agree) {
      // * Snackbar
      setOpenSnackbar(true);
      setSeverity("error");
      setErrorSnackbar("Please Accept the Terms and Agreement");
      return;
    }

    // * Data Structure
    const formData = new FormData();

    for (let value in values) {
      formData.append(value, values[value]);
    }

    formData.append("picturePath", values.picture.name);

    // * Fetch
    const response = await fetch(`${serverUrl}/auth/register`, {
      method: "POST",
      body: formData,
    });

    // * Return
    const data = await response.json();

    if (data.error) {

      // * Snackbar
      setOpenSnackbar(true);
      setSeverity("error");
      setErrorSnackbar(data.error);

    } else {

      // * Snackbar
      setOpenSnackbar(true);
      setSeverity("success");
      setErrorSnackbar(data.success);

    }
    
    // * Reset Form
    onSubmitProps.resetForm();

    // * Set Page to Login
    setPageType("login"); 

  };

  /* -------------------------------------------------------------------------- */
  /*                                    Login                                   */
  /* -------------------------------------------------------------------------- */
  const login = async (values, onSubmitProps) => {

    // * Fetch
    const response = await fetch(`${serverUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    // * Return
    const data = await response.json();
    
    // * Reset Form
    onSubmitProps.resetForm();

    // * Log
    // console.log(data);

    // * Store to Redux
    if (data.user && data.token) {
      
      // * Set to Reducer
      dispatch(
        setLogin({
          user: data.user,
          token: data.token,
        })
      );
            
      // *Navigate to Admin Page
      navigate("/admin");

    } else if (data.success) {

      // * Snackbar
      setOpenSnackbar(true);
      setSeverity("success");
      setErrorSnackbar(data.success);

    }else {

      // * Snackbar
      setOpenSnackbar(true);
      setSeverity("error");
      setErrorSnackbar(data.error);

      // * Navigate to Login
      navigate("/login");
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                             Handle Form Submit                             */
  /* -------------------------------------------------------------------------- */
  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  /* -------------------------------------------------------------------------- */
  /*                               responseGoogle                               */
  /* -------------------------------------------------------------------------- */
  const responseGoogle = (response) => {

    // * Decode Google Credential
    const user = jwt_decode(response.credential);
    
    // * Log
    // console.log(user);

    // * Store to Local Storage
    localStorage.setItem('user', JSON.stringify(user));

    // * googleAuth
    googleAuth(user);

  }

  /* -------------------------------------------------------------------------- */
  /*                                 Google Auth                                */
  /* -------------------------------------------------------------------------- */
  const googleAuth = async (user) => {

    // * Log
    // console.log(user);

    // * Fetch
    const response = await fetch(`${serverUrl}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    // * Return
    const data = await response.json();

    // * Log
    // console.log(data);

    // * Store to Redux
    if (data.user && data.token) {

      // * Set to Reducer
      dispatch(
        setLogin({
          user: data.user,
          token: data.token,
        })
      );

      // *Navigate to Admin Page
      navigate("/admin");

    } else {

      // * Snackbar
      setOpenSnackbar(true);
      setSeverity("error");
      setErrorSnackbar(data.error);

    };

  }

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
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >      
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (        

        <section
          className={`
            bg-white dark:bg-slate-900 
            xx:mx-auto 
            xx:px-5 lg:px-20
            xx:py-10 lg:py-14
          `}
        >
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
          
          {/* --------------------------------- Header --------------------------------- */}
          <h1 
            className={`
              text-slate-800   
              text-2xl font-bold 
              xx:text-center md:text-start
            `}
          >
            {
              isLogin 
              ? "Login Your Account"
              : "Create Your Account"
            }
          </h1>

          <h1
            className={`
              text-gray-500 text-sm
              mt-3 mb-10
              xx:text-center md:text-start
            `}
          >
            {
              isLogin
                ? "Don't have an account? "
                : "Already have an account? "
            }

            <span
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              className={`
                text-sky-600 font-bold
                hover:underline hover:text-sky-600
                cursor-pointer
              `}
            >
              {
                isLogin
                ? " Sign up here."
                : " Login here."
              }
            </span>
          </h1>

          {/* ---------------------------------- Form ---------------------------------- */}
          <form onSubmit={ handleSubmit } >

            {isRegister && (
              <div>
                <FlexBetween gap={2}>
                  
                  {/* First Name */}
                  <TextField
                    label="First Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                    name="firstName"
                    error={ Boolean(touched.firstName) && Boolean(errors.firstName) }
                    helperText={touched.firstName && errors.firstName}
                    // sx={{ gridColumn: "span 2" }}
                    sx={{width: "100%"}}
                  />

                  {/* Last Name */}
                  <TextField
                    label="Last Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    name="lastName"
                    error={ Boolean(touched.lastName) && Boolean(errors.lastName) }
                    helperText={touched.lastName && errors.lastName}
                    // sx={{ gridColumn: "span 2" }}
                    sx={{width: "100%"}}
                  />

                </FlexBetween>
                
                {/* Profile Image */}
                <Box
                  gridColumn="span 4"
                  border={`1px solid #bbbcbd`}
                  borderRadius="5px"
                  p="0.5rem"
                  className={`my-3`}
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    
                    // * Original
                    // onDrop={(acceptedFiles) => 
                    //   setFieldValue("picture", acceptedFiles[0])
                    // }
                    
                    // * Show Preview Image
                    onDrop={(acceptedFiles, rejectedFiles, images) => {

                        newAcceptedFiles = acceptedFiles.map(file =>
                          Object.assign(file, { preview: URL.createObjectURL(file) })
                        )

                        setFieldValue("picture", newAcceptedFiles[0])
                      }
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        // border={`2px dashed ${palette.primary.main}`}
                        p="0.5rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        
                        <input {...getInputProps()} />

                        {
                          !values.picture 
                          ? <p>Add Picture Here</p>
                          : 
                            // * Text Only
                            // <FlexBetween sx={{width: "100%"}}>
                            //   <Typography>{console.log(values.picture)}</Typography>
                            //   <Typography>{values.picture.name}</Typography>
                            //   <EditOutlined />
                            // </FlexBetween>

                            // * Image
                            <div className="relative">
                              <img
                                key={values.name}
                                src={values.picture.preview}
                                alt={values.name}
                                width={100}
                                height={100}
                                onLoad={() => {
                                  URL.revokeObjectURL(values.picture.preview)
                                }}
                                className={`
                                  h-[50%] w-[50%] 
                                  mx-auto object-contain 
                                  rounded-md
                                `}
                              />

                              <div 
                                className={`
                                  absolute top-0 right-0 
                                  bg-gray-200 
                                  p-2 rounded-full 
                                `}
                              >
                                <EditOutlined />
                              </div>
                            </div>

                        }
                      </Box>
                    )}

                  </Dropzone>
                </Box>
              </div>
            )}

            {/* ---------------------------------- Email --------------------------------- */}
            
            {/* Label */}
            <div className='mt-1'>
              <h1 
                className={`
                  text-gray-600
                  text-base font-bold
                `}
              >
                Email
              </h1>
            </div>
            
            {/* Input */}
            <TextField
              // label="Email"
              placeholder="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              // sx={{ gridColumn: "span 4" }}
              sx={{width: "100%", marginTop: 1,}}
            />

            {/* -------------------------------- Password -------------------------------- */}
            
            {/* Label */}
            <div className='mt-2'>
              <h1 
                className={`
                  text-gray-600
                  text-base font-bold
                `}
              >
                Password
              </h1>
            </div>

            <div 
              style={{
                position: 'relative', 
                display: 'inline-block',
                width: "100%", 
                gridColumn: "span 4",
                color: "#595959", 
                marginTop: 6,
              }}
            >

              <TextField
                // label="Password"
                placeholder="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={Boolean(touched.password) && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                type={showPassword ? "text" : "password"} 
                sx={{width: "100%"}}
              />

              <Visibility 
                onClick={() => {setShowPassword(!showPassword)}}
                style={{
                  position: 'absolute', 
                  right: 10, top: 15, 
                  width: 25, height: 25,
                  color: "#898da3",
                  zIndex: "10"
                }}
              />

            </div>
            
            {/* Forgot Password */}
            { 
              isLogin 
              ? <Link
                  to="/forgot-password" 
                  className="text-sky-500"
                >
                  <h1 
                    className={`
                      mt-3 text-end
                      font-semibold
                    `}
                  >
                    Forgot Password?
                  </h1>
                </Link>
              : <></>
            }  
            
            {/* Recaptcha */}
            {
              !isLogin 
              ? <Box 
                  className={`mt-10`}
                  style={{
                    transform:"scale(0.85)", 
                    transformOrigin:"0 0", 
                    width: "100%",
                  }}
                >
                  <ReCAPTCHA
                    ref={captchaRef}
                    sitekey={recaptchaSiteKey}
                    onChange={onChangeRecaptcha}
                  />
                </Box>
              : <></>
            }

            {/* Separator between social media sign in and email/password sign in */}
            <div 
              className={`
                flex items-center my-10 
                before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 
                after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300
              `}
            >
              <p 
                className={`
                  mx-4 mb-0 
                  text-center font-semibold 
                  text-gray-600 dark:text-white
                `}
              >
                or
              </p>
            </div>
            
            {/* Google OAuth */}
            <GoogleOAuthProvider 
              clientId={googleClient}
            >

              <GoogleLogin
                render={renderProps => (
                  <Button
                    fullWidth
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    sx={{
                      // width: "100%",
                      mt: "2rem 0",
                      p: "0.5rem",
                      color: "#292a2b",
                      backgroundColor: "#ffffff",
                      "&:hover": { backgroundColor: "#ededed" },
                      border: "1px solid #ededed"
                      // backgroundColor: palette.primary.main,
                      // color: palette.background.alt,
                      // "&:hover": { color: palette.primary.main },
                    }}
                  >
                    <FcGoogle /> Sign in with Google
                  </Button>
                )}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy="single_host_origin"
                className={`w-full mx-auto text-center`}
              />

            </GoogleOAuthProvider>

            {/* Terms and Agreement */}
            {
              !isLogin 
              ? <div className="mt-10 flex items-start">
              
                  <div className="flex items-center h-5">
                    <Checkbox
                      checked={ agree }
                      onChange={ handleTermsAndAgreement }
                    />
                  </div>
                  
                  <div className="ml-3 text-sm">
                    <label 
                      htmlFor="terms"
                      className="font-light text-gray-500 dark:text-gray-300"
                    >
                      I accept the 
                      <Link 
                        to="/" 
                        className={`
                          font-medium text-sky-600 
                          hover:underline dark:text-sky-500"
                        `}
                      > Terms and Agreement 

                      </Link>
                    </label>
                    
                  </div>

                </div>
              : <div></div>
            }

            {/* Submit */}
            <Box>
              <Button
                fullWidth
                type="submit"
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  color: "#ffffff",
                  backgroundColor: "#3b98f5",                  
                  "&:hover": { backgroundColor: "#027cf5" },

                  // backgroundColor: palette.primary.main,
                  // color: palette.background.alt,
                  // "&:hover": { color: palette.primary.main },
                }}
              >              
                { isLogin ? "LOGIN" : "REGISTER" }
              </Button>

            </Box>

          </form>
        </section>
      )}
    </Formik>
  );
};

export default Form;
