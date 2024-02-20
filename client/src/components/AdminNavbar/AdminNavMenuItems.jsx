import React, { useState }  from 'react'
import { Link } from "react-router-dom"

/* --------------------------- Icons: Font Awesome -------------------------- */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faComputer, 
    faContactCard, 
    faGlobe, 
    faHome, 
    faMobileScreen, 
    faXmark,    
} from '@fortawesome/free-solid-svg-icons';

/* --------------------------- Icons: React-Icons --------------------------- */
import { BsMoonStars, BsChat, BsBell } from 'react-icons/bs';

/* ------------------------- Animation (Transition) ------------------------- */
import { 
    useTransition, 
    animated 
} from 'react-spring'

/* ------------------------------- Components ------------------------------- */
import AdminNavTheme from './Drawers/Theme';

/* -------------------------------------------------------------------------- */
/*                              AdminNavMenuItems                             */
/* -------------------------------------------------------------------------- */
const AdminNavMenuItems = (props) => {

	/* ---------------------------------- Link ---------------------------------- */
	const linkBox = 'w-full p-2 border-b hover:border-none flex items-center gap-2 hover:bg-gray-200 hover:dark:bg-slate-700 hover:rounded'
	const icon = 'w-7 text-sky-400 dark:text-white'
	const linkColor = 'ml-2 text-sky-400 dark:text-white py-3 block font-bold'

	// Menu Toggle
	const [showMenu, setShowMenu] = useState(false)
	const [showTheme, setShowTheme] = useState(false)

	// Animated Transition Menu
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

	// Animated Transition Theme
	const maskTransitionsTheme = useTransition(showTheme, {
		from: { position: 'absolute', opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
	})

	const menuTransitionsTheme = useTransition(showTheme,  {
		from: { opacity: 0, transform: 'translateX(-100%)' },
		enter: { opacity: 1, transform: 'translateX(0%)' },
		leave: { opacity: 0, transform: 'translateX(-100%)' },
	})

  /* ---------------------------------- View ---------------------------------- */
	return (
		<div 
			className={`
				xx:h-full
				md:h-auto
				bg-white 
				dark:bg-slate-900
				pt-5 
				pb-20
			`}
		>
			<div 
				className={`
					xx:mx-8
					sm:container 
					sm:mx-auto
				`}
			>
													
				{/* ---------------------------------- Menu ---------------------------------- */}
				<div 
					className={`
						flex 
						justify-between
					`}
				>
					
					{/* Logo */}
					<div className=''>
						<span 
							className={`
								xx:text-xs
								xs:text-lg
								md:text-2xl 
								font-bold 
								text-sky-400
								dark:text-white
							`}
						>
							Player ONE
						</span>
					</div>
					
					{/* Exit Icon */}
					<div className=''>                    
						<FontAwesomeIcon                             
							icon={ faXmark } 
							onClick={ props.closeMenu }
							className={`
								w-7 
								text-black-400 
								dark:text-white
							`}
						/>
					</div>

				</div>

				{/* Links */}
				<ul
					id="menu"
					className={`
						items-center 
						p-1 
						space-y-4 
						mt-5
					`}
				>
					{/* Home */}
					<li >                                      
						<Link 
							to="/" 
							className={ linkBox }
							onClick={props.closeMenu}
						>
							<FontAwesomeIcon 
								className={ icon }
								icon={ faHome }
							/>
							<div className={ linkColor } >
								Dashboard
							</div>
						</Link>
					</li>
						
					{/* Skills */}
					<li>                    
						<Link 
							to="/admin/skills"
							className={ linkBox }
							onClick={props.closeMenu}
						>
							<FontAwesomeIcon 
								className={ icon }
								icon={ faComputer }
							/>                        
							<div className={ linkColor }  >
								Skills
							</div>
						</Link>
					</li>
						
					{/* Website */}
					<li>                    
						<Link 
							to="/admin/websites"
							className={ linkBox }
							onClick={props.closeMenu}
						>
							<FontAwesomeIcon 
								className={ icon }
								icon={ faGlobe }
							/>    
							<div className={ linkColor }  >
								Websites
							</div>
						</Link>
					</li>

					{/* Mobile App */}
					<li>                    
						<Link 
							to="/admin/mobiles" 
							className={ linkBox }
							onClick={props.closeMenu}
						>
							<FontAwesomeIcon 
								className={ icon }
								icon={ faMobileScreen }
							/>
							<div className={ linkColor }  >
								Mobiles
							</div>
						</Link>
					</li>

					{/* Contact */}
					<li>                    
						<Link 
								to="/admin/users" 
								className={ linkBox }
								onClick={props.closeMenu}
						>
							<FontAwesomeIcon 
								className={ icon }
								icon={ faContactCard }
							/>
							<div className={ linkColor }  >
								Users
							</div>                        
						</Link>
					</li>

				</ul>

				{/* Nav Icon */}
				<span className="mt-5 flex gap-10 items-center">

					{/* Theme */}
					<BsMoonStars
						// onClick={} 
						onClick={() => setShowTheme(!showTheme)} 
						className={`
							flex-1
							w-5
							h-5
							text-sky-400
							dark:text-white
							cursor-pointer
						`}
					/>

					{/* Chat */}
					<BsChat 
						// onClick={}
						className={`
							flex-1
							w-5
							h-5
							text-sky-400
							dark:text-white
							cursor-pointer
						`}
					/>

					{/* Notification */}
					<BsBell
						// onClick={}
						className={`
							flex-1
							w-5
							h-5
							text-sky-400
							dark:text-white
							cursor-pointer
						`}
					/>

					{/* Avatar */}
					<div className='flex-1' >
						<img 
							alt=""
							// src={}
							className={`                            
								w-8
								h-8
								rounded-full
								bg-slate-400
								cursor-pointer
							`}
						/>
					</div>                    

				</span>

				{/* Animated Menu */}                 
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

				{/* Animated Menu Items */}
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
							<AdminNavMenuItems 
								closeMenu={ () => setShowMenu(false) } //Pass to NavMenuItems props
							/>
						</animated.div>
					)
				}

				{/* Animated Theme */}                 
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

				{/* Theme */}
				{
					menuTransitionsTheme((styles, item, key) =>
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
							<AdminNavTheme 
								closeMenu={ () => setShowTheme(false) } //Pass to AdminNavMenuItems props
							/>
						</animated.div>
					)
				}

			</div>
		</div>
	)
}

export default AdminNavMenuItems