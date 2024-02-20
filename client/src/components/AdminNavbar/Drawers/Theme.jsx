import React from 'react'

/* ---------------------------------- Icons --------------------------------- */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
// import { BsCheck } from 'react-icons/bs';

/* --------------------------------- Context -------------------------------- */
import { useStateContext } from '../../../contexts/ThemeProvider';

/* ---------------------------------- Data ---------------------------------- */
// import { themeColors } from '../../data/colors';


/* -------------------------------------------------------------------------- */
/*                                    Theme                                   */
/* -------------------------------------------------------------------------- */
const Theme = (props) => {
    
	const { 
		// setColor,
		setMode, 
		currentMode, 
		// currentColor,
	} = useStateContext();

	
	/* ---------------------------------- View ---------------------------------- */
	return (
		<div 
			className={`
        h-full
				pb-20 
        overflow-auto
				dark:text-white
				${currentMode === 'Dark' ? `dark:bg-slate-900` : `bg-white`}         
			`}
		>
			<div 
				className={`
					md:container 
					md:mx-auto
				`}
			>
        
        {/* Header */}
        <div 
					className={`            
            px-4
            py-4
						
            font-medium 
            text-center 
            text-gray-700
            dark:text-white
						bg-slate-50
            dark:bg-slate-800
						drop-shadow-sm
						border-b

            flex 
						justify-between
            items-center
					`}
				>
          <div 
            className={`font-bold`}          
          >
            Theme
          </div>
															                 
          <FontAwesomeIcon                             
            icon={ faXmark } 
            onClick={ props.closeMenu }
            className={`
              w-7 
              text-black-400
            `}
          />
					
				</div>

				{/* List */}
				<div 
					className={`
						p-4 
						flex-col 
						space-y-4 
						border-b
					`}
				>
		
					<p 
						className={` 
							text-base 
							font-semibold 
							text-gray-700 							
							dark:text-white
						`} 
					>
						Mode
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
								text-sm
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
								text-sm
								cursor-pointer
							`}
						>
							Dark
						</label>
					</div>

				</div>

				{/* <div className="p-4 border-b">
		
					<p className={ themeTextHead }>
						Theme Colors
					</p>
					
					<div className="flex gap-3">
						{themeColors.map((item, index) => (
						
							<div
								className="relative mt-2 cursor-pointer flex gap-5 items-center"
								key={item.name}
							>
								<button
									type="button"
									className="h-10 w-10 rounded-full cursor-pointer"
									style={{ backgroundColor: item.color }}
									onClick={() => setColor(item.color)}
								>
									<BsCheck className={`ml-2 text-2xl text-white ${item.color === currentColor ? 'block' : 'hidden'}`} />
								</button>
							</div>
						
						))}
					</div>

				</div> */}
			</div>
		</div>
	)
}

export default Theme;