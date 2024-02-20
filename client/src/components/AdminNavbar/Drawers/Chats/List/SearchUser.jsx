import React from 'react'

/* -------------------------------------------------------------------------- */
/*                                 SearchUser                                 */
/* -------------------------------------------------------------------------- */
const SearchUser = ({search, setSearch}) => {


  
  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <form className='mx-2 py-4 flex'>
      <input 
        required 
        type="search" 
        id="web-search"
        placeholder={`Search User`}
        value={search}
        onChange={(e) => ((
          setSearch(e.target.value)
        ))}
        className={`
          w-full 
          p-2 
          text-sm text-gray-600
          border rounded-lg
          dark:bg-gray-700 
          dark:border-l-gray-700
          dark:border-gray-600
          mr-2
        `}
      />

    </form>
  )
}

export default SearchUser;