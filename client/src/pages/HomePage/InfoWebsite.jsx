import React from 'react'

/* -------------------------------------------------------------------------- */
/*                                   Images                                   */
/* -------------------------------------------------------------------------- */
import webDesign from './../../img/illustration/web-design.png';
import webFrontend from './../../img/illustration/web-frontend.png';
import webBackend from './../../img/illustration/web-backend.png';

/* -------------------------------------------------------------------------- */
/*                                  Observer                                  */
/* -------------------------------------------------------------------------- */
import { useInView } from 'react-intersection-observer';

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
/*                                   Website                                  */
/* -------------------------------------------------------------------------- */
const Website = () => {

	const Title = 'Website Development'
	const Description = '"I’m a Full Stack Developer and Experienced mainly on freelance job."'

	const designTitle = 'Design'
	const designDescription = 'Strong knowledge in HTML and CSS, Tailwind and Material UI as CSS Framework.'

	const frontendTitle = 'Frontend'
	const frontendDescription = 'React JS as Framework together with Redux as State Management or Redux Toolkit Query to handle API request'

	const backendTitle = 'Backend'
	const backendDescription = 'I use Express.js or Django with REST API as Framework to handle request from SQL, MYSQL, PostgreSQL MongoDB as Database. I also use Firebase as NoSQL Database'
	

	const { ref, inView } = useInView();
   
    
	/* ---------------------------------- View ---------------------------------- */
	return (            
		<section 
			ref={ ref }
			id="info-website"            
			className={`
				w-full 
				h-full
				xx:pt-10
				md:pt-20
				md:pb-36
				dark:bg-slate-900
			`}
		>               
			<motion.div  
				variants={staggerContainer}
				initial="hidden"
				whileInView="show"
				viewport={{ once: false, amount: 0.25 }}              
				className={`
					md:container
					md:mx-auto 
					object-cover
				`}
			>
				{/* header */}              
				<div className=''>                    
					<h1                        
						className={`
							text-center 
							text-zinc-700 dark:text-white
							xx:text-xl 
							md:text-3xl 
							font-extrabold
							${inView ? `animate-sr-500`: `` }
						`}
					>
						{ Title }
					</h1>
																
					<h4                              
						className={`
							text-center mt-5
							text-zinc-600 dark:text-white
							xx:text-sm
							md:text-md 
							font-bold 
							italic  
							xx:mx-5
							${inView ? `animate-sr-800`: `` }
						`}
					>
						{ Description }
					</h4>
				</div>

				{/* Body */}
				<div 
					className={`
						md:flex 
						md:justify-evenly 
						md:space-x-4 
																						
						mt-4
					`}
				>
						{/* Design */}
					<motion.div          
						variants={slideIn('up', 'spring', 0.5, 1)}
						className={`
							md:w-3/12
							md:bg-white
							md:dark:bg-slate-700
							lg:p-7
							xx:mt-10
							xx:mx-4

							rounded-xl
							lg:drop-shadow-2xl

							flex-col
						`}
					>   
						<motion.div
							variants={fadeIn('up', 'tween', 0.5, 1.5)}
						>
							<img
								src={webDesign} 
								alt='webDesign'
								className={`
									mx-auto 
									w-40 
									h-40
								`}
							/>
						</motion.div>                        
																							
						<motion.h6
							variants={fadeIn('right', 'tween', 0.5, 3)}
							className={`
								text-center 
								text-gray-700 dark:text-white
								text-xl 
								font-bold 
								mt-2
							`}
						>
							{ designTitle }								
						</motion.h6>

						<motion.p
							variants={fadeIn('up', 'tween', 0.5, 3.5)}
							className={`
								text-center
								text-gray-500 dark:text-white
								xx:text-sm
								md:text-md
								font-semibold
								mt-5

								break-words
							`}
						>
							{designDescription}
						</motion.p>
					</motion.div>
					
					{/* Frontend */}
					<motion.div
						variants={slideIn('up', 'spring', 1, 1)}
						className={`
							md:w-3/12
							md:bg-white
							md:dark:bg-slate-700
							lg:p-7
							xx:mt-10
							xx:mx-4

							rounded-xl 
							lg:drop-shadow-2xl

							flex-col
						`}
					>           
						<motion.div
							variants={fadeIn('up', 'tween', 1, 1.5)}
						>
							<img
								src={ webFrontend }
								alt='webDesign'
								className={`
									mx-auto 
									w-40 
									h-40
								`}
							/>
						</motion.div>
							
						<motion.h6
							variants={fadeIn('right', 'tween', 1, 3)}
							className={`
								text-center 
								text-gray-700 dark:text-white
								text-xl font-bold 
								mt-2
							`}
						>
							{frontendTitle} 
						</motion.h6>

						<motion.p
							variants={fadeIn('up', 'tween', 1, 3.5)}
							className={`
								text-center
								text-gray-500 
								dark:text-white
								xx:text-sm
								md:text-md
								font-semibold
								mt-5

								break-words
							`}
						>
							{ frontendDescription }								
						</motion.p>
					</motion.div>

					{/* Backend */}
					<motion.div
						variants={slideIn('up', 'spring', 2, 1)}
						className={`
							md:w-3/12
							md:bg-white
							md:dark:bg-slate-700
							lg:p-7
							xx:mt-10
							xx:mx-4

							rounded-xl 
							lg:drop-shadow-2xl

							flex-col
						`}
					>
						<motion.div
							variants={fadeIn('up', 'tween', 2, 1.5)}
						>
							<img
								src={ webBackend } 
								alt='webDesign'
								className={`
									mx-auto 
									w-40 
									h-40
								`}
							/>
						</motion.div>
							
						<motion.h6
							variants={fadeIn('right', 'tween', 2, 3)}
							className={`
								text-center 
								text-gray-700 dark:text-white
								text-xl font-bold 
								mt-2									
							`}
						>
							{ backendTitle }
						</motion.h6>

						<motion.p
							variants={fadeIn('up', 'tween', 2, 3.5)}
							className={`
								text-center
								text-gray-500 
								dark:text-white
								xx:text-sm
								md:text-md
								font-semibold
								mt-5

								break-words
							`}
						>
							{ backendDescription }
						</motion.p>

					</motion.div>
						
				</div>
			
			</motion.div>
				
		</section>
	)
}

export default Website

