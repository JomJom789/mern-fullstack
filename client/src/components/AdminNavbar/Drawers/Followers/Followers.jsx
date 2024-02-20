import React, {
  useState,
  useEffect,
  useReducer,
} from 'react'

/* -------------------------------------------------------------------------- */
/*                                     MUI                                    */
/* -------------------------------------------------------------------------- */
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

/* -------------------------------------------------------------------------- */
/*                                    Icons                                   */
/* -------------------------------------------------------------------------- */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

/* -------------------------------------------------------------------------- */
/*                                    Redux                                   */
/* -------------------------------------------------------------------------- */
import {   
  useDispatch,
  useSelector,
} from "react-redux";

import { 
  setFollowers,
} from "../../../../state/authReducer";

/* -------------------------------------------------------------------------- */
/*                                 Components                                 */
/* -------------------------------------------------------------------------- */
import FollowCard from './Cards/FollowCard';

//* -------------------------------------------------------------------------- */
//*                                  Followers                                 */
//* -------------------------------------------------------------------------- */
const Followers = ({ closeMenu }) => {

  /* -------------------------------------------------------------------------- */
  /*                             Redux State Reducer                            */
  /* -------------------------------------------------------------------------- */
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const {
    _id,
    followers,
    following,
  } = useSelector((state) => state.auth.user);
  
  // * Log
  // console.log(followers);
  // console.log(following);

  /* -------------------------------------------------------------------------- */
  /*                                Filter Follow                               */
  /* -------------------------------------------------------------------------- */
  
  // * Value
  const [value, setValue] = useState("request");

  // * All
  // const allFollow = followers.concat(following);

  // * New Followers
  const newFollowers = followers.filter((follower) => follower.status === "requested");
  
  /* -------------------------------------------------------------------------- */
  /*                            Update Viewed to True                           */
  /* -------------------------------------------------------------------------- */
  
  // * Update Any Changes Official from React Docs
  const [updateValue, forceUpdate] = useReducer(x => x + 1, 0);

  // * UseEffect
  useEffect(() => {
    updateFollowerViewed();    
  }, [updateValue]); // eslint-disable-line react-hooks/exhaustive-deps

  /* -------------------------------------------------------------------------- */
  /*                         Update Viewed in Followers                         */
  /* -------------------------------------------------------------------------- */
  const updateFollowerViewed = async () => {

		// * Fetch
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/follows/update/viewed/${_id}`, {
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

    // * Store to Redux
    dispatch(setFollowers({ followers: data }));

	};

  /* -------------------------------------------------------------------------- */
  /*                                Handle Change                               */
  /* -------------------------------------------------------------------------- */
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div 
      // ${currentMode === 'Dark' ? `dark:bg-slate-900` : `bg-white`}
			className={`
        h-full
				pb-20        
				dark:text-white
        bg-white
        dark:bg-slate-900
        overflow-auto
			`}
		>
			<div 
				className={`
          md:container 
          md:mx-auto
				`}
			>
        
        {/* --------------------------------- Header --------------------------------- */}
        <div 
					className={`            
            px-4
            py-4
						
            font-medium 
            text-center 
            text-gray-700
            dark:text-white
						bg-slate-50
            dark:bg-slate-800
						drop-shadow-sm
            border-b

            flex 
						justify-between
            items-center
					`}
				>

          <div className={`font-bold`} >
            Followers
          </div>
															                 
          <FontAwesomeIcon                             
            icon={ faXmark } 
            onClick={ closeMenu }
            className={`
              w-7 
              text-black-400
            `}
          />
					
				</div>
        
        {/* ---------------------------------- Tabs ---------------------------------- */}
        <Tabs
          variant="scrollable"
          value={value}
          onChange={handleChange}
          className={`
            text-sm
            xx:justify-center
            md:row-start-1
          `}
        >
          <Tab 
            label="Requests" 
            value="request" 
            className={`text-black dark:text-white`}
          />

          <Tab 
            label="Followers" 
            value="followers" 
            className={`text-black dark:text-white`}
          />

          <Tab 
            label="Followings" 
            value="following"
            className={`text-black dark:text-white`}
          />

        </Tabs>

        {/* ---------------------------------- List ---------------------------------- */}
        <div           
          className={`
            z-20 
            w-full 
            bg-white 
            divide-y 
            divide-gray-100 
            shadow 
            dark:bg-gray-800 
            dark:divide-gray-700
          `}
        >
          
          <div 
            className={`
              divide-y 
              divide-gray-100 
              dark:divide-gray-700
            `}
          >

            {
              value === "request" && (
              newFollowers.length > 0 
              ? newFollowers.map((item, index) => 
                  <FollowCard 
                    key={`${item.name}-${item._id}`}
                    id={item._id}
                    type={item.type}
                    profilePicture={item.profilePicture}
                    name={item.name}
                    date_added={item.date_added}
                    status={item.status}
                    forceUpdate={forceUpdate}
                    value={value}
                  />
                )
              : <div className={`w-full text-center p-10`}>
                  No Request
                </div>
              )
            }

            {
              value === "followers" && (
                followers.length > 0 
                ? followers.map((item, index) => 
                    <FollowCard 
                      key={`${item.name}-${item._id}`}
                      id={item._id}
                      type={item.type}
                      profilePicture={item.profilePicture}
                      name={item.name}
                      date_added={item.date_added}
                      status={item.status}
                      forceUpdate={forceUpdate}
                      value={value}
                    />
                  )
                : <div className={`w-full text-center p-10`}>
                    No Followers
                  </div>
              )
            }

            {
              value === "following" && (
                following.length > 0 
                ? following.map((item, index) => 
                    <FollowCard 
                      key={`${item.name}-${item._id}`}
                      id={item._id}
                      type={item.type}
                      profilePicture={item.profilePicture}
                      name={item.name}
                      date_added={item.date_added}
                      status={item.status}
                      forceUpdate={forceUpdate}
                      value={value}
                    />
                  )
                : <div className={`w-full text-center p-10`}>
                    No Followers
                  </div>
              )
            }

          </div>
          
          {/* -------------------------------- View All -------------------------------- */}
          {/* 
          <Link
            className={`
              block 
              py-2 
              text-sm 
              font-medium 
              text-center 
              text-gray-900 
              bg-gray-50 
              hover:bg-gray-100 
              dark:bg-gray-800 
              dark:hover:bg-gray-700 
              dark:text-white
            `}
          >
            <div className="inline-flex items-center ">
              <svg className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd">
                </path>              
              </svg>
                View all
            </div>
          </Link> 
          */}

        </div>  
			
		  </div>
		</div>
  )
}

export default Followers;