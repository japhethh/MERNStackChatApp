import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatProvider";
import { UserContext } from "../context/UserContext";
import { toast } from 'react-toastify';
import { IoIosAdd } from "react-icons/io";
import { genSender } from '../config/ChatLogics';

import axios from "axios";
import ChatLoading from "./ChatLoading";
import GroupChatModel from "../miscellaneous/GroupChatModel";

const MyChats = ({fetchAgain}:any) => {
  const [loggedUser, setLoggedUser] = useState<any>(null); // Set initial state to null
  const context = useContext(ChatContext);
  if (!context) {
    return null; // Ensure context is available
  }

  const usercontext = useContext(UserContext);
  if (!usercontext) {
    return null; // Ensure user context is available
  }

  const { apiURL } = usercontext; // Extract apiURL from UserContext
  const { selectedChat, setSelectedChat, user, chats, setChats } = context; // Extract relevant values from ChatContext

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`, // Set authorization header with token
        },
      };
      const { data } = await axios.get(`${apiURL}/api/chat`, config); // Fetch chats from the API
      console.log(data);
      setChats(data); // Update the chats state
    } catch (error) {
      toast.error("Error Occured!"); // Display error message if fetch fails
    }
  };

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setLoggedUser(JSON.parse(userInfo)); // Set loggedUser state from localStorage
      fetchChats(); // Fetch chats when the component mounts
    }
  }, [fetchAgain]); // Dependency array is empty, so it runs once on mount

  return (
    <div className={`${selectedChat ? "hidden" : "flex"} md:flex max-md:none rounded-md flex-col max-md:w-full md:w-[50%] bg-blue-200`}>

      <div className="flex justify-between items-center px-2 pb-2 w-full font-sans py-2">

        <h1>My Chats</h1>
        <GroupChatModel>
          <button className="btn btn-md" onClick={() => document.getElementById('my_modal_2').showModal()} type="button">
            <span>New Group Chat</span> <IoIosAdd />
          </button>
        </GroupChatModel>
      </div>

      <div className="flex flex-col p-3 bg-[#F8F8F8] w-full h-full overflow-y-hidden rounded-lg">
        {chats ? (
          <div className="overflow-y-scroll my-scroll-container flex flex-col gap-1">
            {chats.map((chat: any) => (
              <div
                className={`cursor-pointer py-2 px-3 rounded-lg ${selectedChat?._id === chat._id ? "bg-teal-500 text-white" : "bg-gray-200 text-black"
                  }`} // Conditional class for selected chat
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
              >
                <div>
                  {!chat.isGroupChat
                    ? genSender(loggedUser, chat.users) // Display sender name if not group chat
                    : chat.chatName // Display chat name if group chat
                  }
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ChatLoading /> // Show loading component if chats are not yet fetched
        )}
      </div>
    </div>
  );
};

export default MyChats;
