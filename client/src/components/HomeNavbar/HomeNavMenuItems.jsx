import React from 'react'
import { Link } from "react-router-dom"

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faComputer, 
    faContactCard, 
    faGlobe, 
    faHome, 
    faMobileScreen, 
    faXmark 
} from '@fortawesome/free-solid-svg-icons';

/* -------------------------------------------------------------------------- */
/*                                NavMenuItems                                */
/* -------------------------------------------------------------------------- */
const HomeNavMenuItems = (props) => {

	const linkBox = 'w-full p-2 border-b hover:border-none flex items-center gap-2 hover:bg-gray-200 hover:dark:bg-slate-700 hover:rounded'
	const icon = 'w-7 text-sky-400 dark:text-white'    
	const linkColor = 'ml-2 text-sky-400 dark:text-white py-3 block font-bold'

	/* ---------------------------------- View ---------------------------------- */
	return (
		<div 
			className={`
				bg-white 
				dark:bg-slate-900
				pt-5 
				pb-20
			`}
		>
			<div 
				className={`
					xx:mx-5
					md:container
					md:mx-auto
				`}
			>                
				<div 
					className={`
						flex 
						justify-between
					`}
				>
					{/* Title */}
					<div className=''>
						<span 
							className={`
								xx:text-lg 
								md:text-2xl 
								font-bold 
								text-sky-400 
								dark:text-white
							`}
						>
							{/* Jomel */}
						</span>
					</div>
					
					{/* Exit Button */}
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
							<div className={ linkColor }  >
								Home
							</div>
						</Link>
					</li>
					
					{/* Skills */}
					<li>                    
						<Link 
							to="/skills" 
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
							to="/projects/website" 
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
							to="/projects/app/" 
							className={ linkBox }
							onClick={ props.closeMenu }
						>
							<FontAwesomeIcon 
								className={ icon }
								icon={ faMobileScreen }
							/>
							<div className={ linkColor }  >
								Mobile Apps
							</div>
						</Link>
					</li>

					{/* Contact */}
					<li>                    
						<Link 
							to="/contacts/" 
							className={ linkBox }
							onClick={props.closeMenu}
						>
							<FontAwesomeIcon 
								className={ icon }
								icon={ faContactCard }
							/>
							<div className={ linkColor }  >
								Contact
							</div>
						</Link>
					</li>

				</ul>
			</div>    
		</div>
	)
}

export default HomeNavMenuItems