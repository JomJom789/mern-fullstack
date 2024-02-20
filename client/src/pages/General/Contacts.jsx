import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGlobe, 
  faMessage, 
  faPhone 
} from '@fortawesome/free-solid-svg-icons';

// Image
// import imgContact from './../../img/illustration/banner-contacts.png';

import { useInView } from 'react-intersection-observer';

// Components
import Email from '../../components/Email'

//* -------------------------------------------------------------------------- */
//*                                  Contacts                                  */
//* -------------------------------------------------------------------------- */
const Contacts = () => {

  const Title = 'Contacts'
  const Description = '"I developed software that helps small businesses in minimum cost with maximum result"'

  const { ref, inView } = useInView();

  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <section 
      ref={ ref }
      id="contacts"
      className={`
        w-full 
        pt-10 
        pb-20 
        bg-gray-50
        dark:bg-slate-800
      `}
    >
      <div 
        className={`
          xx:mx-4
          md:container 
          md:mx-auto 
          object-cover
        `}        
      >
        
        {/* Header */}
        <div className='mt-5'>
          <h1                 
            className={`
              text-center
              text-zinc-700 
              dark:text-white
              xx:text-2xl
              md:text-3xl 
              font-bold
              ${inView ? `animate-sr-200`: `` }
            `}
          >
            { Title }
          </h1>

          <h4               
            className={`
              text-center 
              mt-5
              text-zinc-600 
              dark:text-white
              xx:text-sm
              md:text-md 
              font-bold 
              italic  
              xx:mx-2

              ${inView ? `animate-sr-400`: `` }
            `}
          >
            { Description }
          </h4>
        </div>

        {/* Box */}
        <div 
          className={`
            md:flex 
            bg-white 
            drop-shadow-2xl 
            md:rounded-2xl 
            mt-16

            overflow-hidden
          `}          
        >
          
          {/* Left */}
          <div 
            className={`
              md:w-7/12
              xx:py-1
              md:pl-10
              md:py-10
              
              bg-gradient-to-r
            from-blue-200
            to-cyan-200

              md:rounded-l-2xl
            `}
          >
            <div 
              className={`
                xx:m-5
                md:m-10 
                text-slate-600 
                drop-shadow-md
              `}              
            >
              
              {/* header */}
              <div className=''>
                <h1                    
                  className={`
                    font-bold 
                    mb-5 
                    text-lg

                    xx:text-center
                    md:text-start
                    ${inView ? `animate-st-400`: `` }
                  `}
                >
                  Contact Info
                </h1>
                
                <p                     
                  className={`
                    xx:text-center
                    md:text-start
                    ${inView ? `animate-st-200`: `` }
                  `}
                >
                  Feel free to contact me, Thank You.
                </p>
              </div>

              {/* Info */}
              <div className='mt-10'>
                
                <div                     
                  className={`
                    md:flex
                    xx:text-center
                    md:text-start
                    xx:mt-5
                    md:mt-10
                    xx:gap-3
                    sm:gap-8
                    ${inView ? `animate-sl-1000`: `` }
                  `}
                >
                  
                  <FontAwesomeIcon 
                    icon={ faPhone }
                    className={`
                      mt-1
                    `}
                  /> 

                  <h4 
                    className={`
                      xx:mt-3
                      md:mt-0
                      xx:text-sm
                      md:text-md
                    `}                    
                  >
                    +63 919 8844 655
                  </h4>
                </div>

                <div                     
                  className={`
                    md:flex
                    xx:text-center
                    md:text-start
                    xx:mt-5 
                    md:mt-10
                    xx:gap-3
                    sm:gap-8
                    ${inView ? `animate-sl-400`: `` }
                  `}
                >
                  
                  <FontAwesomeIcon 
                    icon={ faMessage }
                    className="mt-1"
                  /> 

                  <h4 
                    className={`
                      xx:mt-3
                      md:mt-0
                      xx:text-sm
                      md:text-md                                            
                    `}                    
                  >
                    dumaranjomel789@gmail.com
                  </h4>
                </div>

                <div                     
                  className={`
                    md:flex
                    xx:text-center
                    md:text-start
                    xx:mt-5 
                    md:mt-10
                    xx:gap-3
                    sm:gap-8
                    ${inView ? `animate-sl-600`: `` }
                  `}
                >
                  
                  <FontAwesomeIcon 
                    icon={ faGlobe }
                    className="mt-1"
                  /> 

                  <h4 
                    className={`
                      xx:mt-3
                      md:mt-0
                      xx:text-sm
                      md:text-md
                    `}                    
                  >
                    <a href="https://github.com/JomJom789">
                      https://github.com/JomJom789
                    </a>                      
                  </h4>
                </div>

              </div>
            </div>

          </div>

          {/* Right */}
          <div 
            className={`
              md:w-5/12 
              xx:py-1                 
              justify-items-center
              mx-10
            `}
          >
            <Email />
          </div>

        </div>
      
      </div>
    </section>      
  )
}

export default Contacts

