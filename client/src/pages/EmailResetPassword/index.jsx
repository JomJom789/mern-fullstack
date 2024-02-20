import React, {
  useState 
} from 'react';

import {
  // Link,
  useParams 
} from 'react-router-dom';

/* ------------------------------- Material UI ------------------------------ */
import {  
  TextField,
  Button,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";

/* -------------------------------- MUI Icon -------------------------------- */
import {  
  Visibility,
  CloseFullscreenOutlined,
} from '@mui/icons-material';


/* -------------------------------------------------------------------------- */
/*                                ResetPassword                               */
/* -------------------------------------------------------------------------- */
const ResetPassword = () => {
  
  /* ---------------------------------- Hooks --------------------------------- */
  const { id, token } = useParams();

  // * Show New Password
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // * Update Password
  const [newPasswordUpdateTrigger, setNewPasswordUpdateTrigger] = useState(true);

  // * Input
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [newConfrimPasswordInput, setNewConfirmPasswordInput] = useState("");

  // * Error  
  const [newPasswordError, setNewPasswordError] = useState("");

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

  /* ------------------------------ Handle Submit ----------------------------- */
  const handleSubmit = async () => { 

    // * New Password
    if (newPasswordInput !== newConfrimPasswordInput) {
      setNewPasswordError("New password are not match");
      return;
    } 
    
    // * Data Structure
    const userData = {
      "userId" : id,
      "token" : token,
      "newPassword" : newPasswordInput
    }

    // * Send
    if (newPasswordUpdateTrigger) {

      // * Fetch
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/reset-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      // * Response
      const data = await response.json();

      // * Log
      console.log(data);

      // * Validate Response
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

    }

  }

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

      {/* Main */}
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
            Reset Your Password
          </h1>
        </div>
        

        <div className={`mt-5`}>

          {/* ------------------------------ New Password ------------------------------ */}
                
          {/* Input Password */}
          <div 
            style={{
              position: 'relative', 
              display: 'inline-block',
              width: "100%", 
              color: "#595959", 
              marginTop: 4
            }}
          >
            <TextField
              label="New Password"
              placeholder="New Password"
              type={showNewPassword ? "text" : "password"}
              // value={ newPasswordInput }
              onChange={ (e) => handleNewPassword(e.target.value) }
              sx={{width: "100%"}}
            />

            <Visibility 
              onClick={() => {setShowNewPassword(!showNewPassword)}} 
              style={{
                position: 'absolute', 
                right: 10, top: 15, 
                width: 25, height: 25,
                color: "#898da3",
                zIndex: "10"
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
              sx={{width: "100%"}}
            />

            <Visibility 
              onClick={() => {setShowConfirmNewPassword(!showConfirmNewPassword)}}
              style={{
                position: 'absolute', 
                right: 10, top: 15, 
                width: 25, height: 25,
                color: "#898da3",
                zIndex: "10"
              }}
            />
          </div>

          {/* Error Log */}
          <div className={ newPasswordError ? `mt-2 text-center p-2 bg-red-400 text-white` : `` } >
            { newPasswordError }
          </div>

          <Button
            fullWidth
            onClick={ handleSubmit }
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
            Reset Password
          </Button>

        </div>

      </div>
    </div>
  )
}

export default ResetPassword