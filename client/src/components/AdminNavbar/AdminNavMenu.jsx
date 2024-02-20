import React, {
	useState,
	useEffect,
} from 'react';

/* ------------------------------- Material UI ------------------------------ */
import {
  Avatar
} from '@mui/material';

/* ---------------------------------- Redux --------------------------------- */
import {
	useDispatch,
	useSelector,
} from "react-redux";

import {
  setActiveUsers,
} from '../../state/adminReducer';

/* ---------------------------------- Icons --------------------------------- */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, } from '@fortawesome/free-solid-svg-icons';
import {
	BsMoonStars,
	BsChat,
	BsBell,
	BsPerson,
} from 'react-icons/bs';

/* ------------------------- Animation (Transition) ------------------------- */
import {
	useTransition,
	animated,
} from 'react-spring'

/* ------------------------------- Components ------------------------------- */
import AdminNavMenuItems from './AdminNavMenuItems';

/* ------------------------------ Tabs Content ------------------------------ */
import Theme from './Drawers/Theme';
import Followers from './Drawers/Followers/Followers';
import Chats from './Drawers/Chats/Chats';
import Notifications from './Drawers/Notifications';
import User from './Drawers/User';

/* -------------------------------- Socket IO ------------------------------- */
import io from "socket.io-client";

var socket;

//* -------------------------------------------------------------------------- */
//*                                AdminNavMenu                                */
//* -------------------------------------------------------------------------- */
const AdminNavMenu = () => {
  
	/* -------------------------------------------------------------------------- */
	/*                                    Redux                                   */
	/* -------------------------------------------------------------------------- */
	
	const dispatch = useDispatch();
  // const token = useSelector((state) => state.auth.token);

	// * User
	const { 
		_id, 
		firstName, 
		lastName, 
		email, 
		picturePath,
		type,
		followers,
		// following
	} = useSelector((state) => state.auth.user);

	// * Filter Viewed Followers
	const notificationFollowers = followers.filter(follower => follower.viewed === false);

	// * Log
	// console.log(followers);
	// console.log(following);
	// console.log(notificationFollowers);

	/* -------------------------------------------------------------------------- */
  /*                              Follow Socket.IO                              */
  /* -------------------------------------------------------------------------- */

  // * Socket
  const [socketConnected, setSocketConnected] = useState(false);
  // const [isfollow, setIsFollow] = useState(false);

	// * Notification
  const [followNotification, setFollowNotification] = useState([]);
	const [messageNotification, setMessageNotification] = useState([]);

	// * Log
	// console.log(followNotification);

	/* -------------------------------------------------------------------------- */
	/*                              useEffect Socket                              */
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

		// * Send to active-status
		socket.emit(
			"active-status", // Socket Name
			"login",         // Action
			_id,             // User (My ID)
		);

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

	/* -------------------------------------------------------------------------- */
  /*                          useEffect Socket Received                         */
  /*        Remove the Array bracket "[]" in order to update syncronous         */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {

		/* ---------------- Remove follower from Follow Button Toggle --------------- */
    socket.on("follow-recieved", (action, user) => {
      
			if(action === "unfollow") {
				setFollowNotification(followNotification.filter(e => e !== user));
			} else {
				setFollowNotification([...followNotification, user]);
			}

    });
    
		/* ------------------ Confirm Follower from nav right side ------------------ */
    socket.on("confirm-follow-recieved", (id) => {
			setFollowNotification([...followNotification, id]);
    });

		/* --------------------------- User: Active Status -------------------------- */
    socket.on("active-status-recieved", (action, user) => {
			dispatch(setActiveUsers([user]));
    });

		/* ---------------------------- Message Received ---------------------------- */
    socket.on("message recieved", (newMessageRecieved) => {      
      setMessageNotification([...messageNotification, newMessageRecieved] );
    });

  });

	/* ------------------------------- Menu Toggle ------------------------------ */
	const [showMenu, setShowMenu] = useState(false);
	const [showTheme, setShowTheme] = useState(false);
	const [showFollower, setShowFollower] = useState(false);
	const [showChat, setShowChat] = useState(false);
	const [showNotification, setShowNotification] = useState(false);
	const [showAvatar, setShowAvatar] = useState(false);

	/* ------------------------ Animated Transition Menu ------------------------ */
	const maskTransitions = useTransition(showMenu, {
		from: { position: 'absolute', opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
	})

	const menuTransitions = useTransition(showMenu,  {
		from: { opacity: 0, transform: 'translateX(-100%)' },
		enter: { opacity: 1, transform: 'translateX(0%)' },
		leave: { opacity: 0, transform: 'translateX(-100%)' },
	})

	/* ------------------------ Animated Transition Theme ----------------------- */
	const maskTransitionsTheme = useTransition(showTheme, {
		from: { position: 'absolute', opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
	})

	const menuTransitionsTheme = useTransition(showTheme,  {
		from: { opacity: 0, transform: 'translateX(100%)' },
		enter: { opacity: 1, transform: 'translateX(0%)' },
		leave: { opacity: 0, transform: 'translateX(100%)' },
	})

	/* ---------------------- Animated Transition Follower ---------------------- */
	const maskTransitionsFollower = useTransition(showFollower, {
		from: { position: 'absolute', opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
	})

	const menuTransitionsFollower = useTransition(showFollower,  {
		from: { opacity: 0, transform: 'translateX(100%)' },
		enter: { opacity: 1, transform: 'translateX(0%)' },
		leave: { opacity: 0, transform: 'translateX(100%)' },
	})

	/* ------------------------ Animated Transition Chat ------------------------ */
	const maskTransitionsChat = useTransition(showChat, {
		from: { position: 'absolute', opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
	})

	const menuTransitionsChat = useTransition(showChat,  {
		from: { opacity: 0, transform: 'translateX(100%)' },
		enter: { opacity: 1, transform: 'translateX(0%)' },
		leave: { opacity: 0, transform: 'translateX(100%)' },
	})

	/* -------------------- Animated Transition Notification -------------------- */
	const maskTransitionsNotification = useTransition(showNotification, {
		from: { position: 'absolute', opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
	})

	const menuTransitionsNotification = useTransition(showNotification,  {
		from: { opacity: 0, transform: 'translateX(100%)' },
		enter: { opacity: 1, transform: 'translateX(0%)' },
		leave: { opacity: 0, transform: 'translateX(100%)' },
	})

	/* ------------------------ Animated Transition Avatar ------------------------ */
	const maskTransitionsAvatar = useTransition(showAvatar, {
		from: { position: 'absolute', opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
	})

	const menuTransitionsAvatar = useTransition(showAvatar,  {
		from: { opacity: 0, transform: 'translateX(100%)' },
		enter: { opacity: 1, transform: 'translateX(0%)' },
		leave: { opacity: 0, transform: 'translateX(100%)' },
	})

	/* -------------------------------------------------------------------------- */
	/*                                    View                                    */
	/* -------------------------------------------------------------------------- */
	return (
		<div>
			{/* Nav Icon */}
			<span className="flex gap-5 items-center">

				{/* Theme */}
				<div
					onClick={() => setShowTheme(!showTheme)}
					className={`
						text-slate-600
						dark:text-white
						p-2
						hover:bg-slate-200
						hover:rounded-full
						cursor-pointer
						xx:hidden
						lg:block
					`}
				>
					<BsMoonStars
						className={`
							w-5 
							h-5
						`}
					/>
				</div>

				{/* Follower */}
				<div
					onClick={() => {
						setShowFollower(!showFollower);
						setFollowNotification([]);
					}}
					className={`
						text-slate-600
						dark:text-white
						p-2
						hover:bg-slate-200
						hover:rounded-full
						cursor-pointer
						xx:hidden
						lg:block

						relative 
						inline-block
					`}
				>
					{/* Person Icon */}
					<BsPerson
						className={`
							w-5 
							h-5
						`}
					/>
					
					{/* Notification Badge */}
					{
						notificationFollowers.length === 0
						? followNotification.length === 0 
							?	<></>
							:  <span 
									className={`
										absolute 
										top-0 
										right-0 
										inline-flex 
										items-center 
										justify-center 
										px-2 
										py-1 
										text-xs 
										font-bold 
										leading-none 
										bg-red-600 
										text-red-100 
										transform 
										translate-x-1/2
										-translate-y-1/2
										rounded-full
									`}					
								>
									{ 
										followNotification.length > 10 
										? "9+"
										: followNotification.length
									}
								</span>
						: <span 
								className={`
									absolute 
									top-0 
									right-0 
									inline-flex 
									items-center 
									justify-center 
									px-2 
									py-1 
									text-xs 
									font-bold 
									leading-none 
									text-red-100
									bg-red-600
									transform 
									translate-x-1/2 
									-translate-y-1/2
									rounded-full
								`}					
							>
								{ 
									notificationFollowers.length > 10 
									? "9+"
									: notificationFollowers.length
								}
							</span> 
					}

				</div>

				{/* Chat */}
				<div
					onClick={() => {
						setShowChat(!showChat)
						setMessageNotification([]);
					}}
					className={`
						text-slate-600
						dark:text-white
						p-2
						hover:bg-slate-200
						hover:rounded-full
						cursor-pointer
						xx:hidden
						lg:block

						relative 
						inline-block
					`}
				>

					{/* Chat Icon */}
					<BsChat 
						className={`
							w-5 
							h-5
						`}
					/>

					{/* Notification Badge */}
					{
						messageNotification.length === 0
						? messageNotification.length === 0 
							?	<></>
							:  <span 
									className={`
										absolute 
										top-0 
										right-0 
										inline-flex 
										items-center 
										justify-center 
										px-2 
										py-1 
										text-xs 
										font-bold 
										leading-none 
										bg-red-600 
										text-red-100 
										transform 
										translate-x-1/2
										-translate-y-1/2
										rounded-full
									`}					
								>
									{ 
										messageNotification.length > 10 
										? "9+"
										: messageNotification.length
									}
								</span>
						: <span 
								className={`
									absolute 
									top-0 
									right-0 
									inline-flex 
									items-center 
									justify-center 
									px-2 
									py-1 
									text-xs 
									font-bold 
									leading-none 
									text-red-100
									bg-red-600
									transform 
									translate-x-1/2 
									-translate-y-1/2
									rounded-full
								`}					
							>
								{ 
									messageNotification.length > 10 
									? "9+"
									: messageNotification.length
								}
							</span> 
					}

				</div>

				{/* Notification */}
				<div
					onClick={() => setShowNotification(!showNotification)}
					className={`
						text-slate-600
						dark:text-white
						font-bold
						p-2
						hover:bg-slate-200
						hover:rounded-full
						cursor-pointer
						xx:hidden
						lg:block
					`}
				>
					<BsBell
						className={`
							w-5 
							h-5
						`}
					/>
				</div>

				{/* Avatar */}
				<Avatar 
					alt={picturePath}
					onClick={() => setShowAvatar(!showAvatar)}
					src={
						type === "website"
						? `${process.env.REACT_APP_BASE_URL}/profile/${picturePath}`
						: picturePath
					}
					sx={{ width: 25, height: 25 }}
					className={`
						shadow-lg
						xx:hidden
						lg:block
						cursor-pointer
					`}
				/>

				{/* Menu */}
				<FontAwesomeIcon
					icon={ faBars }
					onClick={() => setShowMenu(!showMenu)}
					className={`
						xx:block
						lg:hidden
						w-10
						cursor-pointer
						z-20
						text-slate-600
						dark:text-white
					`}
				/>

			</span>
				
			{/* ------------------------ Animated Transition Menu ------------------------ */}
			{
				maskTransitions((styles, item, key) =>
					item && 
					<animated.div 
						key={ key } 
						style={ styles }
						onClick={ () => setShowMenu(false) }
						className={`
							fixed 
							top-0 
							left-0 
							w-full
							h-full
							z-50 
							drop-shadow-2xl
						`}
					>
							
					</animated.div>
				)
			}
					
			{
				menuTransitions((styles, item, key) =>
					item && 
					<animated.div 
						key={ key } 
						style={ styles }
						className={`
							fixed 
							top-0 
							left-0 
							w-full 
							h-full 
							z-50 
							drop-shadow-2xl
						`}
					>
						<AdminNavMenuItems closeMenu={ () => setShowMenu(false) } />
					</animated.div>
				)
			}

			{/* ------------------------ Animated Transition Theme ----------------------- */}
			{
				maskTransitionsTheme((styles, item, key) =>
					item && 
					<animated.div 
						key={ key } 
						style={ styles }
						onClick={ () => setShowTheme(false) }
						className={`
								fixed 
								top-0 
								left-0 
								w-full
								h-full 
								z-50
								drop-shadow-2xl
						`}
					>
							
					</animated.div>
				)
			}
					
			{
				menuTransitionsTheme((styles, item, key) =>
					item && 
					<animated.div 
						key={ key } 
						style={ styles }
						className={`
							fixed
							top-0
							right-0
							xx:w-full
							md:w-72
							h-full 
							z-50 
							drop-shadow-2xl
						`}
					>
						<Theme closeMenu={ () => setShowTheme(false) } />
					</animated.div>
				)
			}

			{/* ---------------------------- Animated Follower --------------------------- */}
			{
				maskTransitionsFollower((styles, item, key) =>
					item && 
					<animated.div 
						key={ key } 
						style={ styles }
						onClick={ () => setShowFollower(false) }
						className={`
							fixed 
							top-0 
							left-0 
							w-full
							h-full
							z-50 
							drop-shadow-2xl
						`}
					>
							
					</animated.div>
				)
			}
					
			{
				menuTransitionsFollower((styles, item, key) =>
					item && 
					<animated.div 
						key={ key } 
						style={ styles }
						className={`
							fixed 
							top-0 
							right-0 
							xx:w-full
							md:w-72
							h-full 
							z-50 
							drop-shadow-2xl
						`}
					>
						<Followers closeMenu={ () => setShowFollower(false) } />
					</animated.div>
				)
			}

			{/* ------------------------------ Animated Chat ----------------------------- */}
			{
				maskTransitionsChat((styles, item, key) =>
					item && 
					<animated.div 
						key={ key } 
						style={ styles }
						onClick={ () => setShowChat(false) }
						className={`
							fixed 
							top-0 
							left-0 
							w-full
							h-full
							z-50 
							drop-shadow-2xl
						`}
					>
							
					</animated.div>
				)
			}
					
			{
				menuTransitionsChat((styles, item, key) =>
					item && 
					<animated.div 
						key={ key } 
						style={ styles }
						className={`
							fixed 
							top-0 
							right-0 
							xx:w-full
							md:w-72
							h-full 
							z-50 
							drop-shadow-2xl
						`}
					>
						<Chats closeMenu={ () => setShowChat(false) } />
					</animated.div>
				)
			}

			{/* -------------------------- Animated Notification ------------------------- */}
			{
				maskTransitionsNotification((styles, item, key) =>
					item && 
					<animated.div 
						key={ key } 
						style={ styles }
						onClick={ () => setShowNotification(false) }
						className={`
							fixed 
							top-0 
							left-0 
							w-full
							h-full
							z-50 
							drop-shadow-2xl
						`}
					>
							
					</animated.div>
				)
			}
					
			{
				menuTransitionsNotification((styles, item, key) =>
					item && 
					<animated.div 
						key={ key } 
						style={ styles }
						className={`
							fixed 
							top-0 
							right-0 
							xx:w-full
							md:w-72
							h-full 
							z-50 
							drop-shadow-2xl
						`}
					>
						<Notifications closeMenu={ () => setShowNotification(false) } />
					</animated.div>
				)
			}

			{/* ----------------------------- Animated Avatar ---------------------------- */}
			{
				maskTransitionsAvatar((styles, item, key) =>
					item && 
					<animated.div 
						key={ key } 
						style={ styles }
						onClick={ () => setShowAvatar(false) }
						className={`
							fixed 
							top-0 
							left-0 
							w-full
							h-full
							z-50 
							drop-shadow-2xl
						`}
					>
							
					</animated.div>
				)
			}
					
			{
				menuTransitionsAvatar((styles, item, key) =>
					item && 
					<animated.div 
						key={ key } 
						style={ styles }
						className={`
							fixed 
							top-0 
							right-0 
							xx:w-full
							lg:w-72
							h-full 
							z-50 
							drop-shadow-2xl							
						`}
					>
						<User
							id={ _id } 
							firstName={ firstName } 
							lastName={ lastName } 
							email={ email } 
							picturePath={ picturePath }
							type={ type }
							closeMenu={ () => setShowAvatar(false) } 
						/>
					</animated.div>
				)
			}

		</div>
	);
}

export default AdminNavMenu