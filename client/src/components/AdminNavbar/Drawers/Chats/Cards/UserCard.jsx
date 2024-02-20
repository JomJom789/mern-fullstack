import React from 'react'

/* -------------------------------------------------------------------------- */
/*                                  UserCard                                  */
/* -------------------------------------------------------------------------- */
const UserCard = ({user, handleFunction}) => {

  /* -------------------------------------------------------------------------- */
  /*                                    Logs                                    */
  /* -------------------------------------------------------------------------- */
  // console.log(user);

  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div
      onClick={ handleFunction }
      className={`
        flex
        py-1
        bg-white
        dark:bg-slate-900
        hover:bg-gray-100 
        dark:hover:bg-gray-700
        cursor-pointer
      `}
    >
      <div
        className={`relative`}
      >

        { 
          user.active 
          ? <div>

              <img 
                src={
                  user.type === "website"
                  ? `${process.env.REACT_APP_BASE_URL}/profile/${user.picturePath}`
                  : user.picturePath
                }
                alt={user.picturePath}
                className={`
                  w-10 
                  h-10
                  z-0
                  border
                  rounded-xl
                `}
              />

              <div 
                className={`
                  absolute
                  items-center
                  justify-center
                  w-4
                  h-4
                  ml-6
                  -mt-5
                  bg-green-400
                  border-2
                  border-white
                  dark:border-gray-800
                  rounded-xl
                  z-40
                `}
              >
              </div>
            </div>
          : <img 
              src={
                user.type === "website"
                ? `${process.env.REACT_APP_BASE_URL}/profile/${user.picturePath}`
                : user.picturePath
              }
              alt={user.picturePath}
              className={`
                rounded-xl
                w-10 
                h-10
                z-0
                border
              `}
            />
        }

      </div>

      <div className="w-full pl-3">

        <div 
          className={`
            text-gray-500 
            text-sm 
            mb-1.5 
            dark:text-gray-400
          `}
        >

          <span 
            className={`
              font-semibold 
              text-gray-900 
              dark:text-white
            `}
          >
            { user.firstName + " " + user.lastName }
          </span>

          <p 
            className={`
              text-xs
              text-slate-500
              truncate
            `}
          >
            { user.email }
          </p>
          
        </div>
                    
      </div>
    </div>
  )
}

export default UserCard