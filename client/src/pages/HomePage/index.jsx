import React from 'react'

/* -------------------------------------------------------------------------- */
/*                                   Images                                   */
/* -------------------------------------------------------------------------- */
import bannerHome from './../../img/illustration/banner-home.png';

/* -------------------------------------------------------------------------- */
/*                                  Sections                                  */
/* -------------------------------------------------------------------------- */
import { 
  Banner,
  Website,
  Mobile,
  SkillsDesign,
  SkillsFrontend,
  SkillsBackend,
  SkillsDatabase,
  SkillsApp,
  ProjectsWeb,
  ProjectsApp,  
  Contacts,
  Footer
} from '..'
import Mern from './Mern';

//* -------------------------------------------------------------------------- */
//*                                  HomePage                                  */
//* -------------------------------------------------------------------------- */
const HomePage = () => {

  /* -------------------------------------------------------------------------- */
  /*                                   Header                                   */
  /* -------------------------------------------------------------------------- */
  const header1 = 'WEBSITE'
  const header2 = 'MOBILE APP'

  /* -------------------------------------------------------------------------- */
  /*                                   Button                                   */
  /* -------------------------------------------------------------------------- */
  const btn = true
  const btnText = 'Visit Projects'
  
  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div 
      className={`
        w-full
        h-full
      `}
    >
      <Banner 
        header1={ header1 }
        header2={ header2 }
        img={ bannerHome }
        btn={ btn }            
        btnText={ btnText }
        project={ "" }
      />
      
      <Website />
      <Mern />
      <Mobile />
      <SkillsDesign />
      <SkillsFrontend />
      <SkillsBackend />
      <SkillsDatabase />
      <SkillsApp />
      <ProjectsWeb />
      <ProjectsApp />
      
      <Contacts />
      <Footer />
    </div>
  )
}

export default HomePage
