import React from 'react'

/* ------------------------------ MUI Material ------------------------------ */
import { 	
	Checkbox,	
} from '@mui/material';

/* -------------------------------- MUI Icon -------------------------------- */
import {  
	FilterAltOutlined,	
} from '@mui/icons-material';

//* -------------------------------------------------------------------------- */
//*                                   Filter                                   */
//* -------------------------------------------------------------------------- */
const Filter = ({data, filter, setFilter, handleClearFilter, reloadFilter, setReloadFilter}) => {

  /* -------------------------------------------------------------------------- */
  /*                                     Log                                    */
  /* -------------------------------------------------------------------------- */
  // console.log(data);
  // console.log(filter);

  /* -------------------------------------------------------------------------- */
  /*                                handleFilter                                */
  /* -------------------------------------------------------------------------- */
  function handleFilter(item) {
    if (item.filter) {
      
      // Find
      const found = filter.find(obj => obj.name === item.name);

      if(found !== undefined) {
        if (found.name === item.name) {
          // Delete
          item.filter = false;
          let newData = filter.filter(data => data.name !== item.name)
          setFilter(newData);
        }
      } else {
        // Insert
        const newFilter = item.filter = false;
        setFilter(prevFilter => [...prevFilter, {name: item.name, filter: newFilter}]);
      }

    } else {

      // Find
      const found = filter.find(obj => obj.name === item.name);

      if (found === undefined) {
        // Insert
        const newFilter = item.filter = true;
        setFilter(prevFilter => [...prevFilter, {name: item.name, filter: newFilter}]);
      } else {
        // Delete
        item.filter = false;
        let newData = filter.filter(data => data.name !== item.name);
        setFilter(newData);
      }

    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div 
      className={`
        md:mt-5
        w-full
        justify-between
        md:flex
      `}
    >												
      <div
        className={`
          xx:w-full
          md:w-5/6
        `}
      >
        <span 
          className={`
            xx:w-full 
            text-sm font-medium capitalize
            py-2 rounded-xl mr-8
            dark:text-white
          `}					
        >
          <FilterAltOutlined /> Filter
        </span>

        {/* ------------------------------- Check Logic ------------------------------ */}
        {						
          data.map((item, index) => (
            <ul 
              key={item+index}
              className='inline-block'
            >
              <li 
                key={item+index}
                onClick={ () => handleFilter(item) }
                className={`
                  bg-gray-100 text-gray-800 
                  xx:text-xs xx:font-medium 
                  md:text-sm md:font-medium 
                  xx:mr-3 md:mr-4 
                  xx:mt-4 xl:mt-4 
                  pr-4
                  capitalize
                  rounded-xl
                `}
              >
                
                {/* Checkbox */}
                <Checkbox 
                  size="small"
                  checked={ item.filter }
                />

                {/* Label */}
                {item.name}

              </li>
            </ul>
            
          ))
        }

        {/* Clear */}
        <button 
          type="button"
          onClick={ handleClearFilter }
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
          Clear Filter
        </button>

        {/* Reload Filter */}
        <button 
          type="button"
          onClick={ () => setReloadFilter(!reloadFilter) }
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
            ml-2
          `}
        >
          Reload Filter
        </button>

      </div>

    </div>
  )
}

export default Filter;