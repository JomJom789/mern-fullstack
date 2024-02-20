import React from 'react'

/* ---------------------------------- Redux --------------------------------- */
import {
	useDispatch,
  useSelector,
} from "react-redux";

import {
  setIsChatOpen
} from '../../../../../state/adminReducer';

/* ------------------------------- Components ------------------------------- */
import ContactCard from '../Cards/ContactCard';

/* -------------------------------------------------------------------------- */
/*                                  Contacts                                  */
/* -------------------------------------------------------------------------- */
const FetchContacts = ({ rtkData, rtkIsLoading, accessChat }) => {

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
          ?	rtkData.users
          // .filter((item, index) => item.activeStatus === true )
          .slice().sort((a, b) => a.activeStatus > b.activeStatus ? -1 : 1)
          .map((item, index) =>
              <ContactCard
                key={item + index + item.email}
                name={item.firstName + " " + item.lastName}
                email={item.email}
                type={item.type}
                profilePicture={item.picturePath}
                active={item.activeStatus}
                handleFunction={ () => { 
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

export default FetchContacts