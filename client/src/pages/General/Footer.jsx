import React from 'react'

/* -------------------------------------------------------------------------- */
/*                                   Footer                                   */
/* -------------------------------------------------------------------------- */
const Footer = () => {

  /* ---------------------------------- View ---------------------------------- */
  return (
    <section 
      id="footer"
      className={`
        w-full 
        xx:mt-10
        p-4
      text-gray-600             
      dark:text-white
      bg-white
      dark:bg-slate-900
      `}
    >
      <div 
        className={`
          xx:mx-2
          md:container
          md:mx-auto
          space-y-2 
          xx:text-center 
          md:text-start 
          text-xx
        `}
      >
        <h1 className='text-md font-bold'>
          © Copyright 2023
        </h1>
        
        <br />
        
        <h1 className='text-md font-bold'>
          Image Assets
        </h1>

        <a className='text-blue-400' href="http://www.freepik.com">
          Images Designed by vectorjuice / Freepik
        </a>

        <br />

        <a className='text-blue-400' href="https://icons8.com/icon/0yCmzDVSxZ7O/moon-and-stars">
          Moon and Stars
        </a> 
          icon by 
        <a className='text-blue-400' href="https://icons8.com">
          Icons8
        </a>

      </div>
    </section>
  )
}

export default Footer
