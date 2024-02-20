import React from 'react'

/* -------------------------------------------------------------------------- */
/*                                 Pagination                                 */
/* -------------------------------------------------------------------------- */
const Pagination = ({page, pages, maxPageLimit, minPageLimit, changeCurrentPage, handlePrevPage, handleNextPage, handleFirstPage, handleLastPage}) => {

  /* ---------------------------------- View ---------------------------------- */
  return (
    <div className="flex flex-col items-center mt-20">

      <ul className="inline-flex items-center -space-x-px">
        {
          pages.map((item, index) => (
            item <= maxPageLimit + 1 && item > minPageLimit ? 
              <li 
                key={ item + index }
                onClick={() => changeCurrentPage(index)}
                className={`
                  px-3 py-2 
                  leading-tight 
                  text-gray-500 
                  bg-white border border-gray-300
                  hover:bg-gray-100 hover:text-gray-700 
                  dark:bg-gray-800 dark:border-gray-700 
                  dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white 
                  cursor-pointer
                  ${page === index? `bg-gray-300 text-gray-900 ` : ``}
                `}
              >
                {item}
              </li>
            : <div key={item+index}></div>
          )) 
        }
        
      </ul>
              
      {/* Buttons */}
      <div className="inline-flex mt-5 xs:mt-0">
        <button 
          onClick={handlePrevPage}
          className={`
            inline-flex items-center 
            xx:px-2 xx:py-1 
            md:px-4 md:py-2 
            xx:text-sm xx:font-normal
            md:text-sm md:font-medium
            text-white bg-gray-800 hover:bg-gray-900 
            dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 
            dark:hover:bg-gray-700 dark:hover:text-white 
            border-0 border-r border-gray-700 rounded-l
          `}
        >
          🡸 Prev
        </button>
        
        <button 
          onClick={handleFirstPage}
          className={`
            inline-flex items-center 
            xx:px-2 xx:py-1 
            md:px-4 md:py-2 
            xx:text-sm xx:font-normal
            md:text-sm md:font-medium
            text-white bg-gray-800 hover:bg-gray-900 
            dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 
            dark:hover:bg-gray-700 dark:hover:text-white 
            border-0 border-r border-gray-700
          `}
        >
          First
        </button>
        
        <button 
          onClick={handleLastPage}
          className={`
            inline-flex items-center 
            xx:px-2 xx:py-1 
            md:px-4 md:py-2 
            xx:text-sm xx:font-normal
            md:text-sm md:font-medium
            text-white bg-gray-800 hover:bg-gray-900 
            dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 
            dark:hover:bg-gray-700 dark:hover:text-white 
            border-0 border-r border-gray-700
          `}
        >
          Last
        </button>

        <button
          onClick={handleNextPage}
          className={`
            inline-flex items-center 
            xx:px-2 xx:py-1 
            md:px-4 md:py-2 
            xx:text-sm xx:font-normal
            md:text-sm md:font-medium
            text-white bg-gray-800 hover:bg-gray-900 
            dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 
            dark:hover:bg-gray-700 dark:hover:text-white 
            rounded-r
          `} 
        
        >
          Next 🡺
        </button>
      </div>
      
    </div>
  )
}

export default Pagination;