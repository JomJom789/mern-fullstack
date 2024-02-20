import React, {
  useState,
  useEffect,
} from 'react'

/* --------------------------- Redux Query Toolkit -------------------------- */
import { useGetUsersContactsQuery } from '../../../../../state/apiAdmin';

/* ---------------------------------- Redux --------------------------------- */
import {
	useDispatch,
  useSelector,
} from "react-redux";

import {
  setChats,
  setSelectedChat
} from '../../../../../state/adminReducer';

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

/* ------------------------------- Components ------------------------------- */
import SearchUser from './SearchUser';
import FetchContacts from './FetchContacts';

/* -------------------------------------------------------------------------- */
/*                                  Contacts                                  */
/* -------------------------------------------------------------------------- */
const ListContacts = () => {

  /* -------------------------------------------------------------------------- */
  /*                                   Trigges                                  */
  /* -------------------------------------------------------------------------- */
  const [isLoading, setIsLoading] = useState(true);  
  const [refresh, setRefresh] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                             Redux State Reducer                            */
  /* -------------------------------------------------------------------------- */

  const dispatch = useDispatch();

  // * Auth Reducer
  const token = useSelector((state) => state.auth.token);
  const {
    _id,
    // followers,
    following,
  } = useSelector((state) => state.auth.user);

  // * Admin Reducer
  const chats = useSelector((state) => state.admin.chats);
  const selectedChat = useSelector((state) => state.admin.selectedChat);
  const activeUsers = useSelector((state) => state.admin.activeUsers);

  // * Log
  // console.log(chats);
  // console.log(selectedChat);

  /* -------------------------------------------------------------------------- */
  /*                        RTK useGetUsersContactsQuery                        */
  /* -------------------------------------------------------------------------- */

  // * Search
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);

	// * Filter
	const [filter, setFilter] = useState([]);	

	// * Sort
	const [sort, setSort] = useState({field: "title", sort: true});

	// * useGetUsersContactsQuery
	const { 
		data: rtkData,
		isLoading: rtkIsLoading,
		// error: rtkError,
		// isError: rtkIsError,
		// isFetching: rtkIsFetching,
		// isSuccess: rtkIsSuccess,
		refetch
	} = useGetUsersContactsQuery({
    search,
		filter: JSON.stringify(following),
		sort: JSON.stringify(sort),
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

  /* -------------------------------------------------------------------------- */
	/*                                   Refetch                                  */
	/* -------------------------------------------------------------------------- */
  useEffect(() => {    
    refetch();
  }, [refresh, activeUsers]); // eslint-disable-line react-hooks/exhaustive-deps

  /* -------------------------------------------------------------------------- */
  /*                                 accessChat                                 */
  /* -------------------------------------------------------------------------- */
  const accessChat = async (userId) => {
    try {

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

    } catch (error) {
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
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div 
      className={`
        mt-14
      `}
    >

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

      {/* ------------------------------- Search User ------------------------------ */}
      <SearchUser
        search={search}
        setSearch={setSearch}
      />

      {/* ----------------------------- Fetch Contacts ----------------------------- */}
      <FetchContacts 
        rtkData={rtkData} 
        rtkIsLoading={rtkIsLoading} 
        accessChat={accessChat}
        onClick={ () => {
          setRefresh(!refresh)
        }}
      />

    </div>
  )
}

export default ListContacts;