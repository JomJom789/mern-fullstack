import React from 'react'

import {
  SortOutlined,	
} from '@mui/icons-material';


//* -------------------------------------------------------------------------- */
//*                                    Sort                                    */
//* -------------------------------------------------------------------------- */
const Sort = ({data, sort, setSort}) => {

  /* -------------------------------------------------------------------------- */
  /*                                 handleSort                                 */
  /* -------------------------------------------------------------------------- */
  const handleSort = (item) => {
    // * Replace JSON Data and Sort
    if (item.sort) {
      const newSort = item.sort = false;
      setSort({field: item.name, sort: newSort});
    } else {
      const newSort = item.sort = true;
      setSort({field: item.name, sort: newSort});
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div className={`md:mt-5 w-full`} >
      <span 
        className={`
          xx:w-full 
          text-sm font-medium capitalize
          py-2 rounded-xl mr-8
          dark:text-white
        `}
      >
        <SortOutlined /> Sort
      </span>

      {
        data.map((item, index) => (
          <ul key={item+index} className='inline-block'>
            <li 
              key={item+index}
              onClick={ () => handleSort(item) }
              className={`
                xx:text-xs xx:font-medium
                md:text-sm md:font-medium
                xx:px-4 xx:py-2 xx:mr-3
                md:px-4 md:py-2 md:mr-4
                lg:px-4 lg:py-2 lg:mr-4 lg:mt-4
                xx:mt-4 md:mt-0
                capitalize rounded-xl cursor-pointer
                ${
                  sort.field === item.name 
                  ? `bg-gray-300` 
                  : `bg-gray-100 hover:bg-gray-300 text-gray-800
                `}
              `}
            >
              { item.name } {item.sort ? "▲" : "▼" } 
            </li>
          </ul>
        ))
      }

    </div>
  )
}

export default Sort;