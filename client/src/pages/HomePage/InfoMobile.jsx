import React from 'react'
import { Link } from "react-router-dom"

/* --------------------------------- Images --------------------------------- */
import appFlutter from './../../img/illustration/app-flutter.png';
import bgFlutter from './../../img/illustration/bg-flutter.jpg';

import { useInView } from 'react-intersection-observer';

/* -------------------------------------------------------------------------- */
/*                                Framer Motion                               */
/* -------------------------------------------------------------------------- */
import { motion } from 'framer-motion';
import { 
	staggerContainer, 
	// fadeIn, 
	planetVariants,
	slideIn
} from '../../utils/motion';

//* -------------------------------------------------------------------------- */
//*                                   Mobile                                   */
//* -------------------------------------------------------------------------- */
const Mobile = () => {

	/* -------------------------------------------------------------------------- */
	/*                                    Data                                    */
	/* -------------------------------------------------------------------------- */
	const Title = 'Mobile App Development'
	const Description1 = "I use Flutter mainly for mobile app development because it support Android, IOS and other platform."
	const Description2 = "Flutter is developer and user friendly, it’s way more easy to handle dependencies and packages."
	const Description3 = "I use Bloc State Management because it well organize when it comes in business logic."
	const Description4 = "Dart is the main programming language that support Flutter, it is advance and efficient for developer."

	const { ref, inView } = useInView();

	/* -------------------------------------------------------------------------- */
	/*                                    View                                    */
	/* -------------------------------------------------------------------------- */
	return (
		<section
			ref={ ref }
			id="info-mobile"            
			className={`
				w-full 
				dark:bg-slate-900
				xx:mt-10
			`}
		>                       
			<motion.div     
				variants={staggerContainer}
				initial="hidden"
				whileInView="show"
				viewport={{ once: false, amount: 0.25 }}
				className='md:flex'
			>
				
				{/* ---------------------------------- Left ---------------------------------- */}
				<div 
					className={`
						md:w-1/2 max-auto 
						lg:bg-gradient-to-b 
						lg:from-blue-200 
						lg:to-blue-400 
						lg:py-32
						
						relative
						h-screen 
						flex 
						items-center
					`}
				>
					{/* Background Image */}
    			<img 
						alt="bg-flutter"
						className={`absolute inset-0 w-full h-full bg-cover bg-center`} 
						src={ bgFlutter }
					/>

					<motion.div variants={planetVariants('left')} >
						<motion.img 
							alt="Flutter"
							src={ appFlutter }
						/>
					</motion.div>
				</div>

				{/* ---------------------------------- Right --------------------------------- */}
				<div 
					className={`
						md:w-1/2 
						mt-10 
						md:mt-0 
						lg:pt-10 
						xl:p-20
					`}
				>
					
					{/* Title */}
					<motion.h1
						className={`
							xx:text-center
							md:text-start
							text-zinc-700 
							dark:text-white
							xx:text-lg
							md:text-3xl 
							font-extrabold  
							xx:mx-5
							mb-10
							
							${inView ? `animate-sr-200`: `` }
						`}
					>
						{ Title }
					</motion.h1>

					{/* Description 1 */}
					<motion.h4
						className={`
							xx:text-center
							md:text-start
							mt-5
							text-zinc-500 
							dark:text-white
							xx:text-sm
							md:text-md
							font-bold   

							xx:mx-5
							
							${inView ? `animate-sr-300`: `` }
						`}
					>
						{ Description1 }
					</motion.h4>
					
					{/* Description 2 */}
					<motion.h4
						className={`
							xx:text-center
							md:text-start
							mt-5
							text-zinc-500 
							dark:text-white
							xx:text-sm
							md:text-md
							font-bold   

							xx:mx-5

							${inView ? `animate-sr-400`: `` }
						`}
					>
						{ Description2 }
					</motion.h4>

					{/* Description 3 */}
					<motion.h4
						className={`
							xx:text-center
							md:text-start
							mt-5
							text-zinc-500 
							dark:text-white
							xx:text-sm
							md:text-md
							font-bold   

							xx:mx-5

							${inView ? `animate-sr-500`: `` }
						`}
					>
						{ Description3 }
					</motion.h4>

					{/* Description 4 */}
					<motion.h4
						className={`
							xx:text-center
							md:text-start
							mt-5
							text-zinc-500 
							dark:text-white
							xx:text-sm
							md:text-md 
							font-bold   

							xx:mx-5
							
							${inView ? `animate-sr-600`: `` }
						`}
					>
						{ Description4 }
					</motion.h4>

					{/* Button */}
					<motion.div
						className={`
							xx:flex 
							xx:flex-col 
							xx:items-center
							xl:items-end

							${inView ? `animate-sb-700`: `` }
						`}
					>
						<Link 
							to="/projects/app"
							className={`
								xx:mt-10
								md:mt-20
							`}
						>
							<button 
								className={`
									bg-gradient-to-b 
									from-sky-300
									to-indigo-300

									lg:text-2xl 
									font-bold 
									text-white
									
									px-6 
									py-2
									rounded-md

									hover:drop-shadow-lg
								`}
							>
								Demo Projects
							</button>
						</Link>
					</motion.div>
						
				</div>
			</motion.div>
				
		</section>
	)
}

export default Mobile
