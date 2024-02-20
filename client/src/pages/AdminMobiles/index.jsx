import React, {
	useEffect, 
	useState,
} from 'react';

//* -------------------------------------------------------------------------- */
//*                                    State                                   */
//* -------------------------------------------------------------------------- */
import { useGetMobilesQuery } from "../../state/apiAdmin";

//* -------------------------------------------------------------------------- */
//*                                    Data                                    */
//* -------------------------------------------------------------------------- */
// import { mobileData } from '../../data/data'
import { webFields } from '../../data/web-fields';

//* -------------------------------------------------------------------------- */
//*                                 Components                                 */
//* -------------------------------------------------------------------------- */
import ProjectsItem from '../../components/Items/ProjectsItem';
import CreateMobileModal from '../../components/ModalMobile/CreateMobileModal';
import SkeletonCard from '../../components/Cards/SkeletonCard';

import { 
	Filter,
	Limit,
	Search,
	Sort,
	Pagination,
} from '../../components';

//* -------------------------------------------------------------------------- */
//*                                MUI Material                                */
//* -------------------------------------------------------------------------- */
import { 	
	Button,
	IconButton,
	Snackbar,
	Alert,
} from '@mui/material';

//* -------------------------------------------------------------------------- */
//*                                  MUI Icon                                  */
//* -------------------------------------------------------------------------- */
import {  
	CloseFullscreenOutlined,
} from '@mui/icons-material';

//* -------------------------------------------------------------------------- */
//*                                AdminMobiles                                */
//* -------------------------------------------------------------------------- */
const AdminMobiles = () => {

	/* -------------------------------------------------------------------------- */
	/*                                   Trigges                                  */
	/* -------------------------------------------------------------------------- */
	
	// * Create Triggers
	const [isOpen, setIsOpen] = useState(false);
	const [mobileAdded, setMobileAdded] = useState(false);
	const [reloadFilter, setReloadFilter] = useState(false);

	// * Loading
	// const [isLoading, setIsLoading] = useState(true);

	/* -------------------------------------------------------------------------- */
	/*                           RTK Query Data Analysis                          */
	/* -------------------------------------------------------------------------- */

	// * Search
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);

	// * Filter
	const [filter, setFilter] = useState([]);	

	// * Sort
	const [sort, setSort] = useState({field: "title", sort: true});

	// * Pagination
	const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

	// * useGetMobilesQuery
	const { 
		data: rtkData,
		isLoading: rtkIsLoading,
		isSuccess: rtkIsSuccess,
		// error: rtkError,
		// isError: rtkIsError,
		// isFetching: rtkIsFetching,
		refetch
	} = useGetMobilesQuery({
    search,
		filter: JSON.stringify(filter),		
		sort: JSON.stringify(sort),
		page,
    pageSize,
  });
				
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
	/*                                handleSearch                                */
	/* -------------------------------------------------------------------------- */
	// const handleSearch = async () => {
	// 	try {

	// 		// * Validation
	// 		if (!search) {
	// 			setOpenSnackbar(true);
	// 			setErrorSnackbar("Please Enter something in search");
	// 			return;
	// 		}

	// 		// * Loading
	// 		setIsLoading(true);

	// 		// * Send to Server
	// 		await fetch(`${process.env.REACT_APP_BASE_URL}/mobiles?search=${search}`, {
	// 			method: "GET",
	// 		}).then(function(response) {
	// 			// The response is a Response instance.
	// 			// You parse the data into a useable format using `.json()`
	// 			return response.json();
	// 		}).then(function(data) {

	// 			// `data` is the parsed version of the JSON returned from the above endpoint.
	// 			setIsLoading(false);

	// 			// * set response data to searchResult
	// 			setSearchResult(data.webs);

	// 			// * Log
	// 			// console.log(data);

	// 		});

	// 	} catch (error) {
	// 		setErrorSnackbar(error);
	// 	}
	// };

	/* -------------------------------------------------------------------------- */
	/*                                   Filter                                   */
	/* -------------------------------------------------------------------------- */

	// * Local Storage of Filter (Interact with this not localstorage)
	const [filterStorage, setFilterStorage] = useState([]);
	
	// * handleFilter
	function handleFilter() {

		// Extract the genre & Flatten the array of arrays into a single array [{a,b},{c,d}] => [{a,b,c,d}]
		let extractedFilter = rtkIsSuccess ? rtkData.mobiles.flatMap(item => item.genres) : [];
		
		// Remove duplicates using Set
		extractedFilter = Array.from(new Set(extractedFilter));
		
		// Convert into 2D Array
		const filterResult = extractedFilter.map(item => ({ name: item, filter: false }));

		// Save data to local storage
		try {
			localStorage.setItem('filterMobilesData', JSON.stringify(filterResult));
		} catch(error) {
			console.log(error);
		}
	
		// Load data from local storage on component mount
		const savedData = localStorage.getItem('filterMobilesData');
		
		// If there's a data set that to filterStorage variable
		if (savedData) {
			setFilterStorage(JSON.parse(savedData));
			// console.log(filterStorage);
		}
	}

	/* -------------------------------------------------------------------------- */
	/*                              handleClearSearh                              */
	/* -------------------------------------------------------------------------- */
	const handleClearSearh = () => {
		setSearch("");
		setSearchResult([]);
	}

	/* -------------------------------------------------------------------------- */
	/*                              handleClearFilter                             */
	/* -------------------------------------------------------------------------- */
	const handleClearFilter = () => {
		
		// * Set All Filter into False
		const newData = filterStorage.map((item) => ({ ...item, filter: false }));
    setFilterStorage(newData);

		// * Clear Filter
		setFilter([]);

	}	

	/* -------------------------------------------------------------------------- */
	/*                   Use Effect: Refetch data once added new                  */
	/* -------------------------------------------------------------------------- */
  useEffect(() => {

		// * Refetch
		refetch();

		// * handlleFilter
		handleFilter();

		// * Clean Variable to prevent error
		setSearch("");
		setSearchResult([]);
		setFilter([]);
		setSort({field: "title", sort: true});

		// * Set Page
		setPage(0);
		setPageSize(10);

	}, [mobileAdded]); // eslint-disable-line react-hooks/exhaustive-deps

	/* -------------------------------------------------------------------------- */
	/*                           useEffect Reload Filter                          */
	/* -------------------------------------------------------------------------- */
	
	// * Start with true to initiate the timer
	// const [isTimerActive, setIsTimerActive] = useState(true);

	useEffect(() => {

		// let intervalId;

		// if (isTimerActive && !rtkIsSuccess) {
		// 	intervalId = setInterval(() => {
		// 		// * Loading (Your interval logic here)				

		// 		// * For demonstration purposes, let's log a message
		// 		console.log('Interval is running...');				

		// 	}, 1000); // Change the interval duration as needed
		// } else {
		// 	// * handlleFilter
		// 	handleFilter();
		// }

		// * Clear Filter
		setFilter([]);

		// * handlleFilter
		handleFilter();

		// * Cleanup function to clear the interval when the component unmounts
    // return () => clearInterval(intervalId);

	// }, [websiteAdded, isTimerActive, rtkIsSuccess]); // eslint-disable-line react-hooks/exhaustive-deps
	}, [mobileAdded, reloadFilter]); // eslint-disable-line react-hooks/exhaustive-deps

	/* -------------------------------------------------------------------------- */
	/*                                 Pagination                                 */
	/* -------------------------------------------------------------------------- */
	
	// *
	// const lastIndex = page * pageSize;
	// const firstIndex = lastIndex - pageSize;
	// const currentItems = rtkIsSuccess ? rtkData.webs.slice(firstIndex, lastIndex) : 0;

	// * 
	const totalPages = rtkIsSuccess ?  Math.ceil(rtkData.total / pageSize) : 0;
	const numberPages = [...Array(totalPages + 1).keys()].slice(1);

	// * every Page there's 5 page available
	const [pageNumberLimit, setPageNumberLimit] = useState(5);
	const [minPageLimit, setMinPageLimit] = useState(0);
	const [maxPageLimit, setMaxPageLimit] = useState(5);
		
	// * Pages
	const data = rtkIsSuccess ? rtkData.total : 0;
	const pages = [];
  for (let i = 1; i <= Math.ceil(data/ pageSize); i++) {
    pages.push(i);
  }
	
	/* -------------------------------------------------------------------------- */
	/*                              changeCurrentPage                             */
	/* -------------------------------------------------------------------------- */
	function changeCurrentPage(id) {
		setPage(id);
	}

	/* -------------------------------------------------------------------------- */
	/*                               handlePrevPage                               */
	/* -------------------------------------------------------------------------- */
	function handlePrevPage() {
		if(page <= 0) {
			setPage(0);
			setMinPageLimit(0);
			setMaxPageLimit(5);
		} else {

			if (page % pageSize === 0) {
				if (page === 0) {
					return
				} else {
					setMinPageLimit(minPageLimit - pageSize);
					setMaxPageLimit(maxPageLimit - pageSize);
				}
			}

			setPage(page - 1);
		}
	}
		
	/* -------------------------------------------------------------------------- */
	/*                               handleNextPage                               */
	/* -------------------------------------------------------------------------- */
	function handleNextPage() {
		if (page + 1 >= numberPages.length) {
			return;
		} else {			
			if(page + 1 > maxPageLimit){
				setMinPageLimit(minPageLimit + pageNumberLimit);
				setMaxPageLimit(maxPageLimit + pageNumberLimit);
			}
			setPage(page + 1);
		}		
	}

	/* -------------------------------------------------------------------------- */
	/*                               handleFirstPage                              */
	/* -------------------------------------------------------------------------- */
	function handleFirstPage() {
		setPage(0);
		setMinPageLimit(0);
    setMaxPageLimit(5);
	}

	/* -------------------------------------------------------------------------- */
	/*                               handleLastPage                               */
	/* -------------------------------------------------------------------------- */
	function handleLastPage() {
		
		setMinPageLimit(totalPages - 5);
		setMaxPageLimit(totalPages);
		
		setPage(totalPages-1);

	}

	// * Log
	// console.log("minPageLimit: " + minPageLimit);
	// console.log("maxPageLimit: " + maxPageLimit);
	// console.log("totalPages: " + totalPages);
	// console.log("pages: " + pages);


	/* -------------------------------------------------------------------------- */
	/*                                  SnackBar                                  */
	/* -------------------------------------------------------------------------- */

	// * SnackBar
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [errorSnackbar, setErrorSnackbar] = useState("");

	// * handleClose
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

	// * action
  const action = (
    <React.Fragment>
      
			<Button 
				color="secondary" 
				size="small" 
				onClick={handleClose}
			>
        UNDO
      </Button>

      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseFullscreenOutlined 
					fontSize="small" 
				/>
      </IconButton>

    </React.Fragment>
  );

 	/* -------------------------------------------------------------------------- */
 	/*                                    View                                    */
 	/* -------------------------------------------------------------------------- */
 	return (
		<div
			className={`
				h-full
				xx:p-5
				md:px-14
				py-10
				mt-[70px]
			`}
		>

			{/* ---------------------------------- Modal --------------------------------- */}
			<CreateMobileModal
				isOpen={ isOpen }
				setIsOpen={ setIsOpen }
				actionType={"Add"}
				mobileAdded={mobileAdded}
				setMobileAdded={ setMobileAdded }
			/>

			{/* -------------------------------- SnackBar -------------------------------- */}
			<Snackbar
				open={ openSnackbar }
				autoHideDuration={6000}
				onClose={ handleClose }
				message={ errorSnackbar }
				action={ action }
			>
 				<Alert 
					onClose={ handleClose } 
					severity="error" 
					sx={{ width: '100%' }}
				>
				 	Please Enter Something
        </Alert>
			</Snackbar>

			{/* --------------------------------- Header --------------------------------- */}
			<div 
				className={`
					w-full
					justify-between
					md:flex
				`}
			>
				<h1
					className={`
						xx:text-center
						md:text-start
						xx:text-xl
						md:text-4xl
						font-bold
						text-gray-700
						dark:text-white
					`}
				>
					Mobile List
				</h1>

				{/* Add Website */}
				<button 
					type="button"
					onClick={setIsOpen}
					className={`
						xx:w-full
						md:w-auto

						text-white 
						bg-blue-400
						hover:bg-blue-500
						xx:text-xs
						sm:text-sm 
						font-medium

						rounded-lg
						px-5 
						py-2.5 
						text-center
						items-center
						xx:mt-5
						md:mt-0
					`}
				>  				
  				Add Mobile Project
				</button>
			</div>

			{/* --------------------------------- Search --------------------------------- */}
			<Search 
				search={search}
				setPage={setPage}
				setSearch={setSearch}
				// handleSearch={handleSearch} 	// Search Button Only
			/>
						
			{/* --------------------------------- Filter --------------------------------- */}
			<Filter 
				// * Local (Don't Delete)
				// data={webFields} 		
				data={filterStorage}
				filter={filter}
				setFilter={setFilter}
				handleClearFilter={handleClearFilter}
				reloadFilter={reloadFilter}
				setReloadFilter={setReloadFilter}
			/>
			
			<hr className='mt-5' />

			{/* ---------------------------------- Sort ---------------------------------- */}
			<Sort 
				data={webFields}
				sort={sort}
				setSort={setSort}
			/>
						
			<hr className='mt-5' />
						
			{/* ---------------------------------- Limit --------------------------------- */}
			<Limit 
				setPage={setPage}
				setMinPageLimit={setMinPageLimit}
				setMaxPageLimit={setMaxPageLimit}
				setPageSize={setPageSize}
				handleClearSearh={handleClearSearh}
			/>

			{/* ---------------------------------- List ---------------------------------- */}
			<div
				className={`
					md:grid
					md:grid-cols-2
					xl:grid-cols-3
					md:justify-evenly
					gap-2
				`}
			>				
				{/* RTK Query: Item */}
				{
					rtkIsLoading 
					?	rtkData !== undefined 
						? rtkData.mobiles.map((item, index) => ( <SkeletonCard key={index+item._id} /> ))
						: <></>
					:	rtkData !== undefined 
						?	rtkData.mobiles.map((item, index) => (
								<ProjectsItem
									key={index+item._id}
									id={item._id}
									imgCover={item.imgCover}
									title={item.title}
									description={item.description}
									animateSpeed={item.id}
									type={"mobile"}
								/>
							))
						: <></>
				}

			</div>

			{/* ------------------------------- Pagination ------------------------------- */}
			<Pagination
				page={page}
				pages={pages}
				maxPageLimit={maxPageLimit}
				minPageLimit={minPageLimit}
				changeCurrentPage={changeCurrentPage}
				handlePrevPage={handlePrevPage}
				handleNextPage={handleNextPage}
				handleFirstPage={handleFirstPage}
				handleLastPage={handleLastPage}
			/>
			
		</div>
	)
}

export default AdminMobiles