import React, {
  useState,
  useEffect,
} from 'react'

/* --------------------------------- Config --------------------------------- */
import { getSender } from "../../../../../config/chatLogics";

/* ---------------------------------- Redux --------------------------------- */
import {
	useDispatch,
  useSelector,
} from "react-redux";

// import {
//   setChats,
//   setSelectedChat
// } from '../../../../../state/adminReducer';

/* ------------------------------ State Reducer ----------------------------- */
import {
  setIsChatOpen,
} from "../../../../../state/adminReducer";

/* ------------------------------- Material UI ------------------------------ */
import { 
  Button,
	IconButton,
  Snackbar,
	Alert,
} from '@mui/material';

/* -------------------------------- MUI Icon -------------------------------- */
import {
  ArrowBackOutlined,
  CloseFullscreenOutlined,
  TuneOutlined,
} from '@mui/icons-material';

/* -------------------------------- Component ------------------------------- */
import Messages from './Messages';
import MessageInput from './MessageInput';

//* -------------------------------------------------------------------------- */
//*                                  Socket IO                                 */
//* -------------------------------------------------------------------------- */
import io from "socket.io-client";

var socket, selectedChatCompare;

//* -------------------------------------------------------------------------- */
//*                                   ChatBox                                  */
//* -------------------------------------------------------------------------- */
const ChatBox = () => {
  
  /* -------------------------------------------------------------------------- */
  /*                                    Redux                                   */
  /* -------------------------------------------------------------------------- */
  
  // * Dispatch
  const dispatch = useDispatch();

  // * Auth Reducer
  const token = useSelector((state) => state.auth.token);
  const {
    _id,
    type,
    picturePath
  } = useSelector((state) => state.auth.user);

  // * Admin Reducer
  const chats = useSelector((state) => state.admin.chats);
  const selectedChat = useSelector((state) => state.admin.selectedChat);
  // const activeUsers = useSelector((state) => state.admin.activeUsers);

  // * Log
  // console.log(chats);
  // console.log(selectedChat);

  /* -------------------------------------------------------------------------- */
  /*                                  Messages                                  */
  /* -------------------------------------------------------------------------- */
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState([]);
  
  // * Typing
  const [userId, setUserId] = useState("");
  const [userType, setUserType] = useState("");
  const [userPicturePath, setUserPicturePath] = useState("");

  /* -------------------------------------------------------------------------- */
  /*                                   Socket                                   */
  /* -------------------------------------------------------------------------- */
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // console.log("is Typing: " + isTyping);

  /* -------------------------------------------------------------------------- */
  /*                                fetchMessages                               */
  /* -------------------------------------------------------------------------- */
  const fetchMessages = async () => {
    try {

      // * if there's no chat return
      if (!selectedChat) { 
        setOpenSnackbar(true);
			  setErrorSnackbar("User already added");
        return; 
      }

      // * Set Loading to True
      setLoading(true);

      // * Fetch
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/message/${selectedChat._id}`, {
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

      // * Set return data to Message Context
      setMessages(data);

      // * Set Loading to False
      setLoading(false);
      
      // * Call Join Chat from Server
      socket.emit("join chat", selectedChat._id);

    } catch (error) {
      setOpenSnackbar(true);
			setErrorSnackbar("Failed to Load the Messages");
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                 sendMessage                                */
  /* -------------------------------------------------------------------------- */
  const sendMessage = async () => {
    try {

      // * Validation
      if (!newMessage) {
        setOpenSnackbar(true);
        setErrorSnackbar("Plese Input a Message");
        return; 
      }

      // * Once you Submit your message stop typing from socket
      socket.emit("stop typing", selectedChat._id);

      // * Set
      setNewMessage("");

      // * Data Structure
      const chatData = {
        "content": newMessage,
        "chatId" : selectedChat,
      }

      // * Fetch
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/message/send/${_id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chatData),
      });

      // * Response
      const data = await response.json();

      // * Log
      // console.log(data);

      // * Submit new Message
      socket.emit("new message", data);

      // * Save to Context Provider
      setMessages([...messages, data]);

    } catch (error) {
      setOpenSnackbar(true);
      setErrorSnackbar("Failed to send the Message");
    }

  };

  /* -------------------------------------------------------------------------- */
  /*                           useEffect Setup Socket                           */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    
    // * Pass Server endpoint to Socket
    socket = io(process.env.REACT_APP_BASE_URL);

    // * Setup and Pass User Data to Server Socket
    socket.emit("setup", _id);
    
    // * Connect Socket
    socket.on("connected", () => setSocketConnected(true));
    
    // * Typing
    // socket.on("typing", () => setIsTyping(true));
    
    // * Stop Typing
    // socket.on("stop typing", () => setIsTyping(false));

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* -------------------------------------------------------------------------- */
  /*                           useEffect Fetch Message                          */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {

    // * Fetch Message
    fetchMessages();

    // * Set
    selectedChatCompare = selectedChat;

  }, [selectedChat, deleteMessage]); // eslint-disable-line react-hooks/exhaustive-deps

  /* -------------------------------------------------------------------------- */
  /*                          useEffect Message Recieved                        */
  /* -------------------------------------------------------------------------- */
  // Remove the Array bracket "[]" in order to update syncronous
  useEffect(() => {

    /* ---------------------------- Message Received ---------------------------- */
    socket.on("message recieved", (newMessageRecieved) => {
      
      // Log
      // console.log(newMessageRecieved);

      // If you open the current chat you will not recieved a notification
      if (
        // * if chat is not selected or doesn't match current chat
        !selectedChatCompare || 
        selectedChatCompare._id !== newMessageRecieved.chat._id 
      ) {
        // if (!notification.includes(newMessageRecieved)) {
        //   setNotification([newMessageRecieved, ...notification]);
        //   // setFetchAgain(!fetchAgain);
        // }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }

    });

    /* ------------------------- Message Delete Recieved ------------------------ */
    socket.on("message-delete-recieved", (messageId) => {
      setDeleteMessage([...deleteMessage, messageId]);
    });

    /* --------------------------------- Typing --------------------------------- */
    socket.on("typing", (id, type, picturePath) => {
      setIsTyping(true);
      setUserId(id);
      setUserType(type);
      setUserPicturePath(picturePath);
    });

    /* ------------------------------- Stop Typing ------------------------------ */
    socket.on("stop typing", () => {
      setIsTyping(false);
    });
    
  });

  /* -------------------------------------------------------------------------- */
  /*                               typing Handler                               */
  /* -------------------------------------------------------------------------- */
  const typingHandler = (e) => {

    // * check if Input Box has value
    setNewMessage(e.target.value);

    // * Check if Socket is not connected
    if (!socketConnected) return;

    // * Check if input has value 
    if (e.target.value.length === 0) {
      socket.emit(
        "stop typing", 
        selectedChat._id,
      );
    } else {
      socket.emit(
        "typing", 
        selectedChat._id,
        _id,
        type,
        picturePath
      );
    }

    // if (!typing) {
    //   setTyping(true);
    //   socket.emit("typing", selectedChat._id);
    // }

    // let lastTypingTime = new Date().getTime();
    // var timerLength = 3000;

    // setTimeout(() => {
    //   var timeNow = new Date().getTime();
    //   var timeDiff = timeNow - lastTypingTime;
    //   if (timeDiff >= timerLength && typing) {
    //     socket.emit("stop typing", selectedChat._id);
    //     setTyping(false);
    //   }
    // }, timerLength);

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
        relative
        flex 
        flex-col 
        xx:items-center 
        xx:justify-center 
        md:items-start 
        md:justify-start
        xx:w-full 
        md:w-auto
        h-full
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

      {/* -------------------------------- Settings -------------------------------- */}
      <div 
        className={`
          w-full 
          p-2 
          flow-root
          
          fixed
          z-10
          top-14
          bg-white
          drop-shadow-sm
        `}
      >

        {/* Back to Previous */}
        <ArrowBackOutlined 
          onClick={ () => dispatch(setIsChatOpen(false)) }
          className={`
            text-slate-500 
            hover:text-slate-800 
            float-left
          `}
        />

        {/* Header User Name */}
        <p 
          className={`
            float-left 
            ml-5 
            font-semibold 
            text-xs 
            mt-1
          `}
        >
          {
            // * Log
            // console.log(selectedChat)

            // * Orig
            messages && !selectedChat.isGroupChat 
            ? getSender(_id, selectedChat.users)
            : selectedChat.chatName.toUpperCase()

            // * Test
            // messages && !selectedChat.isGroupChat 
            // ? selectedChat.chatName.toUpperCase()   // Group Chat is True
            // : getSender(_id, selectedChat.users)  // Group Chat is False
          }
        </p>
        
        {/* Setting */}
        <TuneOutlined 
          className={`
            text-slate-500 
            hover:text-slate-800 
            float-right
          `}
        />

      </div>

      {/* ---------------------------------- List ---------------------------------- */}
      <div 
        className={`
          flex 
          flex-col 
          flex-grow
          w-full 
          max-w-xl 
          bg-white
        `}
      >

        {/* Message */}
        <Messages
          messages={messages} 
          setMessages={setMessages}
          isTyping={isTyping}
          userId={userId}
          userType={userType}
          userPicturePath={userPicturePath}
        />
        
        {/* Message Input */}
        <MessageInput
          newMessage={newMessage}
          typingHandler={typingHandler}
          sendMessage={sendMessage}
        />

      </div>

    </div>
  )
}

export default ChatBox;