import React, { 
	useEffect, 
	useState 
} from 'react';

import { useParams } from 'react-router-dom'

//* -------------------------------------------------------------------------- */
//*                                 Data Local                                 */
//* -------------------------------------------------------------------------- */
import{ 
  web,
  app,
} from '../../data/projects';

//* -------------------------------------------------------------------------- */
//*                                 Components                                 */
//* -------------------------------------------------------------------------- */
import { 
  Banner,
  ProjectPhotos,
  ProjectFeatures,

  Contacts,
  Footer
} from '..'

//* -------------------------------------------------------------------------- */
//*                             ProjectDetailsPage                             */
//* -------------------------------------------------------------------------- */
const ProjectDetailsPage = () => {

  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */
  const { project, id } = useParams()

  /* -------------------------------------------------------------------------- */
  /*                                    Data                                    */
  /* -------------------------------------------------------------------------- */  
  const [projectList, setProjectList] = useState([]);

  /* -------------------------------------------------------------------------- */
  /*                                Get Websites                                */
  /* -------------------------------------------------------------------------- */
  const getWebById = async () => {

    // * Loading
    // setIsLoading(true);

    // * Fetch
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/webs/${id}`, {
      method: "GET",
    });

    // * Response
    const data = await response.json();

    // * Log
    // console.log(data);

    // * Set to local var
    // setDataWebsites(data);

    // * Set to projectList
    setProjectList(data.filter(data => data._id === id));
    
    // * Loading
    // setIsLoading(false);

  };

  /* -------------------------------------------------------------------------- */
  /*                                 Get Mobiles                                */
  /* -------------------------------------------------------------------------- */
  const getMobileById = async () => {
    
    // * Loading
    // setIsLoading(true);

    // * Fetch
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/mobiles/${id}`, {
      method: "GET",
    });

    // * Response
    const data = await response.json();

    // * Log
    // console.log(data);
    
    // * Set to projectList
    setProjectList(data.filter(data => data._id === id));
    
    // * Loading
    // setIsLoading(false);

  };

  /* -------------------------------------------------------------------------- */
  /*                                 Use Effect                                 */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {

    if(project === 'website'){
      getWebById();
    } else {
      getMobileById();
    }
    
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* -------------------------------------------------------------------------- */
  /*                                   Banner                                   */
  /* -------------------------------------------------------------------------- */
  let btnText = "Visit Project";
  let content;

  /* -------------------------------------------------------------------------- */
  /*                                   Compare                                  */
  /* -------------------------------------------------------------------------- */
  if(project === 'website'){
    content = 'WEB';
    btnText = "Visit Website";
  }else if(project === 'app'){
    content = 'APP';
    btnText = "Visit GitHub";
  }else {
    content = '404 not found';
  }
    
  /* -------------------------------------------------------------------------- */
  /*                                   Banner                                   */
  /* -------------------------------------------------------------------------- */
  const header1 = 'MY HUMBLE';
  let header2 = `${content} PROJECTS`;
  let btn = true;  

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

      {/* ---------------------------------- List ---------------------------------- */}
      {/* {console.log(projectList)} */}

      {
        projectList.map((item, index) => (
          <div key={index}>
            
            {/* Banner */}
            <Banner 
              header1={ header1 }
              header2={ header2 }
              img={ item.imgCover }
              project={ project }
              btn={ btn }
              btnText={ 
                item.category === 'demo'
                ? 'Visit GitHub' 
                : btnText 
              }
              url={ item.url }
            />

            {/* Photo */}
            <ProjectPhotos
              title={ item.title }
              imgCover={ item.imgCover }
              imgs={ item.images }
              project={ project }
              animateSpeed={ item.id }
            />

            {/*  Features */}
            {
              item.type === 'static' 
              ? <div></div> 
              : <ProjectFeatures features={ item.features } />
            }

          </div>
        ))
      }

      {/* --------------------------------- Footing -------------------------------- */}
      <Contacts />
      <Footer />

    </div>
  )
}

export default ProjectDetailsPage
