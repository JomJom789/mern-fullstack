import React, {
  // useEffect,
  // useState,
} from 'react'

//* -------------------------------------------------------------------------- */
//*                                  AdminPage                                 */
//* -------------------------------------------------------------------------- */
const AdminPage = () => {

  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div 
      className={`
        h-screen                
        px-5
        py-10
        mt-[45px]
      `}
    >
      <h1
        className={`
          xx:text-center
          md:text-start
          xx:text-xl
          md:text-4xl
          font-bold
          text-gray-700             
          dark:text-white
        `}
      >
        Admin Dashboard
      </h1>
    </div>
  );
}

export default AdminPage