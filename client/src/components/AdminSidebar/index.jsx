import React from 'react';
import { NavLink } from 'react-router-dom';

/* ---------------------------------- Icons --------------------------------- */
// import { SiShopware } from 'react-icons/si';
// import { MdOutlineCancel } from 'react-icons/md';

import { links } from '../../data/admin-sidebar';

/* -------------------------------------------------------------------------- */
/*                                AdminSidebar                                */
/* -------------------------------------------------------------------------- */
const AdminSidebar = () => {

  
  /* -------------------------------------------------------------------------- */
  /*                                 Link Design                                */
  /* -------------------------------------------------------------------------- */
  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-600 dark:text-gray-200 dark:hover:text-black hover:bg-slate-100 m-2 font-semibold';

  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div 
      className={`    
        h-screen 
        md:overflow-hidden 
        overflow-auto 
        md:hover:overflow-auto 
        pb-20
        dark:bg-slate-900
        drop-shadow-lg
      `}
    >
      
      <div className='px-3'>
                  
        {/* Data */}
        <div className="">
          {links.map((item) => (
            <div key={item.title}>    

              <p 
                className={`
                  text-gray-400 
                  dark:text-gray-400 
                  m-3 
                  mt-4 
                  uppercase                  
                `}
              >
                {item.title}
              </p>
              
              {
                item.links.map((link) => (
                  <NavLink
                    key={link.name}  
                    to={`admin/${link.name}`}
                    style={({ isActive }) => ({
                      fontSize: "15px",
                      backgroundColor: isActive ? '#00b7ff' : '',
                    })}
                    className={                    
                      ({ isActive }) => (isActive ? activeLink : normalLink)
                    }
                  >
                    
                    {/* Icon  */}
                    {link.icon}
                    
                    {/* Name */}
                    <span 
                      className={`
                        w-1/2
                        capitalize
                      `}                    
                    >
                      {link.name}
                    </span>
                                  
                  </NavLink>
                ))
              }
            </div>
          ))}
        </div>

      </div>
      
    </div>
  )
}

export default AdminSidebar