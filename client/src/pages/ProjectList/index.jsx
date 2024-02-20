import React, { 
	useEffect, 
	useState 
} from 'react';

import { useParams } from 'react-router-dom'

//* -------------------------------------------------------------------------- */
//*                                    State                                   */
//* -------------------------------------------------------------------------- */
import { useGetWebsQuery } from "../../state/apiAdmin";
import { useGetMobilesQuery } from "../../state/apiAdmin";

//* -------------------------------------------------------------------------- */
//*                                    Image                                   */
//* -------------------------------------------------------------------------- */
import bannerWeb from './../../img/illustration/banner-web.png';
import bannerApp from './../../img/illustration/banner-app.png';

//* -------------------------------------------------------------------------- */
//*                                    Data                                    */
//* -------------------------------------------------------------------------- */
import{ 
  web,
  app,
} from '../../data/projects';

import { 
  Banner,  
  Projects,
  Contacts,
  Footer
} from '..'

//* -------------------------------------------------------------------------- */
//*                                 ProjectList                                */
//* -------------------------------------------------------------------------- */
const ProjectList = () => {

  /* -------------------------------------------------------------------------- */
  /*                                    Param                                   */
  /* -------------------------------------------------------------------------- */
  const { project } = useParams();

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
		data: rtkDataWeb,
		isLoading: rtkIsLoadingWeb,
		isSuccess: rtkIsSuccessWeb,
		// error: rtkErrorWeb,
		// isError: rtkIsErrorWeb,
		// isFetching: rtkIsFetchingWeb,
		refetch: refetchWeb
	} = useGetWebsQuery({
    search,
		filter: JSON.stringify(filter),
		sort: JSON.stringify(sort),
		page,
    pageSize,
  });
	
  /* -------------------------------------------------------------------------- */
  /*                             useGetMobilesQuery                             */
  /* -------------------------------------------------------------------------- */
	const { 
		data: rtkDataMobile,
		isLoading: rtkIsLoadingMobile,
		isSuccess: rtkIsSuccessMobile,
		// error: rtkErrorMobile,
		// isError: rtkIsErrorMobile,
		// isFetching: rtkIsFetchingMobile,
		refetch: refetchMobile
	} = useGetMobilesQuery({
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
	// console.log(rtkDataMobile);
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
  /*                                Page Wordings                               */
  /* -------------------------------------------------------------------------- */
  // * True if Website, false if App
  let projectBool = true;
  
  // * Projects Section
  let content;
  let title;
  let projectList;
  
  /* -------------------------------------------------------------------------- */
  /*                                Web/App Pages                               */
  /* -------------------------------------------------------------------------- */
  if(project === 'website'){
    content = 'WEB';
    projectBool = true;
    projectList = rtkIsSuccessWeb ? rtkDataWeb.webs : [];
    title = 'Website';
  } else if(project === 'app'){
    content = 'APP';
    projectBool = false;
    projectList = rtkIsSuccessMobile ? rtkDataMobile.mobiles : [];
    title = 'Moblie App';
  } else {
    content = '404 not found';
  }

  /* -------------------------------------------------------------------------- */
  /*                        Filter Data Base on category                        */
  /* -------------------------------------------------------------------------- */
  let projectClient = projectList.filter(data => data.category === 'client')
  let projectDemo = projectList.filter(data => data.category === 'demo')
  
  /* -------------------------------------------------------------------------- */
  /*                      Check if project Client has value                     */
  /* -------------------------------------------------------------------------- */
  let hasClient

  if(projectClient.length === 0) {
    hasClient = false
  } else {
    hasClient = true
  }

  /* -------------------------------------------------------------------------- */
  /*                       Check if project Demo has value                      */
  /* -------------------------------------------------------------------------- */
  let hasDemo
  if(projectDemo.length === 0) {
    hasDemo = false
  } else {
    hasDemo = true
  }

  /* -------------------------------------------------------------------------- */
  /*                               Banner Section                               */
  /* -------------------------------------------------------------------------- */
  const header1 = 'MY HUMBLE';
  let header2 = `${content} PROJECTS`;
  let btn = false;

  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (    
    <div 
      className={`
        left-0
        right-0
        bottom-0
        h-full
      `}
    >
      <Banner 
        header1={ header1 }
        header2={ header2 }
        img={ projectBool? bannerWeb : bannerApp }
        btn={ btn }
      />
      
      {/* ---------------------------- Clients Projects ---------------------------- */}
      {
        hasClient 
        ? <Projects 
            data={ projectClient }
            demo={ false }
            title={ title }
            project={ project }
          />
        : <div></div>
      }
      
      {/* ------------------------------ Demo Projects ----------------------------- */}
      {
        hasDemo 
        ? <Projects 
            data={ projectDemo }
            demo={ true }
            title={ title }
            project={ project }
          />
        : <div></div>
      }
      
      <Contacts />
      <Footer />
    </div>
  )
}

export default ProjectList
