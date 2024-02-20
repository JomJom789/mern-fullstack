import React, { useState } from 'react';

// Components
import NavMenuItems from './HomeNavMenuItems';
import NavTheme from './HomeNavTheme';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

// Animation (Transition)
import { 
    useTransition, 
    animated 
} from 'react-spring'

// Image
import moon from './../../img/moon.png';

/* -------------------------------------------------------------------------- */
/*                                   NavMenu                                  */
/* -------------------------------------------------------------------------- */
function HomeNavMenu() {
      
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
		<div>
			{/* Nav Icon */}
			<span className="flex">
																
				<img            
					src={ moon }
					alt="moon"
					onClick={() => setShowTheme(!showTheme)} 
					className={`
						md:block 
						w-4 lg:w-10 
						cursor-pointer
						z-20

						xx:mr-4
						xx:mt-0
					`}
				/>

				<FontAwesomeIcon                    
					icon={ faBars }
					onClick={() => setShowMenu(!showMenu)}
					className={`
						md:hidden
						w-10
						cursor-pointer
						z-20
						dark:text-white
					`}
				/>
			</span>
			
			{/* Animated Transition Menu */}                 
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
						<NavMenuItems 
							//Pass to NavMenuItems props
							closeMenu={ () => setShowMenu(false) }
						/>
					</animated.div>
				)
			}

			{/* Animated Transition Theme */}                 
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
							left-0 
							w-full 
							h-full 
							z-50
							drop-shadow-2xl
						`}
					>
						<NavTheme 
							//Pass to NavMenuItems props
							closeMenu={ () => setShowTheme(false) } 
						/>
					</animated.div>
				)
			}
		</div>
	);
}

export default HomeNavMenu;
