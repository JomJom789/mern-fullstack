import React, {
  useEffect,
  useState,
} from 'react'

//* -------------------------------------------------------------------------- */
//*                                    Redux                                   */
//* -------------------------------------------------------------------------- */
import { 
  // useDispatch,
  useSelector
} from "react-redux";

//* -------------------------------------------------------------------------- */
//*                                 Components                                 */
//* -------------------------------------------------------------------------- */
import {   
  AdminNavItems,
  AdminNavLogo,  
  AdminNavMenu,
} from '..';

//* -------------------------------------------------------------------------- */
//*                                  Socket IO                                 */
//* -------------------------------------------------------------------------- */
import io from "socket.io-client";

var socket;

//* -------------------------------------------------------------------------- */
//*                                 AdminNavbar                                */
//* -------------------------------------------------------------------------- */
const AdminNavbar = () => {

  /* -------------------------------------------------------------------------- */
  /*                                    Redux                                   */
  /* -------------------------------------------------------------------------- */
  // const dispatch = useDispatch();

  const { _id } = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  
  /* -------------------------------------------------------------------------- */
  /*                              Socket Connected                              */
  /* -------------------------------------------------------------------------- */
  const [socketConnected, setSocketConnected] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                              useEffect: Socket                             */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {

    // * Pass Server endpoint to Socket
    socket = io(process.env.REACT_APP_BASE_URL);

    // * Log Connection Status
    // console.log(socket);

    // * Setup and Pass User Data to Server Socket
    socket.emit("setup", _id);

    // * Connect Socket
    socket.on("connected", () => setSocketConnected(true));
    
    // * Action Follow
    // socket.on("follow", () => setIsFollow(true));
    
    // * Test: Response from Server using Socket
    // socket.on('FromAPI', (data) => {
    //   setResponse(data);
    // });

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* -------------------------------------------------------------------------- */
  /*                           useEffect: Check Online                          */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {

    // if Website is not visible set to Offline
    document.onvisibilitychange = function() {
      if (document.visibilityState === 'hidden') {
        changeActiveStatus(false);
      } else {
        changeActiveStatus(true);
      }
    };

  }, []);

  /* -------------------------------------------------------------------------- */
  /*                             changeActiveStatus                             */
  /* -------------------------------------------------------------------------- */
  const changeActiveStatus = async (online) => {

    // * Fetch
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/active-status/${_id}/${online}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // * Response
    const data = await response.json();
    
    // * Log
    // console.log(data);

    // * Set Active Status On/Off
    if(online) {

      // * Send to active-status
      socket.emit(
        "active-status", // Socket Name
        "login",        // Action
        _id,             // User (My ID)
      );

    } else {

      // * Send to active-status
      socket.emit(
        "active-status", // Socket Name
        "logout",        // Action
        _id,             // User (My ID)
      );

    }
    
  }

  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <header
      className={`
        bg-white 
        dark:slate-800
        overflow-hidden
      `}
    >       
      <nav 
        className={`
          w-full 
          fixed 
          top-0 
          bg-white 
          dark:bg-slate-900 z-10
        `}
      >
        <div 
          className={`
            mx-5 
            py-5 
            flex 
            items-center 
            justify-between
          `}
        >
          
          {/* Logo */}
          <AdminNavLogo />
          
          {/* Nav */}
          <AdminNavItems />

          {/* NavMenu */}
          <AdminNavMenu />

        </div>

      </nav>
    </header>
  );
}

export default AdminNavbar