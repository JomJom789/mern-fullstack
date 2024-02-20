import React from 'react'
import { Link } from "react-router-dom"

import { useInView } from 'react-intersection-observer';

//* -------------------------------------------------------------------------- */
//*                                   Banner                                   */
//* -------------------------------------------------------------------------- */
const Banner = (props) => {
    
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */
  const { ref , inView } = useInView();

  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <section 
      ref={ ref }
      id="banner" 
      className={`
        w-full
        object-cover
        xx:pt-10
        md:pt-20
        md:pb-52
        dark:bg-slate-900        
      `}
    >            
      <div 
        className={`
          lg:flex 
          lg:justify-between
        `}      
      >

        {/* -------------------------------- Left Side ------------------------------- */}
        <div         
          className={`
            mx-auto
            lg:w-1/2 
            lg:ml-16 
            xl:ml-28
            xx:pt-5 
            md:pt-20
          `}
        >
          <h1             
            className={`
              break-words
              xx:text-4xl
              md:text-6xl
              font-bold    
                        
              text-transparent 
              bg-clip-text 
              bg-gradient-to-b 
              from-purple-400 
              to-blue-500
              
              xx:text-center
              lg:text-start    
              
              ${inView ? `animate-st-400`: `` }
            `}
          >
            
            <span>
              {props.header1}
            </span>

            <br/>

            <span className='mt-10'>
              {props.header2}          
            </span>
            
          </h1>
          
          <h4             
            className={`
              xx:text-2xl
              md:text-4xl
              font-bold 
              text-gray-600 
              dark:text-white
              
              xx:mt-10
              md:mt-20

              xx:text-center
              lg:text-start
              
              ${inView ? `animate-sl-600`: `` }
            `}                 
          >
            Frontend & Backend
          </h4>

          <h1             
            className={`
              xx:text-4xl
              md:text-6xl 
              text-sky-400 
              font-extrabold 
              mt-5 

              xx:text-center 
              lg:text-start 

              ${inView ? `animate-sl-800`: `` }
            `}                  
          >
            DEVELOPER
          </h1>

          {props.btn ? 
            <div              
              className={`
                xx:flex 
                xx:flex-col 
                xx:items-center
                lg:items-start
                
                ${inView ? `animate-sb-1000`: `` }
              `}           
            >
              {!!props.url ?  
                <a href={props.url}>
                  <button 
                    className={`
                      text-2xl 
                      text-white 
                      font-bold 
                      px-6 
                      py-2 
                      
                      bg-gradient-to-r 
                      from-pink-400 
                      to-blue-400 
                      rounded-md
                      
                      mt-10

                      hover:drop-shadow-xl
                    `}
                  >
                    { props.btnText }
                  </button>
                </a>
              :
                <Link to="/projects/website" >
                  <button 
                    className={`
                      text-2xl 
                      text-white 
                      font-bold 
                      px-6 
                      py-2 
                      
                      bg-gradient-to-r 
                      from-pink-400 
                      to-blue-400 
                      rounded-md
                      
                      mt-10

                      hover:drop-shadow-xl
                      
                    `} 
                  >
                    { props.btnText }
                  </button>
                </Link>
              }
              
            </div>
          : 
            <div></div>
          }
          
        </div>


        {/* ------------------------------- Right Side ------------------------------- */}
        <div
          className={`
            lg:w-1/2
            xx:mt-20
            lg:mt-0 

            ${inView ? `animate-sr-1000`: `` }
          `}
        >
          <img 
            // src={ props.img }
            // src={`${process.env.REACT_APP_BASE_URL}/${props.project === "app" ? `mobiles`: `websites`}/${props.img}`}
            src={ props.project 
              ? `${process.env.REACT_APP_BASE_URL}/${props.project === "app" ? `mobiles`: `websites`}/${props.img}`
              : props.img
            }
            alt="banner-home"
            className='w-full h-full'
          />
        </div>
      </div>

    </section>
  )
}

export default Banner