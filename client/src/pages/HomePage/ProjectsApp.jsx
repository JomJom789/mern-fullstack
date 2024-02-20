import React from 'react'
import { Link } from "react-router-dom"

/* -------------------------------------------------------------------------- */
/*                                   Images                                   */
/* -------------------------------------------------------------------------- */
import skillsApp from './../../img/illustration/skills-app.png';
import mobileApp from './../../img/illustration/mobile-app.jpg';

/* -------------------------------------------------------------------------- */
/*                                 Observation                                */
/* -------------------------------------------------------------------------- */
import { useInView } from 'react-intersection-observer';

//* -------------------------------------------------------------------------- */
//*                                 ProjectsApp                                */
//* -------------------------------------------------------------------------- */
const ProjectsApp = () => {
    
	/* -------------------------------------------------------------------------- */
	/*                                  Wordings                                  */
	/* -------------------------------------------------------------------------- */
	const Title = 'Mobile App Projects'
	const Description1 = "I used to develop an Android App using Java and Eclipse in Android Studio with MVP or MVVM Architecture from 2015 - 2017. "
	const Description2 = "I Migrate to Kotlin in 2017 but struggle to adapt because of fast and constant update that affect codes."
	const Description3 = "Now in modern technology I use Flutter to develop Android and IOS app together with Dart for Programming Language with SQFLite or ObjectBox as Mobile Database and Bloc State Management to handle large Mobile App Project."
	const Description4 = "I’m well knowledgeable to handle REST API from Online Backend."
	
	const { ref, inView } = useInView();

	/* -------------------------------------------------------------------------- */
	/*                                    View                                    */
	/* -------------------------------------------------------------------------- */
	return (
		<section  
			ref={ ref }
			id="project-app"
			className={`
				w-full 
				md:flex
				dark:bg-slate-900
			`}
		>           
			{/* ---------------------------------- Left ---------------------------------- */}
			<div 
				className={`
					md:w-1/2 
					max-auto
				`}
			>
				<img
					alt="Flutter"
					src={ mobileApp } 
					className={`
						${inView ? `animate-sl-1000`: `` }
					`}
				/>
			</div>

			{/* ---------------------------------- Right --------------------------------- */}
			<div 
				className={`
					md:w-1/2
					md:mt-0 
					md:pt-10
					xl:px-20
					lg:pt-12
					pb-0
				`}
			>
				<div className=''>
					
					<h1
						className={`
							text-start
						text-zinc-700 
							dark:text-white
							xx:text-xl
							md:text-3xl 
							font-extrabold  
							xx:mx-4
							md:mb-16
							xx:text-center
							md:text-start
							${inView ? `animate-st-200`: `` }
						`}
					>
						{ Title }
					</h1>

					<h4
						className={`
							text-start
							mt-5
							text-zinc-500 
							dark:text-white
							xx:text-sm 
							md:text-md 
							xx:font-semibold
							md:font-bold

							xx:mx-4

							${inView ? `animate-sr-400`: `` }
						`}
					>
						{ Description1 }
					</h4>

					<h4                         
						className={`
							text-start
							mt-5
							text-zinc-500 
							dark:text-white
							xx:text-sm 
							md:text-md 
							xx:font-semibold
							md:font-bold

							xx:mx-4

							${inView ? `animate-sr-600`: `` }
						`}
					>
						{ Description2 }
					</h4>

					<h4                         
						className={`
							text-start
							mt-5
							text-zinc-500 
							dark:text-white
							xx:text-sm 
							md:text-md 
							xx:font-semibold
							md:font-bold

							xx:mx-4

							${inView ? `animate-sr-800`: `` }
						`}
					>
						{ Description3 }
					</h4>

					<h4                         
						className={`
							text-start
							mt-5
							text-zinc-500 
							dark:text-white
							xx:text-sm 
							md:text-md 
							xx:font-semibold
							md:font-bold

							xx:mx-4

							${inView ? `animate-sr-1000`: `` }
						`}
					>
						{ Description4 }
					</h4>

					{/* Button */}
					<div
						className={`
							xx:flex
							xx:flex-col
							xx:items-center
							xl:items-end
							
							${inView ? `animate-sb-1200`: `` }
						`}
					>
						<Link 
							to="/projects/app" 
							className={`
								xx:mt-10
								md:mt-24
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

					</div>

				</div>
			</div>

		</section>
	)
}

export default ProjectsApp
