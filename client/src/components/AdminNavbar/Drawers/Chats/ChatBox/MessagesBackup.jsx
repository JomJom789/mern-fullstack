import React from 'react'

/* -------------------------------------------------------------------------- */
/*                               MessagesBackup                               */
/* -------------------------------------------------------------------------- */
const MessagesBackup = () => {
  
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
      `}
    >
      {messages &&
        messages.map((m, i) => (

          <div>

            {/* User */}
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
                  isSameSender(messages, m, i, _id) || 
                  isLastMessage(messages, i, _id)
                ) && (
                  // <Tooltip 
                  //   label={m.sender.name} 
                  //   placement="bottom-start" 
                  //   hasArrow
                  // >
                    <div 
                      className={`
                        flex-shrink-0 
                        h-8 
                        w-8 
                        rounded-full 
                        bg-gray-300
                      `}
                    >
                    </div>

                    // <Avatar
                    //   mt="7px"
                    //   mr={1}
                    //   size="sm"
                    //   cursor="pointer"
                    //   name={m.sender.name}
                    //   src={m.sender.pic}
                    // />
                  // </Tooltip>
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
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
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
                  2 min ago
                </span>
              </div>

            </div>

            {/* Me */}
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
                    text-white 
                    p-3 
                    rounded-l-lg 
                    rounded-br-lg
                  `}
                >
                  <p className="text-xs font-normal text-white">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
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
                  2 min ago
                </span>

              </div>

              {/* Profile Image */}
              <div 
                className={`
                  flex-shrink-0 
                  w-8
                  h-8 
                  rounded-full 
                  bg-gray-300
                `}
              >
              </div>

            </div>

          </div>
        ))
      }

    </div>
  )
}

export default MessagesBackup