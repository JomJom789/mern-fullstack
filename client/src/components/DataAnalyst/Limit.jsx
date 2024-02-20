import React from 'react'

//* -------------------------------------------------------------------------- */
//*                                     MUI                                    */
//* -------------------------------------------------------------------------- */
import {  
	FormatListNumberedOutlined,	
} from '@mui/icons-material';

//* -------------------------------------------------------------------------- */
//*                                    Limit                                   */
//* -------------------------------------------------------------------------- */
const Limit = ({
  setPage, 
  setMinPageLimit, 
  setMaxPageLimit, 
  setPageSize, 
  handleClearSearh
}) => {
  
  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div 
      className={`
        w-full 
        mt-5 
        items-center
      `}
    >
      
      {/* ---------------------------------- Label --------------------------------- */}
      <span 
        className={`
          text-sm font-medium capitalize
          py-2 rounded-xl mr-7
          dark:text-white
        `}
      >
        <FormatListNumberedOutlined /> Limit
      </span>

      <select
        onChange={(e) => ((
          setPage(0),
          setMinPageLimit(0),
          setMaxPageLimit(5),
          setPageSize(e.target.value)
        ))}
        className={`
        text-slate-700 bg-gray-100 hover:bg-gray-200 
          font-medium rounded-lg text-sm 
          inline-flex text-center items-center 
          px-4 py-2.5
          mr-4 
          capitalize 
        `}
      >	
        {/* <option value="1" className=''>1</option>
        <option value="2" className=''>2</option>
        <option value="3" className=''>3</option>
        <option value="4" className=''>4</option>
        <option value="5" className=''>5</option>
        <option value="6" className=''>6</option>
        <option value="7" className=''>7</option>
        <option value="8" className=''>8</option>
        <option value="9" className=''>9</option> */}

        <option value="10" className=''>10</option>
        <option value="20" className=''>20</option>
        <option value="30" className=''>30</option>
        <option value="40" className=''>40</option>
        <option value="50" className=''>50</option>
        <option value="60" className=''>60</option>
        <option value="70" className=''>70</option>
        <option value="80" className=''>80</option>
        <option value="90" className=''>90</option>
        <option value="100" className=''>100</option>
      </select>

      {/* ---------------------------------- Clear --------------------------------- */}
      <button 
        type="button"
        onClick={ handleClearSearh }
        className={`
          xx:w-full
          sm:w-[30%]
          md:w-[20%]
          text-white dark:text-white
          text-center text-sm 
          
          xx:font-normal md:font-medium
          bg-blue-400 hover:bg-blue-500
          rounded-lg
          px-4 py-2
          xx:mt-5
          xs:mt-0
        `}
      >
        Clear Search
      </button>

    </div>
  )
}

export default Limit;