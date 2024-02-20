import React, { 
	// useEffect, 
	useState 
} from 'react';

import { Link } from "react-router-dom"

//* -------------------------------------------------------------------------- */
//*                                    State                                   */
//* -------------------------------------------------------------------------- */
import { useGetWebsQuery } from "../../state/apiAdmin";

//* -------------------------------------------------------------------------- */
//*                                 Components                                 */
//* -------------------------------------------------------------------------- */
import ProjectsItem from '../../components/Items/ProjectsItem';
import SkeletonCard from '../../components/Cards/SkeletonCard';

//* -------------------------------------------------------------------------- */
//*                                    Data                                    */
//* -------------------------------------------------------------------------- */
// import{ web }from '../../data/projects';

import { useInView } from 'react-intersection-observer';

//* -------------------------------------------------------------------------- */
//*                                 ProjectsWeb                                */
//* -------------------------------------------------------------------------- */
const ProjectsWeb = () => {

	/* -------------------------------------------------------------------------- */
	/*                                    Hooks                                   */
	/* -------------------------------------------------------------------------- */
	const { ref, inView } = useInView();

	/* -------------------------------------------------------------------------- */
	/*                                  Wordings                                  */
	/* -------------------------------------------------------------------------- */
	const Title = 'Website Projects'
	const Description = '"Here are my latest project from the last 2 years, using React JS as Frontend and Django as Backend"'

	/* -------------------------------------------------------------------------- */
	/*                           RTK Query Data Analysis                          */
	/* -------------------------------------------------------------------------- */
	
	// * Search
	const [search, setSearch] = useState("");

	// * Filter
	const [filter, setFilter] = useState([]);	

	// * Sort
	const [sort, setSort] = useState({field: "title", sort: true});
		
	// * Pagination
	const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
	
	// * useGetWebsQuery
	const { 
		data: rtkData,
		isLoading: rtkIsLoading,
		isSuccess: rtkIsSuccess,
		// error: rtkError,
		// isError: rtkIsError,
		// isFetching: rtkIsFetching,
		refetch
	} = useGetWebsQuery({
    search,
		filter: JSON.stringify(filter),
		sort: JSON.stringify(sort),
		page,
    pageSize,
  });
	
	// * Test Data RTK Query
	// useEffect(() => {
	// 	setSearch("bunker");
	// 	setSort({field: "title", sort: "asc"});
	// 	setPage(6);
	// 	setPageSize(69);
  // }, []); // eslint-disable-line react-hooks/exhaustive-deps
		
	// * Log RTK Query 
	// console.log(rtkData);
	// console.log(rtkError);
	// console.log(rtkIsError);
	// console.log(rtkIsLoading);
	// console.log(rtkIsFetching);
	// console.log(rtkIsSuccess);
		
	// * Log Data Analyst
	// console.log(search);
	// console.log(searchResult);
	// console.log(filter);
	// console.log(sort);
	// console.log("Page: " + page);
	// console.log(pageSize);

	/* -------------------------------------------------------------------------- */
	/*                                    View                                    */
	/* -------------------------------------------------------------------------- */
	return (
		<section 
			ref={ ref }
			id="project-Web"
			className={`
				w-full
				bg-gray-50 
				pt-10 
				pb-14
				dark:bg-slate-800
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

								${inView ? `animate-st-200`: `` }
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

							sm:mx-10

							${inView ? `animate-sr-400`: `` }
						`}
					>
						{ Description }
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
					
					{/* ------------------------------- List Local ------------------------------- */}
					{/* {
						web
						.filter((item, index) => index < 2 )
						.map((item, index) => (
							<ProjectsItem 
								key={item.id}
								id={item.id}
								imgCover={ item.imgCover }
								title={ item.title }
								desciption={ item.desciption }
								project={'website'}
								animateSpeed={ item.id }
								inView={ inView }
								className={``}
							/>
						))
					} */}

					{/* ----------------------------- List RTK Query ----------------------------- */}
					{
						rtkIsLoading 
						?	rtkData !== undefined 
							? rtkData.webs.map((item, index) => ( <SkeletonCard key={index+item._id} /> ))
							: <></>
						:	rtkData !== undefined 
							?	( 
									rtkIsSuccess ?
										rtkData.webs
										.filter((itemFilter, index) => index < 2 )
										.map((item, index) => (
											<ProjectsItem
												key={index+item._id}
												id={item._id}
												imgCover={item.imgCover}
												title={item.title}
												description={item.description}
												animateSpeed={item.id}
												project={"website"}
											/>
										))
									: <></>
								)
							: <></>
					}

				</div>

				{/* -------------------------------- See More -------------------------------- */}
				<div className='mt-14'>             
					<h4                         
						className={`
							text-center mt-5
							text-zinc-600 
							dark:text-white
							xx:text-sm 
							md:text-lg 
							font-bold 
							italic  

							mx-10
							hover:opacity-50

							${inView ? `animate-sb-1000`: `` }
						`}
					>
						<Link to="/projects/website" >
							See More
						</Link>
					</h4>
						
				</div>
			
			</div>
		</section>
	)
}

export default ProjectsWeb
