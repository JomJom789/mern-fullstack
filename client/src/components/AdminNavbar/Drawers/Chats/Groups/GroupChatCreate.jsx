import React, {
  useState,
} from 'react'

/* ---------------------------------- Redux --------------------------------- */
import {
	useDispatch,
  useSelector,
} from "react-redux";

/* ------------------------------ State Reducer ----------------------------- */
import {
  setChats,
} from "../../../../../state/adminReducer";

/* ------------------------------- Material UI ------------------------------ */
import {
  Button,
	IconButton,
  Snackbar,
	Alert,
  InputBase,
} from '@mui/material';

/* -------------------------------- MUI Icon -------------------------------- */
import { 
  CloseFullscreenOutlined,
  ArrowBackOutlined,
  TuneOutlined
} from '@mui/icons-material';

/* ---------------------------------- Card ---------------------------------- */
import UserCard from '../Cards/UserCard';

/* -------------------------------------------------------------------------- */
/*                              Group Chat Create                             */
/* -------------------------------------------------------------------------- */
const GroupChatCreate = ({setGroupChatAdded, setView }) => {

  /* -------------------------------------------------------------------------- */
  /*                                    Data                                    */
  /* -------------------------------------------------------------------------- */
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);

  /* -------------------------------------------------------------------------- */
  /*                                  Loadings                                  */
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
    // followers,
    // following,
  } = useSelector((state) => state.auth.user);

  // * Admin Reducer
  // const isChatOpen = useSelector((state) => state.admin.isChatOpen);
  const chats = useSelector((state) => state.admin.chats);
  // const selectedChat = useSelector((state) => state.admin.selectedChat);

  // * Log
  // console.log(chats);
  // console.log(selectedChat);
  // console.log(isChatOpen);

  /* -------------------------------------------------------------------------- */
  /*                                 handleGroup                                */
  /* -------------------------------------------------------------------------- */
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      setOpenSnackbar(true);
			setErrorSnackbar("User already added");
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  /* -------------------------------------------------------------------------- */
  /*                                handleSearch                                */
  /* -------------------------------------------------------------------------- */
  const handleSearch = async (query) => {
    try {
      
      // * Validation
      if (!query) {
        setOpenSnackbar(true);
			  setErrorSnackbar("Please Enter something in search");
        return;
      }

      // * Loading
      setLoading(true);

      // * Fetch
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/group-chat/${_id}/${query}`, {
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
      
      // * Loading
      setLoading(false);
      
      // * useState
      setSearchResult(data);

    } catch (error) {
      setOpenSnackbar(true);
      setErrorSnackbar(error);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                handleDelete                                */
  /* -------------------------------------------------------------------------- */
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter(
      (sel) => sel._id !== delUser._id
    ));
  };

  /* -------------------------------------------------------------------------- */
  /*                                handleSubmit                                */
  /* -------------------------------------------------------------------------- */
  const handleSubmit = async () => {
    try {

      // * Validation
      if (!groupChatName || !selectedUsers) {
        setOpenSnackbar(true);
        setErrorSnackbar("Please fill all the feilds");
        return;
      }

      // * Data Structure
      const chatData = {
        "admin": _id,
        "name" : groupChatName,
        "users" : JSON.stringify(selectedUsers.map((u) => u._id)),
      }

      // * Fetch
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/chat/group`, {
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
      // console.log(data.error);
      
      // * Redux
      dispatch(setChats([data, ...chats]));

      // * Close The GroupChat Modal

      // * Handle Error
      if(data.error === undefined) {
        // Success close create view
        setView('');
      } else {
        // error occured show snackbar
        setOpenSnackbar(true);
        setErrorSnackbar(data.error);
      }

    } catch (error) {
      setOpenSnackbar(true);
      setErrorSnackbar(error + "Failed to Create the Chat!");
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
        ariaLabel="close"
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
  /*                                    Style                                   */
  /* -------------------------------------------------------------------------- */
  const inputStyle = {
    width: "100%",
    color: "#595959",
    border: 1,
    borderColor: "#CCCCCC",
    borderRadius: "0.5rem",
    padding: "0.1rem 0.5rem",
    my: 1
  };

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
        min-h-fit
        max-h-0
        h-full
        bg-white
        dark:bg-slate-900
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
				 	{errorSnackbar}
        </Alert>
			</Snackbar>
      
      {/* -------------------------------- Settings -------------------------------- */}
      <div className={`w-full mt-2 p-2 flow-root`}>

        <ArrowBackOutlined 
          onClick={ () => {
            setView('')
          }}
          className='text-gray-500 hover:text-gray-800 float-left'
        />

        <p className='float-left ml-5 font-semibold text-sm text-gray-600'>
          Create Group Chat
        </p>

        <TuneOutlined 
          className='text-gray-500 hover:text-gray-800 float-right'
        />

      </div>
      

      {/* ---------------------------------- Form ---------------------------------- */}
      <div className='w-full mt-5 px-5 '>

        {/* Group Name */}
        <InputBase
          placeholder="Group Name"
          onChange={(e) => setGroupChatName(e.target.value)}
          sx={inputStyle}
        />

        {/* Members */}
        <InputBase
          placeholder="Add Users eg: John, Smith"      
          onChange={(e) => handleSearch(e.target.value)}
          sx={inputStyle}
        />

        {/* Selected User */}
        <div className='my-4'>        
          {selectedUsers.map((item, index) => (
            <span 
              key={item._id}
              id={`badge-${item.email}`}
              className={`
                inline-flex 
                items-center 
                px-2
                py-1
                mb-2
                mr-2
                text-sm 
                font-medium 
                text-sky-800 
                bg-sky-100 
                rounded 
                dark:bg-sky-900 
                dark:text-sky-300
              `}
            >

              { item.firstName + " " + item.lastName }
                          
              <button 
                type="button"
                onClick={() => handleDelete(item)}
                className={`
                  inline-flex 
                  items-center
                  p-1 
                  ml-2 
                  text-sm 
                  text-sky-400 
                  bg-transparent 
                  rounded-sm 
                  hover:bg-sky-200 
                  hover:text-sky-900 
                  dark:hover:bg-sky-800 
                  dark:hover:text-sky-300" 
                  data-dismiss-target="#badge-dismiss-sky" 
                  aria-label="Remove
                `}
              >
                <svg 
                  className="w-2 h-2" 
                  aria-hidden="true" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 14 14"
                >
                  <path 
                    stroke="currentColor" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>

                <span className="sr-only">
                  Remove badge
                </span>

              </button>

            </span>
          ))}
        </div>

        {/* Show Search User List */}
        <div className='my-4'>
          {
            loading 
            ? ( <div>Loading...</div> ) 
            : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserCard
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
              )
          }
        </div>

        {/* Submit */}
        <button              
          onClick={ handleSubmit }
          className={`
            w-full
            bg-sky-400
            mt-2
            px-1
            py-1
            uppercase
            text-base
            font-semibold

            rounded-md 
            hover:bg-sky-500
            text-white
            transition-colors
          `}
        >
          Create Group
        </button>

      </div>
    </div>
  )
}

export default GroupChatCreate