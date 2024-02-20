import React from 'react'

//* -------------------------------------------------------------------------- */
//*                                  Animation                                 */
//* -------------------------------------------------------------------------- */
import { 
    SlideFromLeft,
    SlideFromRight,
    SlideFromTop,
    SlideFromBottom,
    // FadeIn,
    // FadeOut,
} from './../../animations/customAnimate';

import {     
    animated,     
} from 'react-spring'

//* -------------------------------------------------------------------------- */
//*                               ProjectFeatures                              */
//* -------------------------------------------------------------------------- */
const ProjectFeatures = (props) => {    

	console.log(props)

	/* -------------------------------------------------------------------------- */
	/*                                  Wordings                                  */
	/* -------------------------------------------------------------------------- */
	const Title = 'Features'
	const Description = '"This is the Following Features of the Project"'

	
	/* -------------------------------------------------------------------------- */
	/*                               Animation Speed                              */
	/* -------------------------------------------------------------------------- */
	function speed(sp) {    
		// console.log(sp)
		let speed 
		let animateSpeed = sp
		let speedDefault = '00'

		if (animateSpeed === undefined) {
				animateSpeed = '100'
		} else {
				animateSpeed = animateSpeed.toString()
		}

		// console.log(speed)
		speed = animateSpeed + speedDefault    
		return speed
	}
	
	/* -------------------------------------------------------------------------- */
	/*                                    View                                    */
	/* -------------------------------------------------------------------------- */
	return (
		<section
			id='project-features'
			className={`
				w-full
				md:flex
				pt-16
				pb-52
				bg-white
				dark:bg-slate-900
			`}
		>
			<div 
				className={`
					container
					mx-auto
					object-cover'
				`}
			>
				{/* --------------------------------- header --------------------------------- */}
				<div className=''>
					<animated.h1 
						style={ SlideFromTop(200) }
						className={`
							text-center 
							text-zinc-700 
							dark:text-white
							text-3xl font-bold
						`}
					>
						{ Title }
					</animated.h1>

					<animated.h4 
						style={ SlideFromRight(400) }
						className={`
							text-center mt-5
							text-zinc-600 dark:text-white
							text-md font-bold italic  

							sm:mx-10
						`}
					>
						{ Description }
					</animated.h4>
				</div>

				{/* ---------------------------------- Body ---------------------------------- */}
				<div 
					className={`
						lg:flex 
						lg:justify-evenly 
						lg:space-x-4 
												
						mt-20
					`}
				>
					
					{/* -------------------------------- Feature 1 ------------------------------- */}
					<animated.div 
						style={ SlideFromBottom(200) }
						className={`
							lg:w-3/12 
							bg-gradient-to-b 
							from-green-200
							to-teal-200

							p-7
							sm:mt-10
							
							rounded-xl 
							drop-shadow-2xl

							flex-col
						`}
					>																													
						<animated.h6 
							style={ SlideFromRight(200) }
							className={`
								text-center 
								text-gray-700 
								dark:text-white
								text-xl 
								font-bold
							`}
						>
							Feature 1
						</animated.h6>

						<ul 
							className={`
								text-start
								text-gray-500 dark:text-white
								text-sm font-bold
								mt-5
								space-y-2
								break-words
							`}
						>
							{
								// props.features.map((item, index) => (
								// 	<animated.li
								// 		style={ SlideFromLeft(speed(index+1)) }
								// 		key={index} 
								// 		className={``}
								// 	>
								// 		{ item }
								// 	</animated.li>
								// ))
							}

							<animated.li
								style={ SlideFromLeft(speed(1)) }
								key={"Feature 1"} 
								className={``}
							>
								{ props.features[0] }
							</animated.li>
								
						</ul>

					</animated.div>
					
					{/* -------------------------------- Feature 2 ------------------------------- */}
					<animated.div 
						style={ SlideFromBottom(400) }
						className={`
							lg:w-3/12 
							bg-gradient-to-b 
							from-teal-200
							to-blue-200
							p-7
							sm:mt-10

							rounded-xl 
							drop-shadow-2xl

							flex-col
						`}
					>                             							
						<animated.h6
							style={ SlideFromRight(400) }
							className={`
								text-center 
								text-gray-700 
								dark:text-white
								text-xl font-bold
							`}
						>
							Feature 2
						</animated.h6>

						<ul 
							className={`
								text-start
								text-gray-500 dark:text-white
								text-sm font-bold
								mt-5
								space-y-2
								break-words
							`}
						>
							{
								// props.features.map((item, index) => (
								// 	<animated.li
								// 		style={ SlideFromLeft(speed(index+1)) }
								// 		key={index} 
								// 		className=''
								// 	>
								// 		{ item }
								// 	</animated.li>
								// ))
							}

							<animated.li
								style={ SlideFromLeft(speed(2)) }
								key={"Feature 2"} 
								className=''
							>
								{ props.features[1] }
							</animated.li>

						</ul>

					</animated.div>

					{/* -------------------------------- Feature 3 ------------------------------- */}
					<animated.div 
						style={ SlideFromBottom(600) }
						className={`
							lg:w-3/12 
							bg-gradient-to-b 
							from-blue-200
							to-violet-200                   
							p-7
							sm:mt-10

							rounded-xl 
							drop-shadow-2xl

							flex-col
						`}
					>
						<animated.h6 
							style={ SlideFromRight(600) }
							className={`
								text-center 
								text-gray-700 
								dark:text-white
								text-xl 
								font-bold
							`}
						>
							Feature 3								
						</animated.h6>

						<ul 
							className={`
								text-start
								text-gray-500 dark:text-white
								text-sm font-bold
								mt-5
								space-y-2
								break-words
							`}
						>
							{
								// props.features.map((item, index) => (
								// 	<animated.li 
								// 		style={ SlideFromLeft(speed(index+1)) }
								// 		key={index} 
								// 		className={``}
								// 	>
								// 		{ item }
								// 	</animated.li>
								// ))
							}

							<animated.li
								style={ SlideFromLeft(speed(3)) }
								key={"Feature 3"} 
								className={``}
							>
								{ props.features[2] }
							</animated.li>

						</ul>

					</animated.div>
						
				</div>
			
			</div>
		</section>
	)
}

export default ProjectFeatures
