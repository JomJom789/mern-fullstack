import React, { useState } from 'react'

// Icons
// import { GiMoon } from 'react-icons/gi'

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBars } from '@fortawesome/free-solid-svg-icons';

import {   
  HomeNavLogo,
  HomeNavItems,  
  HomeNavMenu,
} from '..';

/* -------------------------------------------------------------------------- */
/*                                   Navbar                                   */
/* -------------------------------------------------------------------------- */
const HomeNavbar = () => {

  // Check if Scroll
  const [navbar, setNavbar] = useState(false)

  const navChange = () => {    
    if(window.scrollY > 80) {
      setNavbar(true)      
    }else {
      setNavbar(false)
    }
  }

  // Param: Scroll? - I don't know
  window.addEventListener('scroll', navChange)

  /* ---------------------------------- View ---------------------------------- */
  return (
    <header
      className={`
        bg-white 
        dark:slate-800
        overflow-hidden
      `}
    >       
      <nav 
        className={
          navbar ? 
            'w-full fixed top-0 bg-white dark:bg-slate-900 z-10 drop-shadow-xl' 
          : 
            'w-full fixed top-0 bg-white dark:bg-slate-900 z-10'
        }
      >
        <div 
          className={`
            xx:mx-5
            md:container
            md:mx-auto 
            py-5 
            flex 
            items-center 
            justify-between
          `}        
        >
          
          {/* Logo */}
          <HomeNavLogo />
          
          {/* Nav */}
          <HomeNavItems />

          {/* NavMenu */}
          <HomeNavMenu />
                                                                       
        </div>

      </nav>    
    </header>
  )
}

export default HomeNavbar
