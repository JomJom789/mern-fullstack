import React, {
  useState,
  useRef,
  useEffect
} from 'react'

/* ---------------------------------- Redux --------------------------------- */
import {
	useDispatch,
  useSelector,
} from "react-redux";

/* --------------------------------- Config --------------------------------- */
// import { 
//   isSameSender, 
//   isLastMessage, 
//   isSameUser,
// } from "../../../../../config/chatLogics";

/* ---------------------------- Lottie Animation ---------------------------- */
import Lottie from "lottie-react";
import typingAnimation from "../../../../../animations/typing.json";

/* -------------------------------- MUI Icon -------------------------------- */
import {
  ClearOutlined,
} from '@mui/icons-material';

/* ---------------------------------- Modal --------------------------------- */
import DeleteMessage from '../Cards/Modal/DeleteMessage';

/* -------------------------------- Time Ago -------------------------------- */
import ReactTimeAgo from 'react-time-ago'

/* -------------------------------------------------------------------------- */
/*                                  Messages                                  */
/* -------------------------------------------------------------------------- */
const Messages = ({
  messages, 
  setMessages, 
  userId, 
  isTyping, 
  userType, 
  userPicturePath
}) => {
    
  /* -------------------------------------------------------------------------- */
  /*                                    Modal                                   */
  /* -------------------------------------------------------------------------- */
	
	// * Modal DeleteMessage
	const [isOpen, setIsOpen] = useState(false);

  const [messageId, setMessageId ] = useState();

  /* -------------------------------------------------------------------------- */
  /*                             Redux State Reducer                            */
  /* -------------------------------------------------------------------------- */

  // * Dispatch
  // const dispatch = useDispatch();

  // * Auth Reducer
  // const token = useSelector((state) => state.auth.token);
  const {
    _id,
  } = useSelector((state) => state.auth.user);

  // * Admin Reducer
  // const chats = useSelector((state) => state.admin.chats);
  const selectedChat = useSelector((state) => state.admin.selectedChat);
  // const activeUsers = useSelector((state) => state.admin.activeUsers);

  // * Log
  // console.log(chats);
  // console.log(selectedChat);

  // * Detect Message
  const messageEl = useRef(null);

  /* -------------------------------------------------------------------------- */
  /*                            useEffect Auto Scroll                           */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {

    if (messageEl.current) {
      messageEl.current.scrollIntoView({ behavior: "instant", block: "end" })
    }

  }, [messages]);

  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div       
      className={`
        flex 
        flex-col 
        flex-grow 
        p-4
        
        mt-24
        w-full        
      `}
    >
      {/* ---------------------------------- Modal --------------------------------- */}
      <DeleteMessage
				isOpen={ isOpen }
				setIsOpen={ setIsOpen }
        chatId={selectedChat._id}
        messageId={messageId}
        setMessages={setMessages}
			/>

      {/* -------------------------------- Messages -------------------------------- */}
      <div >
        {messages &&
          messages.map((item, index) => (
            
            <div key={item + index} >
              {
                item.sender._id === _id 
                
                ? <div> {/* ----------------------------------- Me ----------------------------------- */}
                    <div 
                      className={`
                        flex 
                        w-full 
                        mt-2 
                        space-x-3 
                        max-w-xs 
                        ml-auto 
                        justify-end
                      `}
                    >
                      <div>
                        
                        {/* Message */}
                        <div 
                          className={`
                            bg-blue-600
                            p-3 
                            rounded-l-lg 
                            rounded-br-lg
                            relative
                          `}
                        >

                          <p className="text-xs font-normal text-white">
                            { item.content }
                          </p>

                          <ClearOutlined
                            onClick={() => {
                              setIsOpen(!isOpen);
                              setMessageId(item._id);
                            }} 
                            sx={{
                              width: 20,
                              height: 20,
                            }} 
                            className={`
                              bg-blue-600
                              text-white
                              absolute
                              -top-1
                              -right-1
                              border-2
                              border-white
                              rounded-full
                            `}
                          />

                        </div>

                        {/* Time */}
                        <span 
                          className={`
                            text-[8px] 
                            text-gray-500 
                            leading-none
                            float-left
                            mt-1
                          `}
                        >
                          <ReactTimeAgo 
                            locale="en-US"
                            date={ Date.parse(item.createdAt) }
                          />
                        </span>
                        
                      </div>

                    </div>
                    
                  </div>
                : <div> {/* ---------------------------------- User ---------------------------------- */}
                    <div 
                      className={`
                        flex 
                        w-full 
                        mt-2 
                        space-x-3 
                        max-w-xs
                      `}
                    >

                      {/* Profile Image */}         
                      {
                        ( 
                          <img 
                            src={
                              item.sender.type === "website"
                              ? `${process.env.REACT_APP_BASE_URL}/profile/${item.sender.picturePath}`
                              : item.sender.picturePath
                            }
                            alt={item.sender.picturePath}
                            className={`
                              flex-shrink-0 
                              h-8 
                              w-8 
                              rounded-full 
                            `}
                          />
                        )
                      }                            

                      {/* Message */}
                      <div>
                        <div 
                          className={`
                            bg-gray-200
                            p-3 
                            rounded-r-lg 
                            rounded-bl-lg
                          `}
                        >
                          <p 
                            className={`
                              text-xs 
                              font-normal 
                              text-slate-800
                            `}
                          >
                            { item.content }
                          </p>

                        </div>
                        
                        {/* Time */}
                        <span 
                          className={`
                            text-xs 
                            text-gray-500 
                            leading-none
                          `}
                        >
                          <ReactTimeAgo 
                            locale="en-US"
                            date={ Date.parse(item.createdAt) }
                          />
                        </span>
                      </div>

                    </div>
                  </div>
              }
            </div>
          ))
        }
        
        {/* --------------------------------- Typing --------------------------------- */}
        {
          isTyping && userId !== _id
          ? <div
              className={` 
                w-full 
                mt-2 
                space-x-3 
                max-w-xs
              `}
            >
              
              <div className='flex items-center'>
                <img 
                  src={
                    userType === "website"
                    ? `${process.env.REACT_APP_BASE_URL}/profile/${userPicturePath}`
                    : userPicturePath
                  }
                  alt={ userPicturePath }
                  className={`
                    h-8 
                    w-8 
                    rounded-full
                  `}
                />

                <Lottie 
                  animationData={typingAnimation} 
                  // height={10}
                  // width={10}
                  // style={{ marginBottom: 15, marginLeft: 0 }}
                  className=''
                />
              </div>
              
            </div>
          : <div></div>
        }
      </div>

      <div 
        className={`messages mt-20`}
        ref={messageEl} 
      />

    </div>
  )
}

export default Messages