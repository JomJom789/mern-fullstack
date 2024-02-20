/* -------------------------------------------------------------------------- */
/*                             isSameSenderMargin                             */
/* -------------------------------------------------------------------------- */
// This use to align the user 
// if you are the sender align to right else left
export const isSameSenderMargin = (messages, m, i, userId) => {

  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  ) {
    return 33;
  } else if (
    (
      i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId
    ) ||
    (
      i === messages.length - 1 && 
      messages[i].sender._id !== userId
    )
  ) {
    return 0;
  } else { 
    return "auto"; 
  }
};

/* -------------------------------------------------------------------------- */
/*                                isSameSender                                */
/* -------------------------------------------------------------------------- */
// Identifying if you are the sender
export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (
      messages[i + 1].sender._id !== m.sender._id || 
      messages[i + 1].sender._id === undefined
    ) && 
    messages[i].sender._id !== userId
  );
};

/* -------------------------------------------------------------------------- */
/*                                isLastMessage                               */
/* -------------------------------------------------------------------------- */
// This is where you put the image
export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 && 
    messages[messages.length - 1].sender._id !== userId && 
    messages[messages.length - 1].sender._id
  );
};

/* -------------------------------------------------------------------------- */
/*                                 isSameUser                                 */
/* -------------------------------------------------------------------------- */
// Use to margin top on Chat
export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

/* -------------------------------------------------------------------------- */
/*                                  getSender                                 */
/* -------------------------------------------------------------------------- */
// not a group chat, 1 to 1 
// return name of the users 
export const getSender = (id, users) => {

  // * Original
  // return users[0]._id === id ? users[1].name : users[0].name;

  // * My Code
  if (users) {
    return users[0]._id === id 
    ? users[1].firstName + " " + users[1].lastName
    : users[0].firstName + " " + users[0].lastName
  }

  // * Log
  // console.log(users);
  // console.log(users[0].email);

};

/* -------------------------------------------------------------------------- */
/*                                getSenderFull                               */
/* -------------------------------------------------------------------------- */
// get users to use in selecting chat
export const getSenderFull = (id, users) => {
  return users[0]._id === id ? users[1] : users[0];
};
