import React from 'react'

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

// import { BsCheck } from 'react-icons/bs';

import { useStateContext } from '../../contexts/ThemeProvider';

// import { themeColors } from '../../data/colors';

/* -------------------------------------------------------------------------- */
/*                                  NavTheme                                  */
/* -------------------------------------------------------------------------- */
const HomeNavTheme = (props) => {
    
	const { 
			// setColor,
			setMode, 
			currentMode, 
			// currentColor,
	} = useStateContext();

	const themeTextHead = 'font-semibold text-lg'    

	/* ---------------------------------- View ---------------------------------- */
	return (
		<div 
			className={`
				pt-5 
				pb-20                 
				dark:text-white
				${currentMode === 'Dark' ? `dark:bg-slate-900` : `bg-white`}
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
						
					<div className=''>
						<span 
							className={`
								text-2xl 
								font-bold 
								text-indigo-900 
								dark:text-white
							`}
						>
							{/* Portwind. */}
						</span>
					</div>
					
					<div className=''>                    
						<FontAwesomeIcon
							icon={ faXmark } 
							onClick={ props.closeMenu }
							className={`
								w-7 
								text-black-400
							`}
						/>                                                                      
					</div>

				</div>

				<div 
					className={`
							p-4 
							flex-col 
							space-y-4 
							border-b
					`}
				>
		
					<p className={ themeTextHead } >
						Theme Option
					</p>

					<div className="">
						<input
							type="radio"
							id="light"
							name="theme"
							value="Light"
							onChange={setMode}
							checked={currentMode === 'Light'}
							className={`cursor-pointer`}
						/>
						
						{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
						<label 
							htmlFor="light" 
							className={`
								ml-2 
								text-md 
								cursor-pointer
							`}
						>
							Light
						</label>                        
					</div>
					
					<div className="">
						<input
							type="radio"
							id="dark"
							name="theme"
							value="Dark"
							onChange={setMode}                            
							checked={currentMode === 'Dark'}
							className="cursor-pointer"
						/>

						{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
						<label 
							htmlFor="dark" 
							className={`
								ml-2 
								text-md 
								cursor-pointer
							`}
						>
							Dark
						</label>
					</div>

				</div>

				{/* Theme Color */}
				{/* <div className="p-4 border-b">
		
					<p className={ themeTextHead }>
						Theme Colors
					</p>
					
					<div className="flex gap-3">
						{themeColors.map((item, index) => (
						
							<div
								key={item.name}	
								className={`
									flex 
									relative 
									mt-2
									gap-5 
									items-center
									cursor-pointer 
								`}
							>

								<button
									type="button"
									onClick={() => setColor(item.color)}									
									style={{ backgroundColor: item.color }}
									className={`
										h-10 
										w-10 
										rounded-full 
										cursor-pointer
									`}
								>
									<BsCheck 
										className={`
											ml-2 
											text-2xl 
											text-white 
											${item.color === currentColor ? 'block' : 'hidden'}
										`} 
									/>
								</button>
							</div>
						
						))}
					</div>

				</div> */}

			</div>
		</div>
	)
}

export default HomeNavTheme