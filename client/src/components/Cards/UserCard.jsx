import React, {
  useState,
  useEffect,
} from 'react'
import { Link } from "react-router-dom"

/* ---------------------------------- Redux --------------------------------- */
import {   
  useDispatch,
  useSelector,
} from "react-redux";

import { 
  setFollowers, 
  setFollowing,
  // setRemoveFollowerById,
  setRemoveFollowingById,
} from "../../state/authReducer";

/* ------------------------------- Material UI ------------------------------ */
import { 
  Badge,
  Avatar
} from '@mui/material';

import { styled } from '@mui/material/styles';

/* -------------------------------- MUI Icon -------------------------------- */
import { 
  AddCircleOutline,             // Default
  CheckCircleOutline,           // Following
  SupervisedUserCircleOutlined, // Friends
  HelpOutlineOutlined,          // Follow Back
  LoopOutlined,                 // Loading
} from '@mui/icons-material';

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

//* -------------------------------------------------------------------------- */
//*                                  UserCard                                  */
//* -------------------------------------------------------------------------- */
const UserCard = ({ 
  id,
  firstName, 
  lastName, 
  email, 
  profilePic, 
  type,
  active,
  // userFollowers,
  userFollowing,
  refetch,
  accessChat,
}) => {

  /* -------------------------------------------------------------------------- */
  /*                                   Trigger                                  */
  /* -------------------------------------------------------------------------- */
  const [loading, setLoading] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                             Redux State Reducer                            */
  /* -------------------------------------------------------------------------- */
  
  const dispatch = useDispatch();

  // * Auth Reducer
  const token = useSelector((state) => state.auth.token);
  const {
    _id,
    following,
    followers,
  } = useSelector((state) => state.auth.user);

  // * Log
  // console.log(chats);
  // console.log(selectedChat);

  /* -------------------------------------------------------------------------- */
  /*                       Filter Followers and Following                       */
  /* -------------------------------------------------------------------------- */
  // * Join Followers & Following
  // const followersFollowings = followers.concat(following);

  // * Get Your Friends
  let isConfirmed = userFollowing.find((item) => item._id === _id && item.status === "confirmed");

  // * Get who follows you
  let isFollowed = userFollowing.find((item) => item._id === _id && item.status === "requested");

  // * Get who you follow
  let isFollowing = following.find((item) => item._id === id);

  // * Log Updated Followers
  // console.log(followers);

  /* -------------------------------------------------------------------------- */
  /*                              Follow Socket.IO                              */
  /* -------------------------------------------------------------------------- */
  const [socketConnected, setSocketConnected] = useState(false);
  const [socketResponse, setSocketResponse] = useState('');
  // console.log(socketResponse);

  /* -------------------------------------------------------------------------- */
  /*                        useEffect: Socket Connection                        */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {

    // * Pass Server endpoint to Socket
    socket = io(process.env.REACT_APP_BASE_URL);

    // * Log Connection Status
    // console.log(socket);

    // * Setup and Pass User Data to Server Socket
    socket.emit("setup", _id);

    // * Connect Socket
    socket.on("connected", () => setSocketConnected(true));
    
    // * Action Follow
    // socket.on("follow", () => setIsFollow(true));
    
    // * Test: Response from Server using Socket
    // socket.on('FromAPI', (data) => {
    //   setSocketResponse(data);
    // });

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* -------------------------------------------------------------------------- */
  /*                                Handle Follow                               */
  /* -------------------------------------------------------------------------- */
  const handleFollow = async () => {

    // * Loading
    setLoading(true);

    // * Fetch
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/follows/${_id}/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // * Response
    const data = await response.json();

    // * Log
    // console.log(data);

    // * Socket IO
    if (data.length > 0) {
      socket.emit(
        "follow", // Socket Name
        "follow", // Action
        _id,      // User (My ID)
        id,       // Room (Receiver)
      );
    } else {
      socket.emit(
        "follow",
        "unfollow",
        _id,
        id,
      );
    }

    // * Socket IO Multiple Arguments with Callback
    // socket.emit(
    //   "follow",
    //   JSON.stringify(data),
    //   { id: _id },
    //   (response) => {
    //     console.log(response.status);
    //   }
    // );

    // * Store to Redux
    dispatch(setFollowing({ following: data }));

    // * Loading
    setLoading(false);

    // * Update
    refetch();
    
  }
  
  /* -------------------------------------------------------------------------- */
  /*                          useEffect Follow Received                         */
  /*        Remove the Array bracket "[]" in order to update syncronous         */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {

    /* ---------------- Remove follower from Follow Button Toggle --------------- */
    socket.on("follow-recieved", (action, user) => {
      
      // * Try if you received data
      setSocketResponse(user);

      // * Remove Followers by ID
      // if(action === "unfollow") {
      //   dispatch(setRemoveFollowerById({ followers: user }));
      // }

      // * Refetch User List
      refetch();

    });
    
    /* ------------------ Confirm Follower from nav right side ------------------ */
    socket.on("confirm-follow-recieved", (id, yourData) => {
      
      // * Try if you received data
      setSocketResponse(yourData);
      
      // * Confirmed Followers by ID
      dispatch(setFollowers({ followers: yourData }));
      
      // * Refetch User List
      refetch();

    });

    /* ------------------- Remove Follower from nav right side ------------------ */
    socket.on("remove-follow-recieved", (user) => {
      
      // * Try if you received data
      // setSocketResponse(user);

      // * Remove Followers by ID
      dispatch(setRemoveFollowingById(user));
      
      // * Refetch User List
      refetch();

    });

  });

  /* -------------------------------------------------------------------------- */
  /*                                followButton                                */
  /* -------------------------------------------------------------------------- */
  function followButton() {
    return (
      isConfirmed
      ? <div className='flex items-center gap-1'>
          { loading ? <LoopOutlined /> : <SupervisedUserCircleOutlined /> } Friends
        </div>
      : isFollowed
        ? <div className='flex items-center gap-1'>
            { loading ? <LoopOutlined /> : <HelpOutlineOutlined /> } Confirm
          </div>
        : isFollowing 
          ? <div className='flex items-center gap-1'>
              { loading ? <LoopOutlined /> : <CheckCircleOutline /> } Following
            </div>
          : <div className='flex items-center gap-1'>
              { loading ? <LoopOutlined /> : <AddCircleOutline /> } Follow
            </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    
    <div       
      className={`
        w-full 
        
        bg-white 
        border 
        border-gray-200 
        rounded-lg 
        mt-5         
        dark:bg-gray-800 
        dark:border-gray-700
      `}
    >
      <div 
        className={`
          relative

          flex 
          justify-end 
          px-4 
          pt-4
        `}      
      >
        {/* Dropdown */}
        <button
          id="dropdownButton" 
          data-dropdown-toggle="dropdown" 
          type="button"
          className={`
            absolute
            top-2
            right-4

            inline-block 
            text-gray-500 
            dark:text-gray-400 
            hover:bg-gray-100 
            dark:hover:bg-gray-700 
            focus:ring-4 
            focus:outline-none 
            focus:ring-gray-200 
            dark:focus:ring-gray-700 
            rounded-lg 
            text-sm 
            p-1.5"
          `}
        >
          <span className="sr-only">
            Open dropdown
          </span>

          <svg 
            className="w-6 h-6" 
            aria-hidden="true" 
            fill="currentColor" 
            viewBox="0 0 20 20" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z">

            </path>
          </svg>
        </button>
          
        {/* <!-- Dropdown menu --> */}
        <div 
          id="dropdown" 
          className={`
            hidden 
            absolute

            z-10
            text-base
            list-none
            bg-white
            divide-y
            divide-gray-100 
            rounded-lg 
            shadow
            w-44 
            dark:bg-gray-700
          `}
        >
          <ul 
            className="py-2" 
            aria-labelledby="dropdownButton"
          >
            <li>
              <button 
                // href="#"
                className={`
                  block 
                  px-4 
                  py-2 
                  text-sm 
                  text-gray-700 
                  hover:bg-gray-100 
                  dark:hover:bg-gray-600 
                  dark:text-gray-200 
                  dark:hover:text-white
                `}
              >
                Edit
              </button>
            </li>
            
            <li>
              <button                 
                className={`
                  block 
                  px-4 
                  py-2 
                  text-sm 
                  text-gray-700 
                  hover:bg-gray-100 
                  dark:hover:bg-gray-600 
                  dark:text-gray-200 
                  dark:hover:text-white
                `}
              >
                  Export Data
              </button>
            </li>
            
            <li>
              <button                 
                className={`
                  block 
                  px-4 
                  py-2 
                  text-sm 
                  text-red-600 
                  hover:bg-gray-100 
                  dark:hover:bg-gray-600 
                  dark:text-gray-200 
                  dark:hover:text-white
                `}
              >
                Delete
              </button>
            </li>

          </ul>

        </div>
      </div>
      
      {/* Profile */}
      <div 
        className={`
          flex 
          flex-col 
          items-center
          pb-10
        `}
      >
        <Link to={`/admin/users/${id}`} >
          { 
            active 
            ? <div>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ 
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  variant="dot"
                >
                  <Avatar 
                    alt={profilePic}
                    src={
                      type === "website"
                      ? `${process.env.REACT_APP_BASE_URL}/profile/${profilePic}`
                      : profilePic
                    }
                    sx={{ width: 125, height: 125 }}
                    className={`
                      my-6
                      shadow-lg
                    `}
                  />
                </StyledBadge>
              </div>
            : <div>
                <Avatar 
                  alt={profilePic}
                  src={
                    type === "website"
                    ? `${process.env.REACT_APP_BASE_URL}/profile/${profilePic}`
                    : profilePic
                  }
                  sx={{ width: 125, height: 125 }}
                  className={`
                    my-6
                    shadow-lg
                  `}
                />
              </div>
          }

        </Link>
        
        {/* Name */}
        <Link to={`/admin/users/${id}`} >
          <h5 
            className={`
              mb-1 
              xx:text-lg
              md:text-xl
              font-medium 
              text-gray-900 
              dark:text-white

              hover:text-cyan-400
            `}          
          >
            { firstName + " " + lastName } 
          </h5>
        </Link>

        {/* Email */}
        <span 
          className={`
            text-sm 
            text-gray-500 
            dark:text-gray-400
          `}
        >
          { email }
        </span>

        <div className="sx:flex mt-4 sx:space-x-3 md:mt-6">

          { 
            id === _id 
            ? <></>
            : <div className='sx:w-full sx:flex gap-1'>

                <button
                  disabled={ loading ? true : false }
                  onClick={ handleFollow }
                  className={`
                    xx:w-full

                    px-4 
                    py-2 
                    text-sm 
                    font-medium 
                    text-center 
                    text-white 
                    bg-sky-400 
                    rounded-lg 
                    hover:bg-sky-800 
                    focus:ring-4 
                    focus:outline-none 
                    focus:ring-sky-300 
                    dark:bg-sky-600 
                    dark:hover:bg-sky-700 
                    dark:focus:ring-sky-800
                  `}
                >
                  {
                    followButton()
                  }
                </button>

                <button
                  onClick={ () => accessChat(id) }
                  className={`
                    xx:w-full
                    items-center 
                    px-4 
                    py-2 
                    text-sm 
                    font-medium
                    text-center
                    text-gray-900
                    bg-white border
                    border-gray-300
                    rounded-lg
                    hover:bg-gray-100
                    focus:ring-4 focus:outline-none
                    focus:ring-gray-200
                    dark:bg-gray-800
                    dark:text-white
                    dark:border-gray-600
                    dark:hover:bg-gray-700
                    dark:hover:border-gray-700
                    dark:focus:ring-gray-700

                    xx:mt-2
                    sx:mt-0
                  `}
                >
                  Message
                </button>
              </div>
          }

        </div>

      </div>
    </div>

  )
}

export default UserCard