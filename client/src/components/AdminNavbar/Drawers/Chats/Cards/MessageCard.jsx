import React, {
  useState
} from 'react'

/* ------------------------------- Material UI ------------------------------ */
import {
  Button,
	Avatar,
  Badge,
  Popover,
} from '@mui/material';

/* -------------------------------- MUI Icon -------------------------------- */
import {
  MoreHorizOutlined,
} from '@mui/icons-material';

/* -------------------------------- MUI Style ------------------------------- */
import { styled } from '@mui/material/styles';


/* -------------------------------- Time Ago -------------------------------- */
import ReactTimeAgo from 'react-time-ago'

/* -------------------------------- Component ------------------------------- */
import DeleteChat from './Modal/DeleteChat';

/* -------------------------------- Socket IO ------------------------------- */
import io from "socket.io-client";

var socket;

/* ------------------------------- StyledBadge ------------------------------ */
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

/* -------------------------------------------------------------------------- */
/*                                 MessageCard                                */
/* -------------------------------------------------------------------------- */
const MessageCard = ({
  myId,
  chatId,
  isGroupChat,
  chatName,
  users, 
  sender,
  readBy,
  message, 
  dateAdded,
  accessChat,
  accessGroupChat,
  setRefresh
}) => {

  /* -------------------------------------------------------------------------- */
  /*                                     Log                                    */
  /* -------------------------------------------------------------------------- */
  // console.log(myId);
  // console.log(isGroupChat);
  // console.log(chatName);
  // console.log(users);
  // console.log(sender);
  // console.log(readBy);
  // console.log(message);
  // console.log(dateAdded);

  /* -------------------------------------------------------------------------- */
  /*                                Process Data                                */
  /* -------------------------------------------------------------------------- */

  // * Select User in the Group
  const selectedUser = users.findIndex(obj => obj._id === sender._id);
  // console.log(selectedUser);

  // * Select My Profile Pic
  // const selectMyId = users.findIndex(obj => obj._id === myId);
  // console.log(selectMyId);

  // * Select User Profile Pic
  const selectUserId = users.findIndex(obj => obj._id !== myId);
  // console.log(selectMyId);

  // * Find your ID in readBy
  const seen = readBy.includes(myId);
  // console.log(seen);

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

  const handleOpenChat = () => {

    // * Find Chat mate Index
    const chatMateIndex = users.findIndex(obj => obj._id !== myId);

    // * Select Access Chat
    isGroupChat
    ? accessGroupChat(chatId)
    : sender._id === myId 
      ? accessChat(users[chatMateIndex]._id)
      : accessChat(sender._id);

  }

  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div
      className={`
        flex 
        px-4 
        py-3
        bg-white
        dark:bg-slate-900
        hover:bg-gray-100 
        dark:hover:bg-gray-700
        border-b
        cursor-pointer
      `}
    >
      {/* ---------------------------------- Modal --------------------------------- */}
      <DeleteChat
				isOpen={ isOpen }
				setIsOpen={ setIsOpen }
        chatId={ chatId }
        setRefresh={ setRefresh }
			/>

      {/* Avatar */}
      <div >

        {/* Image */}
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ 
            vertical: 'bottom',
            horizontal: 'right'
          }}
          variant="dot"
        >
          <Avatar 
            alt={
              isGroupChat 
              ? chatName
              : sender.firstName + " " + sender.lastName
            }
            src={
              isGroupChat 
              ? sender.type === "website"
                ? `${process.env.REACT_APP_BASE_URL}/profile/${users[selectedUser].picturePath}`
                : users[selectedUser].picturePath
              : users[selectUserId].type === "website"
                ? `${process.env.REACT_APP_BASE_URL}/profile/${users[selectUserId].picturePath}`
                : users[selectUserId].picturePath
            }
          />
        </StyledBadge>

      </div>

      <div className="w-full pl-3 ">
        <div 
          onClick={ handleOpenChat }
          className={`
            mb-1.5 
          `}
        >
            {/* Chat Name */}
            <span 
              className={`
                text-xs 
                font-semibold 
                text-gray-900 
                dark:text-white
              `}
            >
              { 
                isGroupChat 
                ? chatName
                : users[0]._id !== myId 
                  ? users[0].firstName + " " + users[0].lastName
                  : users[1].firstName + " " + users[1].lastName
              }
            </span> 
            
            <br/>
            
            {/* Chat Message */}
            <span 
              className={`
                ${
                  seen 
                  ?  `text-gray-500 dark:text-gray-400` 
                  : `text-gray-600 font-bold`
                }
                text-[11px]
              `}
            >
              {
                !seen 
                ? <span className={`text-xl text-red-400`}> • </span>
                : <></>
              }

              {
                isGroupChat 
                ? sender._id === myId 
                  ? "You: " + message
                  : sender.firstName + " " + sender.lastName + ": " + message
                : sender._id === myId
                  ? "You: " + message
                  : message
              }
            </span> 
        </div>
        
        <div 
          className={`
            w-full 
            flex 
            justify-between 
            items-center 
            space-x-5
          `}
        >

          <div 
            className={`
              text-[11px]
              text-sky-600 
              dark:text-sky-500
            `}
          >
            <ReactTimeAgo 
              locale="en-US"
              date={ Date.parse(dateAdded) }
            />
          </div>

          {/* Icon: Options */}
          <div
            onClick={ handleClickOptions }
            className={`
              flex 
              text-gray-500
              hover:bg-gray-200
              hover:rounded-full
            `}
          >
            <MoreHorizOutlined />                              
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

      </div>

    </div>
  )
}

export default MessageCard;