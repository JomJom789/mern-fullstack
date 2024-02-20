import React, {
  useState,
  useEffect,
} from 'react'

/* ---------------------------------- Redux --------------------------------- */
import {
	useDispatch,
  useSelector,
} from "react-redux";

import {
  setChats,
  setSelectedChat,
  setIsChatOpen
} from '../../../../../state/adminReducer';

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
  CloseFullscreenOutlined,
} from '@mui/icons-material';

/* --------------------------------- Config --------------------------------- */
// import { getSender } from "../../../../../config/chatLogics";

/* ------------------------------- Components ------------------------------- */
import MessageCard from '../Cards/MessageCard';
import Loading from '../../../../common/Loading';

/* -------------------------------- Socket IO ------------------------------- */
import io from "socket.io-client";

var socket;

/* -------------------------------------------------------------------------- */
/*                                 ListMessage                                */
/* -------------------------------------------------------------------------- */
const ListMessage = () => {

  /* -------------------------------------------------------------------------- */
  /*                                Data Trigger                                */
  /* -------------------------------------------------------------------------- */

  // * Refresh List
  const [refresh, setRefresh] = useState(false);
  
  /* -------------------------------------------------------------------------- */
  /*                             Redux State Reducer                            */
  /* -------------------------------------------------------------------------- */

  // * Dispatch
  const dispatch = useDispatch();

  // * Auth Reducer
  const token = useSelector((state) => state.auth.token);
  const {
    _id,
    // followers,
    // following,
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
  /*                                 accessChat                                 */
  /* -------------------------------------------------------------------------- */
  const accessChat = async (userId) => {
    try {

      // * Log
      // console.log("My ID: " + _id);
      // console.log("US ID: " + userId);

      // * Fetch
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/chat/user/${_id}/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // * Response
      const data = await response.json();

      // * Log
      // console.log(data);

      // * Get data if it's equal to chat.id
      if (!chats.find((c) => c._id === data._id)) {
        dispatch(setChats([data, ...chats]));
      }

      // * set selected Chat
      dispatch(setSelectedChat(data));
      dispatch(setIsChatOpen(true));

    } catch (error) {
      setErrorSnackbar("Please Enter something in search");
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                 accessGroupChat                            */
  /* -------------------------------------------------------------------------- */
  const accessGroupChat = async (groupChatId) => {
    try {

      // * Log
      // console.log(groupChatId);

      // * Fetch
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/chat/group/${_id}/${groupChatId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // * Response
      const data = await response.json();

      // * Log
      // console.log(data);

      // * Get data if it's equal to chat.id
      if (!chats.find((c) => c._id === data._id)) {
        dispatch(setChats([data, ...chats]));
      }

      // * set selected Chat
      dispatch(setSelectedChat(data));
      dispatch(setIsChatOpen(true));

    } catch (error) {
      setErrorSnackbar("Please Enter something in search");
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                 fetchChats                                 */
  /* -------------------------------------------------------------------------- */
  const fetchChats = async () => {
    try {

      // * Fetch
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/chat/${_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // * Response
      const data = await response.json();

      // * Log
      // console.log(data);

      // * Set Chats
      dispatch(setChats(data));

    } catch (error) {
      setErrorSnackbar(error);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                  useEffect                                 */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    fetchChats();
  }, [refresh]); // eslint-disable-line react-hooks/exhaustive-deps

  /* -------------------------------------------------------------------------- */
  /*                           useEffect Setup Socket                           */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    
    // * Pass Server endpoint to Socket
    socket = io(process.env.REACT_APP_BASE_URL);

    // * Setup and Pass User Data to Server Socket
    socket.emit(
      "setup",
      _id
    );
    
    // * Connect Socket
    socket.on("connected", () => setSocketConnected(true));

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* -------------------------------------------------------------------------- */
  /*                          useEffect Message Recieved                        */
  /* ------- Remove the Array bracket "[]" in order to update syncronous ------ */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {

    /* ---------------------------- Message Received ---------------------------- */
    socket.on("message recieved", (newMessageRecieved) => {
      // console.log(newMessageRecieved);
      setRefresh(!refresh);
    });

    /* --------------------------------- Typing --------------------------------- */
    // socket.on("typing", (type, picturePath) => {
    //   setIsTyping(true);
    //   setUserType(type);
    //   setUserPicturePath(picturePath);
    // });

    /* ------------------------------- Stop Typing ------------------------------ */
    // socket.on("stop typing", () => {
    //   setIsTyping(false);
    // });
    
  });

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
        mt-14
      `}
    >

      {/* -------------------------------- Snack Bar ------------------------------- */}
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

      {/* ------------------------------ List of Chats ----------------------------- */}
      {
        chats 
        ? (chats.map((item, index) => (                      

            // console.log(item),

            <Box
              key={item._id + index}
              className={`
                ${ selectedChat === item ? "white" : "black" }
                ${ selectedChat === item ? "#38B2AC" : "#E8E8E8" }
                cursor-pointer
              `}
            >
              {
                item.latestMessage && (
                  <MessageCard
                    key={item + index}
                    myId={_id}
                    chatId={item._id}
                    isGroupChat={item.isGroupChat}
                    chatName={item.chatName}
                    users={item.users}
                    sender={item.latestMessage.sender}
                    readBy={item.latestMessage.readBy}
                    message={
                      item.latestMessage.content.length > 50
                      ? item.latestMessage.content.substring(0, 51) + "..."
                      : item.latestMessage.content
                    }
                    dateAdded={item.latestMessage.updatedAt}
                    accessChat={accessChat}
                    accessGroupChat={accessGroupChat}
                    setRefresh={setRefresh}
                  />
                )                
              }

            </Box>


          )))
        : <Loading />
      }

    </div>
  )
}

export default ListMessage