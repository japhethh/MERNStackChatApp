import axios from 'axios'
import React, { useEffect, useState } from 'react'

const ChatPage = () => {
  interface User {
    name: string;
    email: string;
  }
  interface Chat {
    isGroupchat: boolean;
    users: User[];
    _id: string;
    chatName: string;
    groupAdmin?: User;
  }


  const [chat, setChat] = useState<Chat[]>([]);


  useEffect(() => {
    fetchChats();
  }, [])

  const fetchChats = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/chats");
      setChat(response.data)
      console.log(response.data);
    } catch (error) {
      console.log(error)
    }

  }



  return (
    <div>
      {chat.map((item, index) => (
        <div key={index}>
          <div>{item.chatName}</div>
          <p>{item.isGroupchat ? "Group chat" : "Single Chat"}</p>
          <ul>
            {item.users.map((user,index) => (
              <li key={index}> 
              {user.name}
              </li>
            ))}
          </ul>
        </div>
      ))}

    </div>
  )
}

export default ChatPage