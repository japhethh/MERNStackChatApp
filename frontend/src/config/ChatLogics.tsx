interface Users {
  _id: string;
  name: string;
}



// This function determines the name of the other user in a one-on-one chat.
// It takes two parameters:
// 1. loggedUser: The currently logged-in user.
// 2. users: An array of users in the chat (usually two users for one-on-one chats).

export const genSender = (loggedUser: any, users: Users[]) => {
  // Check if the first user in the users array is the logged-in user.
  // If true, return the name of the second user (the other participant).
  // If false, return the name of the first user (since the logged-in user is the second one).

  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;

  // Example:
  // - loggedUser: { _id: "1", name: "John" }
  // - users: [{ _id: "1", name: "John" }, { _id: "2", name: "Alice" }]
  // - Since users[0]._id === loggedUser._id, return users[1].name ("Alice")

  // This helps in showing the correct name of the other user in a one-on-one chat.
  // If it's a group chat, this function is not used.
};

export const genSenderFull = (loggedUser: any, users: Users[]) => {

  return users[0]._id === loggedUser._id ? users[1] : users[0];
}


export const isSameSender = (messages: any, m: any, i: any, userId: any) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  )
}

export const isLastMessage = (messages: any, i: any, userId: any) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );

}

export const isSameSenderMargin = (messages: any, m: any, i: any, userId: any) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  ) return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId ||
      (i == messages.length - 1 && messages[i].sender._id !== userId)
    )
  ) return 0;
  else return "auto";
}

export const isSameUser = (messages:any,m:any, i:any) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id
}