import React from 'react'

//* -------------------------------------------------------------------------- */
//*                                   Images                                   */
//* -------------------------------------------------------------------------- */
import mern from './../../img/illustration/mern.jpg';

import { useInView } from 'react-intersection-observer';

//* -------------------------------------------------------------------------- */
//*                                    Mern                                    */
//* -------------------------------------------------------------------------- */
const Mern = () => {

  /* -------------------------------------------------------------------------- */
	/*                                  Wordings                                  */
	/* -------------------------------------------------------------------------- */
  const Title = 'MERN Tech Stack Specialist';
	const Description1 = "I specialize in developing fully functional websites utilizing a robust and widely recognized tech stack.";
	const Description2 = "For the frontend, I predominantly employ React, leveraging various integrations and libraries to enhance the user experience.";
	const Description3 = "On the backend, I have extensive expertise in utilizing Express.js to handle authentication and implement JWT (JSON Web Tokens) for robust user security. Additionally, I incorporate Socket.IO to enable real-time functionality, ensuring dynamic and interactive features for users.";
	const Description4 = "As for the database, I leverage MongoDB to store and manage data efficiently, ensuring a seamless and responsive user experience throughout the entire web application.";

  const { ref, inView } = useInView();

  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <section 
			ref={ ref }
			id="mern"
			className={`
				w-full 
				h-full
				md:flex      
				xx:pt-10
				md:pt-20
				md:pb-36
				dark:bg-slate-900
			`}
		>
			{/* ---------------------------------- Left ---------------------------------- */}
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

				</div>
			</div>      

			{/* ---------------------------------- Right --------------------------------- */}
			<div 
				className={`
					md:w-1/2
					max-auto
				`}
			>
				<img                     
					alt="Flutter"
					src={ mern } 
					className={`
						mx-auto w-10/12
						${inView ? `animate-sr-1000`: `` }
					`}
				/>
			</div>

		</section>
  )
}

export default Mern