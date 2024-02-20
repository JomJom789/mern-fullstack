import React from 'react'
import { Link } from "react-router-dom"

// Image
import notFound from './../../img/illustration/banner-not-found.png';

/* -------------------------------------------------------------------------- */
/*                               BannerNotFound                               */
/* -------------------------------------------------------------------------- */
const BannerNotFound = () => {

	/* ---------------------------------- View ---------------------------------- */
	return (
		<section 
			className={`
				dark:bg-slate-900
			`}
		>
			<div 
				id='banne-not-found'
				className={`
					container
					mx-auto
					lg:flex
					pt-20
					pb-40
				`}
			>
				{/* Left */}
				<img 
					src={ notFound }
					alt="404 Not Found"
					className='lg:w-1/2'
				/>

				{/* Right */}
				<div 
					className={`
						lg:w-1/2                
						text-center
						lg:mt-10
						mx-2
						md:mx-6
						pt-20
					`}
				>
					<h1 
						className={`
							text-3xl 
							md:text-5xl 
							text-gray-600 
							dark:text-white 
							font-bold text
						`}
					>
						Page doesn't exist please go back to Home Page
					</h1>

					<Link 
						to="/"                               
					>
						<button 
							className={`
								text-2xl 
								text-white 
								font-bold 
								px-6 
								py-2 
								
								bg-gradient-to-r 
								from-pink-400 
								to-blue-400 
								rounded-md
								
								mt-20

								hover:drop-shadow-xl
							`}
						>
							Go To Home Page
						</button>
					</Link>
												
				</div>
				
			</div>
		</section>
	)
}

export default BannerNotFound
