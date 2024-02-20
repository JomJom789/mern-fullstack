import React from 'react'

const FilterModal = () => {
  return (
    <div 
      aria-labelledby="modal-title" 
      role="dialog"
      aria-modal="true"
      className={`relative z-10 ${ isOpen ? `block`: `hidden` }`}
    >
    
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        
          <div 
            className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all p-5 my-8 
              xx:w-full
              xs:w-[80%]
              sm:w-[60%]
              md:w-[40%]
            `}
          
          >

            <div className="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700">
              {/* <input 
                id="bordered-checkbox-1" 
                type="checkbox" 
                value="" 
                name="bordered-checkbox" 
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              > */}

              <label 
                for="bordered-checkbox-1" 
                className={`w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300`}
              >
                Default radio
              </label>
            </div>

          </div>
        </div>
      </div>
    </div> 
  )
}

export default FilterModal