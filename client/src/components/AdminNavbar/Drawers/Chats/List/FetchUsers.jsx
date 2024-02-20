import React from 'react'

/* ---------------------------------- Redux --------------------------------- */
import {
	useDispatch,
} from "react-redux";

import {
  setIsChatOpen
} from '../../../../../state/adminReducer';

/* ------------------------------- Components ------------------------------- */
import ContactCard from '../Cards/ContactCard';


/* -------------------------------------------------------------------------- */
/*                                 FetchUsers                                 */
/* -------------------------------------------------------------------------- */
const FetchUsers = ({ rtkData, rtkIsLoading, accessChat }) => {
  
  /* -------------------------------------------------------------------------- */
  /*                                     Log                                    */
  /* -------------------------------------------------------------------------- */
  // console.log(rtkData);
  
  /* -------------------------------------------------------------------------- */
  /*                             Redux State Reducer                            */
  /* -------------------------------------------------------------------------- */

  // * Dispatch
  const dispatch = useDispatch();

  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div>
      {
        rtkIsLoading 
        ?	rtkData !== undefined 
          // ? rtkData.users.map((item, index) => ( <SkeletonCard key={index+item._id} /> ))
          ? <></>
          : <></>
        :	rtkData !== undefined 
          ?	rtkData.users.map((item, index) =>
              <ContactCard
                key={item + index}
                name={item.firstName + " " + item.lastName}
                email={item.email}
                type={item.type}
                profilePicture={item.picturePath}
                active={item.activeStatus}
                handleFunction={() => {
                  accessChat(item._id);
                  dispatch(setIsChatOpen(true));
                }}
              />
            )
          : <div className={`w-full text-center p-10`}>
              No Users
            </div>
      }
    </div>
  )
}

export default FetchUsers