import React from 'react'

/* ------------------------------- Components ------------------------------- */
import SkillsItem from '../../components/Items/SkillsItem';

/* ---------------------------------- Image --------------------------------- */
import skillsFrontend from './../../img/illustration/skills-frontend.png';

/* ---------------------------------- data ---------------------------------- */
import{ frontend }from '../../data/skills';

import { useInView } from 'react-intersection-observer';

/* -------------------------------------------------------------------------- */
/*                               SkillsFrontend                               */
/* -------------------------------------------------------------------------- */
const SkillsFrontend = () => {

	/* ---------------------------------- Text ---------------------------------- */
	const Title = 'Frontend Skills'
	const Description = 'For Website Functionality I use React JS Framework together with Redux for State Management those 2 is completely powerful and light weight.'
			

	const { ref, inView } = useInView();

	/* ---------------------------------- View ---------------------------------- */
	return (
		<section
			ref={ ref }
			id="skills-frontend"
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
			{/* left */}
			<div 
				className={`
					md:w-1/2 
					lg:px-20
				`}
			>
				{/* Title */}
				<div className='mx-5'>
						
					<h1                    
						className={`
							text-start
							text-zinc-700 dark:text-white
							text-3xl 
							font-bold  
							md:mx-5
							mb-5

							${inView ? `animate-st-200`: `` }
						`}
					>
						{ Title }
					</h1>

					<h4                     
						className={`
							text-start
							text-zinc-500
							dark:text-white
							xx:text-xs
							md:text-sm
							font-semibold
							md:font-bold
							md:mx-5

							${inView ? `animate-sr-400`: `` }
						`}
					>
						{ Description }
					</h4>

				</div>

				{/* Skills */}
				<div className='md:my-10' >
					{/* Figma */}
					{frontend.map((item, index) => (
						<SkillsItem 
							key={index}
							bgColor={ item.bgColor }
							img={ item.img }
							title={ item.title }
							textColor= { item.textColor }
							percent={ item.percent }
							progress={ item.progress }
							animateSpeed={ item.id }
							inView={ inView }
							className={``}
						/>
					))}
				</div>
			</div>
				
			{/* Right */}
			<div 
				className={`
					md:w-1/2
					max-auto
				`}
			>
				<img                
					alt='Flutter'
					src={ skillsFrontend } 
					className={`
						mx-auto w-10/12
						${inView ? `animate-sl-1000`: `` }
					`}
				/>
			</div>
		</section>
	)
}

export default SkillsFrontend
