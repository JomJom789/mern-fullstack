import React from 'react'

// Images
import bannerContact from './../../img/illustration/banner-contacts.png';

import { 
  Banner, 
  Contacts,
  Footer
} from '..'

/* -------------------------------------------------------------------------- */
/*                                ContactsPage                                */
/* -------------------------------------------------------------------------- */
const ContactsPage = () => {

    const header1 = 'GET IN TOUCH'
    const header2 = 'WITH ME'
    const btn = true
    const btnText = 'Visit My GitHub'
    const url = 'https://github.com/JomJom789'

    /* ---------------------------------- View ---------------------------------- */
    return (
      <div 
        className="          
          left-0
          right-0
          bottom-0
          h-full
        "  
      >
        <Banner 
          header1={ header1 }
          header2={ header2 }
          img={ bannerContact }
          btn={ btn }            
          btnText={ btnText }
          url={ url }
        />
                          
        <Contacts />
        <Footer />
      </div>
    )
}

export default ContactsPage
