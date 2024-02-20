import React from 'react'

/* ---------------------------------- Redux --------------------------------- */
import {
	useDispatch,
  useSelector,
} from "react-redux";

/* ------------------------------- Material UI ------------------------------ */
import { 
  Avatar,
  Stack
} from '@mui/material';

/* -------------------------------- MUI Icon -------------------------------- */
import {
  MoreHorizOutlined
} from '@mui/icons-material';


/* -------------------------------------------------------------------------- */
/*                                  GroupCard                                 */
/* -------------------------------------------------------------------------- */
const GroupCard = ({
  item, 
  name, 
  groupChatPicture, 
  users,
  setView, 
  setUpdateData, 
  accessGroupChat,
  setIsChatOpen
}) => {
  
  /* -------------------------------- Param Log ------------------------------- */
  // console.log(item);
  
  /* -------------------------------------------------------------------------- */
  /*                             Redux State Reducer                            */
  /* -------------------------------------------------------------------------- */

  // * Dispatch
  const dispatch = useDispatch();

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
        shadow-none
        cursor-pointer
      `}
    >
      {/* Name */}
      <div className="w-full">

        <div 
          className={`
            text-gray-500 
            text-sm 
            mb-1.5 
            dark:text-gray-400
          `}
        >

          {/* Group Name */}
          <span 
            onClick={() => {
              accessGroupChat(item._id);
              dispatch(setIsChatOpen(true));
            }}
            className={`
              font-semibold 
              text-gray-900 
              dark:text-white
            `}
          >
            { name }
          </span>

          {/* Users */}
          <Stack   
            direction="row" 
            spacing={1} 
            marginTop={2}
          >
            {users.slice(0, 5).map((item, index) => (
              // console.log(item)
              <Avatar 
                key={item + index + item.firstName}
                alt={item.firstName + " " + item.lastName} 
                src={
                  item.type === "website"
                  ? `${process.env.REACT_APP_BASE_URL}/profile/${item.picturePath}`
                  : item.picturePath
                }
                sx={{ width: 30, height: 30 }}
              />
              

            ))}
          </Stack>

        </div>
       
      </div>
      
      {/* Settings */}
      <MoreHorizOutlined 
        onClick={() => {
          setView('update');
          setUpdateData(item);
        }}
        className={`
          text-slate-500 
          hover:text-slate-800 
          mt-1
          float-right
        `}
      />
  
    </div>
  )
}

export default GroupCard