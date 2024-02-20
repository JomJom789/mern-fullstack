import React from 'react'

// Image
import bannerProject from './../../img/illustration/banner-project.png';

import { 
  Banner,
  SkillsDesign,
  SkillsFrontend,
  SkillsBackend,
  SkillsDatabase,
  SkillsApp,
  Contacts,
  Footer
} from '..'

/* -------------------------------------------------------------------------- */
/*                                   Skills                                   */
/* -------------------------------------------------------------------------- */
const Skills = () => {

  const header1 = 'MY SKILLS';
  const header2 = 'SUMMARY';
  const btn = false;

  /* ---------------------------------- View ---------------------------------- */
  return (
    <div 
      className="        
        bottom-0
        right-0
        lg:left-0
        h-full
      "    
    >
      <Banner 
        header1={ header1 }
        header2={ header2 }
        img={ bannerProject }
        btn={ btn }
      />

      <SkillsDesign />
      <SkillsFrontend />
      <SkillsBackend />
      <SkillsDatabase />
      <SkillsApp />

      <Contacts />
      <Footer />
    </div>
  )
}

export default Skills
