import React, {
	useState,
	useEffect,
} from 'react'
import { Link } from 'react-router-dom'

/* ---------------------------------- Redux --------------------------------- */
import { 
  useDispatch, 
  useSelector,
} from "react-redux";

/* ---------------------------------- Icons --------------------------------- */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

/* --------------------------------- Context -------------------------------- */
// import { useStateContext } from '../../contexts/ThemeProvider';

/* ------------------------------ State Reducer ----------------------------- */
import { setLogout } from "../../../state/authReducer";

/* -------------------------------- Socket IO ------------------------------- */
import io from "socket.io-client";

var socket;

/* -------------------------------------------------------------------------- */
/*                                    User                                    */
/* -------------------------------------------------------------------------- */
const User = (props) => {

  // const { 
	// 	setColor,
	// 	setMode,
	// 	currentMode,
	// 	currentColor,
	// } = useStateContext();

  /* -------------------------------------------------------------------------- */
  /*                             Redux State Reducer                            */
  /* -------------------------------------------------------------------------- */
  const dispatch = useDispatch();

  const { _id } = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  /* -------------------------------------------------------------------------- */
  /*                              Socket Connected                              */
  /* -------------------------------------------------------------------------- */
  const [socketConnected, setSocketConnected] = useState(false);

	/* -------------------------------------------------------------------------- */
  /*                                  useEffect                                 */
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
  /*                                   logout                                   */
  /* -------------------------------------------------------------------------- */
  const logout = async () => {

    // * Fetch
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/logout/${_id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // * Response
    const data = await response.json();

    // * Delete Redux Data
    if(data.success) {

      // * Send to active-status
      socket.emit(
        "active-status", // Socket Name
        "logout",        // Action
        _id,             // User (My ID)
      );

      // * Delete Data from Redux
      dispatch(setLogout());

    }

  }

  /* ---------------------------------- View ---------------------------------- */
  return (
    <div 
      // ${currentMode === 'Dark' ? `dark:bg-slate-900` : `bg-white`}
			className={`
        h-full
				pt-5
				pb-20
        overflow-auto
				dark:text-white
        bg-white
        dark:bg-slate-900
			`}
		>
			<div 
				className={`
          sx:container 
          sx:mx-auto
				`}
			>
        {/* Header */}
				<div 
					className={`
            mx-4
						flex 
						justify-between
            items-center
					`}
				>
					{/* User */}
          <Link 
            to={`/admin/users/${_id}`}
            onClick={props.closeMenu}
            className={`
              flex 
              items-center 
              text-sm 
              font-medium 
              text-gray-900 
              rounded-full
              md:mr-0
              dark:text-white
              gap-2
            `}
          >
      
            <img
              src={
                props.type === "website" 
                ? `${process.env.REACT_APP_BASE_URL}/profile/${props.picturePath}`
                : props.picturePath
              }
              alt={ props.picturePath }
              className="w-8 h-8 mr-2 rounded-full"
            />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                {props.firstName + " " + props.lastName }
              </p>
              <p className="text-xs text-gray-500 truncate dark:text-gray-400">
                {props.email}
              </p>
            </div>
                        
          </Link>
		                 
          <FontAwesomeIcon
            icon={ faXmark } 
            onClick={ props.closeMenu }
            className={`
              w-7 
              text-black-400
              cursor-pointer
            `}
          />
					
				</div>

        {/* List */}
				<div 
					className={`
						p-4 
						flex-col 
						space-y-4
            mt-8
            border-t 
						border-b
					`}
				>
          <ul             
            className={`
              py-2 
              text-sm 
              text-gray-700 
              dark:text-gray-200
            `}
          >

            <li className={`items-center`}>
              <Link
                to="/"
                onClick={props.closeMenu}
                className={`
                  block 
                  px-4 
                  py-2 
                  hover:bg-gray-100 
                  dark:hover:bg-gray-600 
                  dark:hover:text-white
                `}
              >
                
                <span className=' font-normal '>
                  Settings
                </span>
                
              </Link>
            </li>

          </ul>
          
				</div>

        <div 
          className={`
						p-4 
						flex-col 
						space-y-4
					`}
        >
          <Link
            // to="/logout"
            onClick={ () => logout() }
            className={`
              block 
              px-4 
              py-2 
              text-sm 
              text-gray-700 
              hover:bg-gray-100 
              dark:hover:bg-gray-600 
              dark:text-gray-200 
              dark:hover:text-white
            `}
          >
            Sign out
         </Link>
        </div>
			
			</div>
		</div>    
  )
}

export default User;