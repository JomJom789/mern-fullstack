import React, {
  useState,
  useEffect,
} from 'react'

/* ---------------------------------- Redux --------------------------------- */
import {
	useDispatch,
  useSelector,
} from "react-redux";

/* ------------------------------ MUI Material ------------------------------ */
// import {
		
// } from '@mui/material';

/* ------------------------------- Material UI ------------------------------ */
import { 
  Box,
  Button,
	IconButton,
  Snackbar,
	Alert,
} from '@mui/material';

/* -------------------------------- MUI Icon -------------------------------- */
import {
  CloseOutlined,
  CloseFullscreenOutlined,
} from '@mui/icons-material';

/* -------------------------------- Socket IO ------------------------------- */
import io from "socket.io-client";

var socket, selectedChatCompare;

/* -------------------------------------------------------------------------- */
/*                                 DeleteChat                                 */
/* -------------------------------------------------------------------------- */
const DeleteChat = ({isOpen, setIsOpen, chatId, setView, refresh, setRefresh}) => {

  /* -------------------------------------------------------------------------- */
  /*                                   Trigger                                  */
  /* -------------------------------------------------------------------------- */
  const [loading, setLoading] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                                    Redux                                   */
  /* -------------------------------------------------------------------------- */
  
  // * Dispatch
  const dispatch = useDispatch();

  // * Auth Reducer
  const token = useSelector((state) => state.auth.token);
  const {
    _id,
  } = useSelector((state) => state.auth.user);

  // * Admin Reducer
  const chats = useSelector((state) => state.admin.chats);
  const selectedChat = useSelector((state) => state.admin.selectedChat);
  // const activeUsers = useSelector((state) => state.admin.activeUsers);

  // * Log
  // console.log(chats);
  // console.log(selectedChat);

  /* -------------------------------------------------------------------------- */
  /*                                   Socket                                   */
  /* -------------------------------------------------------------------------- */
  const [socketConnected, setSocketConnected] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                           useEffect Setup Socket                           */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    
    // ! Pass Server endpoint to Socket
    socket = io(process.env.REACT_APP_BASE_URL);

    // ! Setup and Pass User Data to Server Socket
    socket.emit("setup", _id);
    
    // ! Connect Socket
    socket.on("connected", () => setSocketConnected(true));
    
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* -------------------------------------------------------------------------- */
  /*                                handleDelete                                */
  /* -------------------------------------------------------------------------- */
  const handleDelete= async () => {
    try {

      // * Set Loading to True
      setLoading(true);

      // * Fetch
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/chat/delete/${chatId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // * Response
      const data = await response.json();

      // * Log
      // console.log(data);

      // * Set return data to Message Context
      // setMessages(data.messages);

      // * Set Loading to False
      setLoading(false);

      // * Call Join Chat from Server to delete chat on your chatmate
      // socket.emit(
      //   "chat-delete", 
      //   chatId,
      // );

      // * Close Modal
      setIsOpen(!isOpen);

      setView('');
      
      // * Refresh the chat in your local
      setRefresh(!refresh)

    } catch (error) {
      setOpenSnackbar(true);
			setErrorSnackbar("Failed to Load the Messages");
    }
  };

  /* -------------------------------------------------------------------------- */
	/*                                  Snack Bar                                 */
	/* -------------------------------------------------------------------------- */

	// * SnackBar
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [errorSnackbar, setErrorSnackbar] = useState("");

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
    <div
      className={`
        relative z-10 
        ${ isOpen ? `block`: `hidden` }
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
        <Alert 
          onClose={ handleClose } 
          severity="error" 
          sx={{ width: '100%' }}
        >
          Please Enter Something
        </Alert>
      </Snackbar>

      {/* ------------------------------ Modal Overlay ----------------------------- */}
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div 
          className={`
            flex 
            min-h-full 
            items-end 
            justify-center 
            p-4 
            sm:p-0
            text-center sm:items-center           
          `}
        >
        
          <div 
            className={`
              relative 
              transform 
              overflow-hidden 
              rounded-lg 
              bg-white 
              text-left 
              shadow-xl 
              transition-all 
              p-5 
              my-8 
              w-[80%]
            `}
          
          >
          
            {/* --------------------------------- Header --------------------------------- */}
            <div 
              className={`
                text-sm 
                font-bold 
                text-slate-800 
                pb-3 
                border-b
              `}
            >
              <h1>
                Delete Chat
              </h1>

              <button
                type='button'
                onClick={ () => setIsOpen(!isOpen) }
                className={`
                  absolute
                  top-1
                  right-1
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
           
            {/* ---------------------------------- Body ---------------------------------- */}
            <div className='mt-3'>

              {/* Message */}
              <div 
                className={`
                  text-xs
                  font-semibold
                  w-full
                `}
              >
                Are you sure you want to delete your chat and messages?
              </div>

              {/* Button */}
              <button 
                onClick={ handleDelete }
                type="button" 
                className={`
                  inline-flex w-full 
                  justify-center 
                  rounded-md 
                  bg-red-600 
                  hover:bg-red-500 
                  px-3 
                  py-2 
                  text-sm 
                  font-semibold 
                  text-white 
                  shadow-sm 
                  mt-5
                `}
              >
                Delete
              </button>

            </div>

          </div>
        </div>
      </div>

    </div>
  )
}

export default DeleteChat