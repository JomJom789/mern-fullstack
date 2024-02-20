import React from 'react'
import { Link } from 'react-router-dom';

/* ---------------------------------- Redux --------------------------------- */
import { 
  useDispatch,
} from "react-redux";

/* ------------------------------ State Reducer ----------------------------- */
import {     
  setIsSidebarOpen,  
} from "../../state/adminReducer";

/* ---------------------------------- Icons --------------------------------- */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

/* -------------------------------------------------------------------------- */
/*                                AdminNavLogo                                */
/* -------------------------------------------------------------------------- */
const AdminNavLogo = () => {

  /* -------------------------------------------------------------------------- */
  /*                                    Redux                                   */
  /* -------------------------------------------------------------------------- */
  const dispatch = useDispatch();
  
  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div 
      className={`
        flex 
        items-center 
        gap-2
      `}
    >        
      <FontAwesomeIcon                    
        icon={ faBars }
        onClick={() => dispatch(setIsSidebarOpen({}))}
        className={`
          xx:hidden
          lg:block
          w-10
          cursor-pointer
          z-20
          text-slate-600
          dark:text-white
        `}
      />

      <Link
        to={`/`}                                
        className={`
          sm:text-lg
          mb:text-xl 
          font-bold 
          text-sky-400 
          dark:text-white
          cursor-pointer
        `}
      >
        Player ONE            
      </Link>
        
    </div>
  )
}

export default AdminNavLogo