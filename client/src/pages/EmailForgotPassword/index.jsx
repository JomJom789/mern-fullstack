import React, {
  useState,
} from 'react';

/* ----------------------------------- MUI ---------------------------------- */
import {
  TextField,
  Button,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";

/* -------------------------------- MUI Icon -------------------------------- */
import {
  CloseFullscreenOutlined,
} from '@mui/icons-material';

/* -------------------------------------------------------------------------- */
/*                             EmailForgotPassword                            */
/* -------------------------------------------------------------------------- */
const EmailForgotPassword = () => {

  /* ----------------------------------- ENV ---------------------------------- */
  const serverUrl = process.env.REACT_APP_BASE_URL;
  
  /* ---------------------------------- Data ---------------------------------- */
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

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

  /* -------------------------------- SnackBar -------------------------------- */

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

  /* ------------------------------ handleSubmit ------------------------------ */
  const handleSubmit = async () => {

    // * Validation
    if (!email) {
      
      // * Set Email
      setEmailError("Please Enter your Email");

      // * Snackbar
      setOpenSnackbar(true);
      setSeverity("error");
      setErrorSnackbar("Please Enter your Email");
      return;

    }

    // * Data Structure
    const send = {    
      "email": email,
    };

    // * Fetch
    const response = await fetch(`${serverUrl}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(send),
    });

    // * Return
    const data = await response.json();

    // * Snackbar
    if(data.error) {      
      setOpenSnackbar(true);
      setSeverity("error");
      setErrorSnackbar(data.error);
    } else {
      setOpenSnackbar(true);
      setSeverity("success");
      setErrorSnackbar(data.success);
    }

  }

  /* ---------------------------------- View ---------------------------------- */
  return (
    <div 
      className={`
      bg-gray-50 flex 
        items-center justify-center 
        min-w-screen min-h-screen 
        p-5
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

      {/* ---------------------------------- Main ---------------------------------- */}
      <div
        className={`
          w-full lg:max-w-3xl 
          bg-white 
          text-gray-800 
          p-8 lg:p-12
          shadow-xl rounded-lg
        `}
      >
        <div>
          <h1 
            className={`
              text-2xl
              text-gray-800 
              font-bold
            `}
          
          >
            Forgot Password?
          </h1>

          <p 
            className={`
              mt-1
              text-gray-500
              font-semibold
            `}
          >
            Please enter your email we will send you a link to reset your password.
          </p>
        </div>
        

        <div className={`mt-10`}>
          
          {/* ---------------------------------- Email --------------------------------- */}
          <TextField
            label="Email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={ email }
            sx={inputStyle}
          />

          {/* Error Log */}
          <div className={emailError ? `mt-1 text-center p-2 bg-red-400 text-white` : `` } >
            { emailError }
          </div>

          <Button
            fullWidth
            onClick={ () => handleSubmit() }
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
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EmailForgotPassword