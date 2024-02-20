import React, {
  useState,
  useEffect
} from 'react'

/* ---------------------------------- Redux --------------------------------- */
import {
	useDispatch,
  useSelector,
} from "react-redux";

/* ------------------------------ State Reducer ----------------------------- */
// import {
//   setSelectedChat,
// } from "../../../../../state/adminReducer";

/* ------------------------------- Material UI ------------------------------ */
import { 
  Box,
  Button,
	IconButton,
  Snackbar,
	Alert,
  InputBase,
  Popover,
} from '@mui/material';

/* -------------------------------- MUI Icon -------------------------------- */
import { 
  CloseOutlined,
  CloseFullscreenOutlined,
  ArrowBackOutlined,
  TuneOutlined,
} from '@mui/icons-material';

/* ---------------------------------- Card ---------------------------------- */
import UserCard from '../Cards/UserCard';
import DeleteChat from '../Cards/Modal/DeleteChat';

/* -------------------------------------------------------------------------- */
/*                               GroupChatUpdate                              */
/* -------------------------------------------------------------------------- */
const GroupChatUpdate = ({ setView, oldData, refresh, setRefresh, }) => {
  
  /* -------------------------------- Param Log ------------------------------- */
  // console.log(oldData._id);
  // console.log(oldData.chatName);
  // console.log(oldData.groupAdmin);
  // console.log(oldData.users);

  /* ---------------------------------- Data ---------------------------------- */
  const [groupChatName, setGroupChatName] = useState();
  const [groupUser, setGroupUser] = useState(oldData.users);

  /* -------------------------------------------------------------------------- */
  /*                                  Triggers                                  */
  /* -------------------------------------------------------------------------- */

  // * Modal DeleteChat
  const [isOpen, setIsOpen] = useState(false);

  // * Popup
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClickOptions = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseOptions = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  /* -------------------------------------------------------------------------- */
  /*                                   Search                                   */
  /* -------------------------------------------------------------------------- */
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  /* -------------------------------------------------------------------------- */
  /*                                   Loading                                  */
  /* -------------------------------------------------------------------------- */
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);  

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
  // const chats = useSelector((state) => state.admin.chats);
  // const selectedChat = useSelector((state) => state.admin.selectedChat);

  // * Log
  // console.log(isChatOpen);
  // console.log(chats);
  // console.log(selectedChat);  

  /* -------------------------------------------------------------------------- */
  /*                                 handleBack                                 */
  /* -------------------------------------------------------------------------- */
  const handleBack = () => {
    
    // * To close update view
    setView('');
    
    // * Refresh when group chat got change
    if(oldData.groupChatName !== groupChatName) {
      setRefresh(!refresh);
    }

  }

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
      setErrorSnackbar(error);
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                handleSubmit                                */
  /* -------------------------------------------------------------------------- */
  const handleSubmit = async () => {
    try {

      // * Validate
      if (!groupChatName) {
        setOpenSnackbar(true);
			  setErrorSnackbar("Please Enter Chat Name");
        return;
      }

      // * Loading
      setRenameLoading(true);
      
      // * Data Structure
      const chatData = {
        "chatId": oldData._id,
        "chatName" : groupChatName,
      }

      // * Fetch
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/chat/rename`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chatData),
      });

      // * Response
      // const data = await response.json();

      // * Log
      // console.log(data);      

      // * Loading
      setRenameLoading(false);

    } catch (error) {
      setErrorSnackbar(error);
      setRenameLoading(false);
    }

    // * Reset useState
    setGroupChatName("");

  };

  /* -------------------------------------------------------------------------- */
  /*                                handleAddUser                               */
  /* -------------------------------------------------------------------------- */
  const handleAddUser = async (user1) => {
    try {

      // * Log Param
      // console.log(user1);

      // * Add Validation
      if (oldData.users.find((u) => u._id === user1._id)) {
        setOpenSnackbar(true);
			  setErrorSnackbar("User Already in group!");
        return;
      }
  
      // * Admin Restriction
      if (oldData.groupAdmin._id !== _id) {
        setOpenSnackbar(true);
			  setErrorSnackbar("Only admins can add someone!");
        return;
      }

      // * Loading
      setLoading(true);

      // * Data Structure
      const chatData = {
        "chatId": oldData._id,
        "userId" :  user1._id,
      }

      // * Fetch
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/chat/groupadd`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chatData),
      });

      // * Response
      const data = await response.json();

      // * Log
      // console.log(data.users);
      
      // * Set New Users
      setGroupUser(data.users);

      // * Loading
      setLoading(false);

    } catch (error) {
      setErrorSnackbar(error);
      setLoading(false);
    }

    // * Reset useState
    setGroupChatName("");
  };

  /* -------------------------------------------------------------------------- */
  /*                                handleRemove                                */
  /* -------------------------------------------------------------------------- */
  const handleRemove = async (user1) => {
    try {

      // * Log Param
      // console.log(user1);

      // * Validate
      if (
        oldData.groupAdmin._id !== _id && 
        user1 !== _id
      ) {
        setOpenSnackbar(true);
			  setErrorSnackbar("Only admins can remove someone!");
        return;
      }

      // * Loading
      setLoading(true);

      // * Data Structure
      const chatData = {
        "chatId": oldData._id,
        "userId" :  user1,
      }

      // * Fetch
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/chat/groupremove`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chatData),
      });

      // * Response
      const data = await response.json();

      // * Log
      // console.log(data.users);

      // * Set New Users
      setGroupUser(data.users);

      // * Loading
      setLoading(false);

    } catch (error) {
      setErrorSnackbar(error);
      setLoading(false);
    }

    // * Reset useState
    setGroupChatName("");

  };

  /* -------------------------------------------------------------------------- */
  /*                                  useEffect                                 */
  /* -------------------------------------------------------------------------- */
  // useEffect(() => {
  //   if (refresh) {
  //     setView('');
  //   }
  // }, [refresh]); // eslint-disable-line react-hooks/exhaustive-deps

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

      {/* ---------------------------------- Modal --------------------------------- */}
      <DeleteChat
				isOpen={ isOpen }
				setIsOpen={ setIsOpen }
        chatId={ oldData._id }
        setView={ setView }
        refresh={ refresh }
        setRefresh={ setRefresh }
			/>
      
      {/* ----------------------------- Settings Header ---------------------------- */}
      <div className={`w-full mt-2 p-2 flow-root`}>

        {/* Back Button */}
        <ArrowBackOutlined 
          onClick={ handleBack }
          className={`
            text-gray-500 
            hover:text-gray-800 
            float-left
          `}
        />

        {/* Title */}
        <p 
          className={`
            float-left 
            ml-5 
            font-semibold 
            text-sm 
            text-gray-600
          `}
        >
          Update Group Chat
        </p>                  

        {/* Icon: Options */}
        <div
          onClick={ handleClickOptions }
          className={`
            float-right
            text-gray-500
            hover:bg-gray-200
            hover:rounded-full
          `}
        >
          <TuneOutlined />
        </div>

        {/* MUI: Popup */}
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleCloseOptions}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          className={`mt-2`}
        >
          <div 
            className={`
              w-[200px]
              text-xs
              font-semibold
              text-gray-600
              cursor-pointer
            `}
          >
            <div 
              onClick={() => {
                setIsOpen(!isOpen);
              }} 
              className={`hover:bg-gray-100 px-2 py-3`}
            >
              Delete
            </div>
          </div>
        </Popover>

      </div>
      

      {/* ---------------------------------- Form ---------------------------------- */}
      <div className='w-full mt-5 px-5 '>

        {/* Group Name */}
        <InputBase
          defaultValue={oldData.chatName}
          placeholder={"Group Name: " + oldData.chatName}
          onChange={(e) => setGroupChatName(e.target.value)}
          sx={inputStyle}
        />

        {/* Members */}
        <InputBase
          placeholder="Add Users to Group"
          onChange={(e) => handleSearch(e.target.value)}
          sx={inputStyle}
        />

        <div 
        
          className={`
            my-4
            text-sm 
            font-medium
            text-gray-700
          `}
        >
          <span>Admin: </span> {oldData.groupAdmin.firstName + " " + oldData.groupAdmin.lastName}
        </div>

        {/* User in Group */}
        <div className='my-4'>
          {groupUser.map((item, index) => (
            oldData.groupAdmin.email !== item.email ?
              <span 
                key={item._id + item.email}
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
                  onClick={() => handleRemove(item._id)}
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
            : <div key={item._id}></div>
          ))}
        </div>

        {/* Show Search User List */}
        <div className='my-4'>
          {
            loading 
            ? ( <div>Loading...</div> ) 
            : (
                searchResult?.map((user) => (
                  <UserCard
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
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
          Save Group
        </button>

        {/* Leave Group */}
        <button
          onClick={() => handleRemove(_id)} 
          className={`
            w-full
            bg-red-400
            mt-2
            px-1
            py-1
            uppercase
            text-base
            font-semibold

            rounded-md 
            hover:bg-red-500
            text-white
            transition-colors
          `}
        >
          Leave Group
        </button>

      </div>
    </div>
  )
}

export default GroupChatUpdate;