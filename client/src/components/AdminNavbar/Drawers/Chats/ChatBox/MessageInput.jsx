import React from 'react'

/* -------------------------------------------------------------------------- */
/*                                MessageInput                                */
/* -------------------------------------------------------------------------- */
const MessageInput = ({newMessage, typingHandler, sendMessage}) => {


  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div
      className={`
        w-full   
        flex 
        flex-row 
        items-center 
        h-16
        px-4
        bg-slate-50

        fixed
        bottom-0
        left-0
      `}
    >
      <div>
        
        {/* File */}
        <button
          className={`
            items-center 
            justify-center 
            text-gray-400
            hover:text-gray-600
          `}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            ></path>
          </svg>
        </button>

        {/* Emoji */}
        <button
          className={`
            items-center 
            justify-center 
            h-full 
            text-gray-400 
            hover:text-gray-600
          `}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </button>

      </div>

      {/* Input */}
      <div className="flex-grow ">
        <div className=" w-full">
          
          <input
            type="text"
            value={ newMessage }
            onChange={ typingHandler }
            className={`
              flex 
              w-full 
              border 
              rounded-xl 
              focus:outline-none 
              focus:border-blue-200 
              px-2 
              h-10
            `}
          />

        </div>
      </div>
      
      {/* Submit Button */}
      <div className="ml-2">
        
        <button
          onClick={ () => sendMessage() }
          className={`
            flex 
            items-center 
            justify-center 
            bg-blue-400 
            hover:bg-blue-500 
            rounded-xl 
            text-white 
            px-4 
            py-1 
            flex-shrink-0
          `}
        >
          <span className="my-2">
            <svg
              className="w-4 h-4 transform rotate-45 -mt-px"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              ></path>
            </svg>
          </span>
        </button>

      </div>
    </div>
  )
}

export default MessageInput