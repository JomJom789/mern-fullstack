import React, {
  useState
} from 'react'

/* ---------------------------------- Redux --------------------------------- */
import {
	useDispatch,
  useSelector,
} from "react-redux";

/* ------------------------------ State Reducer ----------------------------- */
import {
  setIsChatOpen,
} from "../../../../state/adminReducer";

/* -------------------------------- MUI Tabs -------------------------------- */
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

/* ---------------------------------- Icons --------------------------------- */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

/* ----------------------------- List Components ---------------------------- */
import ListMessage from './List/ListMessage';
import ListContacts from './List/ListContacts';
import ListUser from './List/ListUser';
import ChatBox from './ChatBox/ChatBox';
import ListGroups from './List/ListGroups';

/* -------------------------------------------------------------------------- */
/*                                    Chats                                   */
/* -------------------------------------------------------------------------- */
const Chats = (props) => {

  /* -------------------------------------------------------------------------- */
  /*                                Value Toggle                                */
  /* -------------------------------------------------------------------------- */
  const [value, setValue] = useState("messages");
  
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
  const isChatOpen = useSelector((state) => state.admin.isChatOpen);
  const chats = useSelector((state) => state.admin.chats);
  const selectedChat = useSelector((state) => state.admin.selectedChat);

  // * Log
  // console.log(chats);
  // console.log(selectedChat);
  // console.log(isChatOpen);
  
  /* -------------------------------------------------------------------------- */
  /*                              Handle Tab Change                             */
  /* -------------------------------------------------------------------------- */
  const handleTabChange = (event, newValue) => {
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
        overflow-auto
				pb-20
				dark:text-white
        bg-white
        dark:bg-slate-900
			`}
		>
			<div 
				// className={`
        //   md:container 
        //   md:mx-auto
				// `}
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
            border-b

            flex 
						justify-between
            items-center

            fixed
            w-full
            z-10
					`
        }
				>
          <div 
            className={`font-bold`}          
          >
            My Chats
          </div>
															                 
          <FontAwesomeIcon                             
            icon={ faXmark } 
            onClick={ props.closeMenu }
            className={`
              w-7 
              text-black-400
            `}
          />
					
				</div>

        {/* --------------------------------- Content -------------------------------- */}
        <div>
          
        {
          isChatOpen
          ? <ChatBox />
          : <div>

              {/* Tabs */}
              <Tabs
                variant="scrollable"
                value={value}
                onChange={handleTabChange}
                className={`
                  text-sm
                  xx:justify-center
                  md:row-start-1
                  relative
                  top-14
                `}
              >
                <Tab 
                  label="Messages" 
                  value="messages" 
                  className={`text-black dark:text-white`}
                />

                <Tab 
                  label="Contacts" 
                  value="contacts"
                  className={`text-black dark:text-white`}
                />

                <Tab 
                  label="Groups" 
                  value="groups" 
                  className={`text-black dark:text-white`}
                />

                <Tab 
                  label="Users" 
                  value="users" 
                  className={`text-black dark:text-white`}
                />

              </Tabs>

              {/* List */}
              <div           
                className={`
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
                  {value === "messages" && <ListMessage/> }
                  {value === "contacts" && <ListContacts /> }
                  {value === "groups" && <ListGroups /> }
                  {value === "users" && <ListUser /> }
                </div>

              </div>
            </div>
        }

        </div>

		  </div>

		</div>
  )
}

export default Chats;