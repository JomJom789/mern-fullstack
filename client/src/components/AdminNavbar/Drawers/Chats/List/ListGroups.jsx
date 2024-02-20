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
  GroupAddOutlined,
  CloseFullscreenOutlined,
} from '@mui/icons-material';

/* --------------------------------- Config --------------------------------- */
import { getSender } from "../../../../../config/chatLogics";

/* ------------------------------- Components ------------------------------- */
import Loading from '../../../../common/Loading';
import GroupChatCreate from '../Groups/GroupChatCreate';
import GroupCard from '../Cards/GroupCard';
import GroupChatUpdate from '../Groups/GroupChatUpdate';

/* -------------------------------------------------------------------------- */
/*                                 ListGroups                                 */
/* -------------------------------------------------------------------------- */
const ListGroups = () => {
  
  /* -------------------------------------------------------------------------- */
  /*                                Data Trigger                                */
  /* -------------------------------------------------------------------------- */

  // * Modal
  const [groupChatAdded, setGroupChatAdded] = useState(false);
  
  // * Navigate Views
  const [view, setView] = useState();

  // * Update
  const [updateData, setUpdateData] = useState([]);

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
	/*                                  Snack Bar                                 */
	/* -------------------------------------------------------------------------- */

	// * SnackBar
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [errorSnackbar, setErrorSnackbar] = useState("");

	// * handleClose
  const handleClose = (event, reason) => {
    
    // 
    if (reason === 'clickaway') {
      return;
    }

    // Close Snack Bar
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
				autoHideDuration={ 6000 }
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

      {/* -------------------------- Modal: Add Group Chat ------------------------- */}
      <div 
        className={`
          p-2 
          fixed
          bottom-2
          right-2
        `}
      >
        <button 
          onClick={() => {
            setView('create');
          }}
          className={`
            w-10
            h-10
            rounded-full 
          bg-sky-400 
          hover:bg-sky-500 
          text-white
            
            shadow-xl
            z-10
          `}
        >
          <GroupAddOutlined 
            className='w-7 h-7'
          />
        </button>
      </div>
      
      {/* ----------------- Switch Case: List Group, Create, Update ---------------- */}
      {(() => {
        switch (view) {
          case 'create':
            return (
              <GroupChatCreate
                setView={setView}
                setGroupChatAdded={setGroupChatAdded}
              />
              
            )
          case 'update':
            return (
              <GroupChatUpdate
                setView={setView}
                oldData={updateData}
                refresh={refresh}
                setRefresh={setRefresh}
              />
            )
          default:
            return (
              chats 
              ? (chats.map((item, index) => (
                
                  <Box
                    key={item._id + item.chatName}
                    className={`
                      ${ selectedChat === item ? "white" : "black" }
                      ${ selectedChat === item ? "#38B2AC" : "#E8E8E8" }
                      cursor-pointer
                    `}
                  >

                    {
                      item.isGroupChat 
                      ? <GroupCard
                          key={index + item.email}
                          item={item}
                          name={item.chatName}
                          // groupChatPicture={item.picturePath}
                          users={item.users}
                          setView={setView}
                          setUpdateData={setUpdateData}
                          accessGroupChat={accessGroupChat}
                          setIsChatOpen={setIsChatOpen}
                        />
                      : <div></div>
                    }

                  </Box>

                )))
              : <Loading />
            )
        }
      })()}
      
    </div>
  )
}

export default ListGroups