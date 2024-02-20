import React, {
	useEffect, 
	useState 
} from 'react';

/* --------------------------- Redux Query Toolkit -------------------------- */
import { useGetUsersQuery } from "../../state/apiAdmin";

/* ---------------------------------- Data ---------------------------------- */
// import { usersData } from '../../data/data';
import { userFields } from '../../data/user-fields';

/* ---------------------------------- Redux --------------------------------- */
import {
	useDispatch,
  useSelector,
} from "react-redux";

import {
  setChats,
  setSelectedChat,
  setIsChatOpen
} from '../../state/adminReducer';

/* ------------------------------- Material UI ------------------------------ */
import { 
  // Box,
  Button,
	IconButton,
  Snackbar,
	Alert,
} from '@mui/material';

/* -------------------------------- MUI Icon -------------------------------- */
import { 
  // ListOutlined,
  CloseFullscreenOutlined,
} from '@mui/icons-material';

/* ------------------------- Animation (Transition) ------------------------- */
import {
	useTransition,
	animated,
} from 'react-spring'

/* ------------------------------- Components ------------------------------- */
import UserCard from '../../components/Cards/UserCard';
import SkeletonCard from '../../components/Cards/SkeletonCard';
// import ChatsView from './Drawers/Chats/Chats';
import ChatsView from '../../components/AdminNavbar/Drawers/Chats/Chats';

/* ------------------------- Data Analyst Component ------------------------- */
import { 
	// Filter,
	Limit,
	Search,
	Sort,
	Pagination,
} from '../../components';

//* -------------------------------------------------------------------------- */
//*                                AdminAccounts                               */
//* -------------------------------------------------------------------------- */
const AdminUsers = () => {
  
	/* -------------------------------------------------------------------------- */
	/*                                   Loading                                  */
	/* -------------------------------------------------------------------------- */
  // const [isLoading, setIsLoading] = useState(true);

	/* -------------------------------------------------------------------------- */
  /*                             Redux State Reducer                            */
  /* -------------------------------------------------------------------------- */
  
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

	// * Reducer
  const {
    _id,
    followers,
    following,
  } = useSelector((state) => state.auth.user);

	// * Admin Reducer
  const chats = useSelector((state) => state.admin.chats);
  // const selectedChat = useSelector((state) => state.admin.selectedChat);
  // const activeUsers = useSelector((state) => state.admin.activeUsers);

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

	// * useGetUsersQuery
	const { 
		data: rtkData,
		isLoading: rtkIsLoading,
		// error: rtkError,
		// isError: rtkIsError,
		// isFetching: rtkIsFetching,
		isSuccess: rtkIsSuccess,
		refetch
	} = useGetUsersQuery({
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
	/*                                   Refetch                                  */
	/* -------------------------------------------------------------------------- */
	// * Use Effect: Refetch data once added new
  useEffect(() => {
		refetch();
		
		// Clean Variable to prevent error
		setSearch("");
		setSearchResult([]);
		setFilter([]);
		setSort({field: "title", sort: true});

		setPage(0);
		setPageSize(10);

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

	/* -------------------------------------------------------------------------- */
	/*                                Handle Search                               */
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
	// 		await fetch(`${process.env.REACT_APP_BASE_URL}/users?search=${search}`, {
	// 			method: "GET",
	// 		}).then(function(response) {
	// 			// The response is a Response instance.
	// 			// You parse the data into a useable format using `.json()`
	// 			return response.json();
	// 		}).then(function(data) {
	// 			// `data` is the parsed version of the JSON returned from the above endpoint.

	// 			// * Loading
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
	/*                              Handle Clear Searh                            */
	/* -------------------------------------------------------------------------- */
	const handleClearSearh = () => {
		setSearch("");
		setSearchResult([]);
	}

	/* -------------------------------------------------------------------------- */
	/*                              Handle Clear Filter                           */
	/* -------------------------------------------------------------------------- */
	// const handleClearFilter = () => {
	// 	setFilter([]);
	// }	

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
	
	// * changeCurrentPage
	function changeCurrentPage(id) {
		setPage(id);
	}

	// * handlePrevPage
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
		
	// * handleNextPage
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

	// * handleFirstPage
	function handleFirstPage() {
		setPage(0);
		setMinPageLimit(0);
    setMaxPageLimit(5);
	}

	// * handleLastPage
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
  /*                           useEffect Update Socket                          */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    
    refetch();

    // eslint-disable-next-line
  }, [ followers, following ]);

	/* -------------------------------------------------------------------------- */
  /*                                 accessChat                                 */
  /* -------------------------------------------------------------------------- */
  const accessChat = async (userId) => {
    try {

			setShowChat(!showChat)

      // * Log
      // console.log("My ID: " + _id);
      // console.log("US ID: " + userId);

      // * Fetch
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/chat/user/${_id}/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // * Response
      const data = await response.json();

      // * Log
      // console.log(data);

      // * Get data if it's equal to chat.id
      if (!chats.find((c) => c._id === data._id)) {
        dispatch(setChats([data, ...chats]));
      }

      // * set selected Chat
      dispatch(setSelectedChat(data));
      dispatch(setIsChatOpen(true));

    } catch (error) {
      setOpenSnackbar(true);
      setErrorSnackbar("Please Enter something in search");
    }
  };

	/* -------------------------------------------------------------------------- */
	/*                                  Snack Bar                                 */
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
	/*                                 Menu Toggle                                */
	/* -------------------------------------------------------------------------- */
	const [showChat, setShowChat] = useState(false);
	
	/* -------------------------------------------------------------------------- */
	/*                          Animated Transition Chat                          */
	/* -------------------------------------------------------------------------- */
	const maskTransitionsChat = useTransition(showChat, {
		from: { position: 'absolute', opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
	})

	const menuTransitionsChat = useTransition(showChat,  {
		from: { opacity: 0, transform: 'translateX(100%)' },
		enter: { opacity: 1, transform: 'translateX(0%)' },
		leave: { opacity: 0, transform: 'translateX(100%)' },
	})

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

			{/* ------------------------------ Animated Chat ----------------------------- */}
			{
				maskTransitionsChat((styles, item, key) =>
					item && 
					<animated.div 
						key={ key } 
						style={ styles }
						onClick={ () => setShowChat(false) }
						className={`
							fixed 
							top-0 
							left-0 
							w-full
							h-full
							z-50 
							drop-shadow-2xl
						`}
					>
							
					</animated.div>
				)
			}
					
			{
				menuTransitionsChat((styles, item, key) =>
					item && 
					<animated.div 
						key={ key } 
						style={ styles }
						className={`
							fixed 
							top-0 
							right-0 
							xx:w-full
							md:w-72
							h-full 
							z-50 
							drop-shadow-2xl
						`}
					>
						<ChatsView closeMenu={ () => setShowChat(false) } />
					</animated.div>
				)
			}

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
					Users List
				</h1>

				{/* View */}
				{/* 
				<button 
					type="button"
					// onClick={setIsOpen}
					className={`
						xx:w-full
						md:w-auto
						
						hover:bg-gray-50
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
          <ListOutlined />
				</button>
				*/}

			</div>

      {/* --------------------------------- Search --------------------------------- */}
			<Search 
				search={search}
				setPage={setPage}
				setSearch={setSearch}
				// handleSearch={handleSearch}
			/>
						
			{/* --------------------------------- Filter --------------------------------- */}
			{/* <Filter 
				data={userFields}
				filter={filter}
				setFilter={setFilter}
				handleClearFilter={handleClearFilter}
			/> */}
			
			{/* <hr className='mt-5' /> */}

			{/* ---------------------------------- Sort ---------------------------------- */}
			<Sort 
				data={userFields}
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
						? rtkData.users.map((item, index) => ( <SkeletonCard key={index+item._id} /> ))
						: <></>
					:	rtkData !== undefined 
						?	rtkData.users.map((item, index) =>
                <UserCard 
                  key={index}
                  id={item._id}
                  firstName={item.firstName}
                  lastName={item.lastName}
                  email={item.email}
                  profilePic={item.picturePath}
									type={item.type}
									active={item.activeStatus}
									userFollowers={item.followers}
									userFollowing={item.following}
									accessChat={accessChat}
									refetch={refetch}
                />
							)
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

export default AdminUsers;