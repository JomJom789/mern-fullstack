import React from 'react'
import { Link } from "react-router-dom"
import { useSelector } from "react-redux";


/* -------------------------------------------------------------------------- */
/*                                React Spring                                */
/* -------------------------------------------------------------------------- */
// import {     
//     animated,     
// } from 'react-spring'

// import { 
//     // SlideFromLeft,
//     SlideFromRight,
//     SlideFromTop,
//     // SlideFromBottom,
//     FadeIn,
//     FadeOut,
// } from '../../animation/customAnimate';

/* -------------------------------------------------------------------------- */
/*                                Framer Motion                               */
/* -------------------------------------------------------------------------- */
import { motion } from 'framer-motion';
import { 
    staggerContainer, 
    fadeIn, 
    // planetVariants,
    slideIn
} from '../../utils/motion';

/* -------------------------------------------------------------------------- */
/*                                ProjectItems                                */
/* -------------------------------------------------------------------------- */
const ProjectsItem = (props) => {
  	
	// console.log(props);

	/* ---------------------------------- Redux --------------------------------- */
	const isAuth = Boolean(useSelector((state) => state.auth.token));
                
	/* ---------------------------------- View ---------------------------------- */
	return (
		<motion.div
			key={ props.id + props.title }
			variants={ staggerContainer }
			initial="hidden"
			whileInView="show"
			viewport={{ once: false, amount: 0.25 }}
			className=''
		>
			<motion.div
				variants={ isAuth ? undefined : slideIn('left', 'tween', 0.2, 1) }
				// style={ props.inView ? SlideFromRight(+speed) : FadeOut(+speed) }
				className={`
					bg-white
					dark:bg-slate-700					
					xx:mt-10					
					xx:mx-1										
					flex-col
					relative
					${ 
						isAuth 
						? 'lg:mx-2 bg-white border border-gray-300 rounded-lg'
						: 'lg:mx-12 drop-shadow-2xl' 
					}
				`}
			>        

				{/* Images */}								
				<img
					src={`${process.env.REACT_APP_BASE_URL}/${props.type === "mobile" ? `mobiles`: `websites`}/${props.imgCover}`}
					alt={ props.title }
					className={ 
						isAuth 
						? `mx-auto h-full object-cover rounded-t-lg`
						: `mx-auto h-full object-cover rounded-t-lg`
					}
				/> 
													
				<span 
					className={`
						absolute 
						top-3 
						left-3 
					`}
				>
					<Link 
						to={
							isAuth 
							? props.type === "mobile" 
								? `/admin/mobiles/${props.id}`
								: `/admin/websites/${props.id}`
							: `/projects/${props.project}/${props.id}`
						}
					>
						<motion.button 
							variants={ isAuth ? undefined : fadeIn('left', 'tween', 0.2, 1)}
							// style={ props.inView ? SlideFromTop(+speed) : FadeOut(+speed) }
							className={`
								bg-gradient-to-r 
								from-purple-400 
								to-blue-400     
								xx:text-sm
								md:text-md 
								xx:font-medium
								md:font-bold
								xx:px-2 
								xx:py-1
								md:px-4 
								md:py-2 
								text-white
								rounded-sm
								hover:drop-shadow-md
							`}
						>
							View Project
						</motion.button>
					</Link>
				</span>

				{/* Info */}
				<div className={`px-6 py-5`}>
					<motion.h6 
						// Framer Motion
						variants={ isAuth ? undefined : slideIn('left', 'tween', 0.2, 1)}
						// React Spring
						// style={ props.inView ? SlideFromRight(+speed) : FadeOut(+speed) }
						className={`
							text-center 
							text-gray-700 
							dark:text-white
							xx:text-base 
							md:text-lg 
							font-bold
						`}
					>
						{ props.title }
					</motion.h6>

					<motion.p 
						variants={ isAuth ? undefined : slideIn('left', 'tween', 0.2, 2)}
						// style={ props.inView ? FadeIn(+speed) : FadeOut(+speed) }
						className={`
							text-center
							text-gray-500 dark:text-white
							xx:text-xs
							md:text-sm 
							xx:font-medium
							md:font-semibold
							mt-2

							break-words
						`}
					>
						{ props.description }                    
					</motion.p>
				</div>

			</motion.div>
		</motion.div>
	)
}

export default ProjectsItem
