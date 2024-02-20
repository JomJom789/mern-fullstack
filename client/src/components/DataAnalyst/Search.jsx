import React from 'react'

//* -------------------------------------------------------------------------- */
//*                                   Search                                   */
//* -------------------------------------------------------------------------- */
const Search = ({
  search, 
  setPage, 
  setSearch, 
  // handleSearch
}) => {

  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (    
    <form className='mt-10 flex'>

      {/* ---------------------------------- Input --------------------------------- */}
      <input 
        required 
        type="search" 
        id="web-search"
        placeholder={`Search Website`}
        value={search}
        onChange={(e) => ((
          setPage(0),
          setSearch(e.target.value)
        ))}
        className={`
          w-full 
          p-4 
          text-sm text-gray-600
          border rounded-lg
          dark:bg-gray-700 
          dark:border-l-gray-700
          dark:border-gray-600
          mr-2
        `}
      />

      {/* --------------------------------- Button --------------------------------- */}
      {/* <button 
        type="button"
        onClick={handleSearch}
        className={`
          text-white dark:text-white
          text-sm font-medium 
          bg-gray-300 hover:bg-gray-400
          dark:bg-slate-700 dark:hover:bg-slate-800
          rounded-lg
          right-2.5 bottom-2.5 
          px-4 py-2
        `}
      >
        <svg 
          aria-hidden="true" 
          className="w-5 h-5 text-gray-500 dark:text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z">
          </path>
        </svg>
      </button> */}

    </form>
  )
}

export default Search;