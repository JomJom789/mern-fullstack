import React from 'react'

/* -------------------------------------------------------------------------- */
/*                                   NavLogo                                  */
/* -------------------------------------------------------------------------- */
const HomeNavLogo = () => {

  /* ---------------------------------- View ---------------------------------- */
  return (
    <div 
      className={`
        flex 
        items-center 
        gap-2
      `}
    >
      {/* <img 
        className="w-8" 
        src="./img/logo.png" 
        alt="" 
      /> */}

      <span 
        className={`
          text-xl 
          font-bold 
          text-sky-400 
          dark:text-white
        `}         
      >
        {/* Jomel Dumaran */}
      </span>
    </div>
  )
}

export default HomeNavLogo