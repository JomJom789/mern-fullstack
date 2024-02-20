import React from 'react'

//* -------------------------------------------------------------------------- */
//*                                 Components                                 */
//* -------------------------------------------------------------------------- */
import ProjectsItem from '../../components/Items/ProjectsItem';

import { useInView } from 'react-intersection-observer';

//* -------------------------------------------------------------------------- */
//*                                  Projects                                  */
//* -------------------------------------------------------------------------- */
const Projects = (props) => {

	/* -------------------------------------------------------------------------- */
	/*                                    Hooks                                   */
	/* -------------------------------------------------------------------------- */
	const { ref, inView } = useInView();

	/* -------------------------------------------------------------------------- */
	/*                            Check if Demo Section                           */
	/* -------------------------------------------------------------------------- */
	
	let bgColor = ''
	let textHeader = ''
	let textDescription = ''
	
	if(props.demo) {
		bgColor = 'bg-white dark:bg-slate-900'
		textHeader = `${props.title} Demo Projects`
		textDescription = '"Feel free to check my Demo Projects"'    
	}else {
		bgColor = 'bg-gray-50 dark:bg-slate-800'
		textHeader = `${props.title} Projects`
		textDescription = '"Here are my latest projects from the last 2 years."'
	}
	
	/* -------------------------------------------------------------------------- */
	/*                                    View                                    */
	/* -------------------------------------------------------------------------- */
	return (
		<section 
			ref={ ref }
			id="projects"
			className={`
				${ bgColor }          
				w-full
				pt-16
				pb-28
			`}
		>
			<div 
				className={`
					md:container 
					md:mx-auto 
					object-cover
				`}
			>

				{/* --------------------------------- Header --------------------------------- */}
				<div className='mt-5'>
					<h1 
						className={`
							text-center 
							text-zinc-700 
							dark:text-white
							xx:text-xl 
							md:text-3xl 
							font-extrabold
						`}                     
					>
						{ textHeader }
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

							sm:mx-10
						`}
					>
						{ textDescription }
					</h4>
				</div>

				{/* ---------------------------------- Body ---------------------------------- */}
				<div 
					className={`
						md:grid
						md:grid-cols-2
						md:justify-evenly 
						gap-2             
						
						xx:mx-3
						
						md:mt-8
						md:m-0
					`}
				>
					{/* Items */}
					{
						// console.log(props.project)

						props.data
						.map((item, index) => ( 
							<ProjectsItem 
								key={ item.id + item.title }
								id={ item._id }
								imgCover={ item.imgCover }
								title={ item.title }
								description={ item.description }
								project={ props.project }
								type={props.project === "app" ? "mobile" : "websites"}
								animateSpeed={ item.id }
								inView={ inView }
								className={``}
							/>
						))
					}

				</div>
							
			</div>
		</section>
	)
}

export default Projects
