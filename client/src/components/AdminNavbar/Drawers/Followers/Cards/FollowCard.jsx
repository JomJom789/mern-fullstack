import React, {
  useState,
  useEffect,
  useReducer,
} from 'react'

import { Link } from 'react-router-dom'

/* ---------------------------------- Redux --------------------------------- */
import {   
  useDispatch,
  useSelector,
} from "react-redux";

import { 
  setFollowers,
  setFollowing,
  setRemoveFollower,
  setRemoveFollowerById,
  setRemoveFollowingById,
} from "../../../../../state/authReducer";

/* -------------------------------- Time Ago -------------------------------- */
import ReactTimeAgo from 'react-time-ago'

/* -------------------------------- Socket IO ------------------------------- */
import io from "socket.io-client";

var socket;

/* -------------------------------------------------------------------------- */
/*                                 FollowCard                                 */
/* -------------------------------------------------------------------------- */
const FollowCard = ({ id, type, profilePicture, name, date_added, status, forceUpdate, value }) => {

  /* -------------------------------------------------------------------------- */
  /*                             Redux State Reducer                            */
  /* -------------------------------------------------------------------------- */
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  
  const {
    _id,
  } = useSelector((state) => state.auth.user);

  /* -------------------------------------------------------------------------- */
  /*                              Follow Socket.IO                              */
  /* -------------------------------------------------------------------------- */
  // * Socket
  const [socketConnected, setSocketConnected] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                                  useEffect                                 */
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
    //   setResponse(data);
    // });

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* -------------------------------------------------------------------------- */
  /*                              Confirm Follower                              */
  /* -------------------------------------------------------------------------- */
  const confirmFollower = async (userId) => {

    // * Fetch
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/follows/confirm/${_id}/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // * Response
    const data = await response.json();

    // * Log
    // console.log(data.followersData);
    // console.log(data.followingData);

    // * Socket IO
    socket.emit(
      "confirm-follow",
      _id,
      data.yourData,
      userId,
    );

    // * Join 2 Arrays
    // const joinFollowers = followers.concat(data.followersData);
    // const joinFollowing = following.concat(data.followingData);

    // * Log
    // console.log(joinFollowers);
    // console.log(joinFollowing);

    // * Save the Data into Redux (Your Own Cache)
    dispatch(setFollowers({ followers: data.followersData }));
    dispatch(setFollowing({ following: data.followingData }));

    // * Update
    forceUpdate();

  }

  /* -------------------------------------------------------------------------- */
  /*                               Remove Follower                              */
  /* -------------------------------------------------------------------------- */
  const removeFollower = async (userId) => {

    // * Fetch
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/follows/remove/${_id}/${userId}`, {
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
    socket.emit(
      "remove-follow",
      _id,
      userId,
    );

    // * Store to Redux
    // dispatch(setRemoveFollowerById({ followers: data._id}));
    dispatch(setRemoveFollowerById( data._id ));
    dispatch(setRemoveFollowingById( userId ));

    // * Update
    forceUpdate();

  }

  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div
      key={id}
      className={`
        flex 
        px-4 py-3 
        hover:bg-gray-100 
        dark:hover:bg-gray-700
      `}
    >
      <Link
        to={`/admin/users/${id}`}
        className="flex-shrink-0"
      >
        <img 
          src={
            type === "website"
            ? `${process.env.REACT_APP_BASE_URL}/profile/${profilePicture}`
            : profilePicture
          } 
          alt="none"
          className={`
            w-11
            h-11
            rounded-full
          `}
        />
      </Link>

      <div className="w-full pl-3">

        <div 
          className={`
          text-gray-500
            text-sm mb-1.5
            dark:text-gray-400
            space-x-1
          `}
        >
          
          <Link 
            to={`/admin/users/${id}`}
            className="font-semibold text-gray-900 dark:text-white"
          >
            { name }
          </Link>

          <br/>
          
          started following you

        </div>
        
        <div className={`text-xs text-sky-600 dark:text-sky-500`}>
          <ReactTimeAgo 
            locale="en-US"
            date={ Date.parse(date_added) }
          />
        </div>
        
        <div className="flex mt-3 space-x-3 md:mt-4">
          
          {
            value !== "following" 
            ? status === "requested" 
              ? <button 
                  onClick={ () => confirmFollower(id) }
                  className={`
                    inline-flex 
                    items-center 
                    px-4 py-2 
                    text-sm font-medium 
                    text-center text-white 
                    rounded-lg
                    bg-sky-400 
                    hover:bg-sky-600 
                    focus:ring-4 focus:outline-none 
                    focus:ring-sky-300 
                    dark:bg-sky-400 
                    dark:hover:bg-sky-500 
                    dark:focus:ring-sky-600
                  `}
                >
                  Confirm
                </button>
              : <div></div>
            : <div></div>
          }

          <button 
            onClick={ () => removeFollower(id) }
            className={`
              inline-flex 
              items-center 
              px-4 py-2 
              text-sm 
              font-medium 
              text-center 
              text-gray-900 
              bg-white 
              rounded-lg 
              border 
              border-gray-300
                hover:bg-gray-100 
                focus:ring-4 
                focus:outline-none 
                focus:ring-gray-200 
                dark:bg-gray-800 
                dark:text-white 
                dark:border-gray-600 
                dark:hover:bg-gray-700 
                dark:hover:border-gray-700 
                dark:focus:ring-gray-700
            `}
          >
            Remove
          </button>
        </div>

      </div>
    </div>
  )
}

export default FollowCard;