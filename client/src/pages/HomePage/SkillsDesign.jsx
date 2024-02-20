import React from 'react'

/* ---------------------------------- Image --------------------------------- */
import skillsDesign from './../../img/illustration/skills-design.png';

/* ------------------------------- Components ------------------------------- */
import SkillsItem from '../../components/Items/SkillsItem';

/* --------------------------------- // Data -------------------------------- */
import{ design }from '../../data/skills';

import { useInView } from 'react-intersection-observer';

/* -------------------------------------------------------------------------- */
/*                                SkillsDesign                                */
/* -------------------------------------------------------------------------- */
const SkillsDesign = () => {

	/* ---------------------------------- Text ---------------------------------- */
	const Title = 'Design Skills'
	const Description = 'I use the following tools to develop and design a very competitive and user friendly website.'       

	const { ref, inView } = useInView();

	/* ---------------------------------- View ---------------------------------- */
	return (
		<section
			ref={ ref }
			id="skills-design"
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
			{/* Left */}
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

							${inView ? `animate-sl-400`: `` }
						`}
					>
						{ Description }
					</h4>

				</div>

				{/* Skills */}
				<div className='md:my-10' >
					{/* Figma */}
					{design.map((item, index) => (                    
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
					bg-white 
					dark:bg-slate-900
				`}
			>
				<img                 
					alt="Flutter"
					src={ skillsDesign } 
					className={`
						mx-auto
						${inView ? `animate-sb-1000`: `` }
					`}
				/>
			</div>

		</section>
	)
}

export default SkillsDesign
