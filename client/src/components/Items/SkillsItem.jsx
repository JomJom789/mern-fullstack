import React from 'react'

/* -------------------------------------------------------------------------- */
/*                                React Spring                                */
/* -------------------------------------------------------------------------- */
// import {     
//     animated,     
// } from 'react-spring'
// import { 
//     SlideFromLeft,
//     SlideFromRight,
//     SlideFromTop,
//     SlideFromBottom,
//     FadeIn,
//     FadeOut,
// } from '../../animation/customAnimate';

/* -------------------------------------------------------------------------- */
/*                                Framer Motion                               */
/* -------------------------------------------------------------------------- */
import { motion } from 'framer-motion';
import { 
    staggerContainer, 
    // fadeIn, 
    planetVariants,
    slideIn,    
} from '../../utils/motion';

/* -------------------------------------------------------------------------- */
/*                                   Skills                                   */
/* -------------------------------------------------------------------------- */
const Skills = (props) => {
                            
	/* ---------------------------------- View ---------------------------------- */
	return (
		<motion.div
			variants={staggerContainer}
			initial="hidden"
			whileInView="show"
			viewport={{ once: false, amount: 0.25 }}       
			className={`
				mx-10 
				my-5
			`}
		>            
			{/* Image */}            
			<div className='flex'>
				<motion.div
					variants={planetVariants('left')}
					// style={ props.inView ? SlideFromLeft(+speed) : FadeOut(+speed) }
					className={`
						${props.bgColor} 
						md:w-auto 
						md:p-4 
						md:rounded-[30px]
						md:drop-shadow-2xl 
						sm:mt-3
						md:mt-0
					`}
				>
					<img 
						alt={props.alt} 
						src={props.img}
						className={`
							mx-auto 
							xx:w-8
							xx:h-5
							md:w-11 
							md:h-10
						`}
					/>
				</motion.div>
		
				{/* Info */}
				<div 
					className={`
						w-full 
						md:w-10/12 
						ml-10 
					`}
				>
					<div 
						className={`
							flex 
							justify-between 
							mb-5
						`}
					>
						<motion.div
							variants={slideIn('down', 'tween', 0.2, 1)}
							// style={ props.inView ? SlideFromTop(+speed) : FadeOut(+speed) }                            
							className={`
									
							`}
						>
							<h1 
								className={`
									xx:text-xs
									md:text-lg
									font-bold 
									text-gray-500 
									italic 
									dark:text-white
								`}
							>
								{ props.title }
							</h1>
						</motion.div>

						<motion.div
							variants={slideIn('right', 'intertia', 0.2, 1)}
							// style={ props.inView ? SlideFromRight(+speed) : FadeOut(+speed) }
							className={`
									
							`}
						>
							<h1 
								className={`
									xx:text-xs
									md:text-lg
									font-bold 
									${props.textColor}
								`}
							>
								{props.percent}%
							</h1>
						</motion.div>
					</div>

					<div className='w-full'>
						<div 
							className={`
								w-full 
								h-4 
								my-auto 
								bg-gray-200 
								rounded-full 
								dark:bg-white
							`}
						>
							<motion.div
								variants={slideIn('left', 'spring', 0.2, 1)} 
								// style={ props.inView ? SlideFromLeft(+speed) : FadeOut(+speed) }                                
								className={`
									${props.progress}
									h-4 rounded-full
								`}
							>

							</motion.div>                                        
						</div>
					</div>
				</div>
			</div>                      
														
		</motion.div>
	)
}

export default Skills
