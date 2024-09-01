import { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../context/ChatProvider'
import { UserContext } from '../context/UserContext'
import { LuArrowLeft } from "react-icons/lu";
import { genSender, genSenderFull } from '../config/ChatLogics';
import ProfileModal from '../miscellaneous/ProfileModal'
import UpdateGroupChatModel from '../miscellaneous/UpdateGroupChatModel';
import axios from 'axios';
import { toast } from 'react-toastify';
import "./style.css"
import ScrollableChat from './ScrollableChat';

import io from 'socket.io-client';

const ENDPOINT = "http://localhost:4000";
var socket: any, selectedChatCompare: any;

const SingleChat = ({ fetchAgain, setFetchAgain }: any) => {
  const [messages, setMessages] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState<boolean>(false)
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);





  const context = useContext(ChatContext);
  if (!context) {
    return null;
  }

  const userContext = useContext(UserContext);
  if (!userContext) {
    return null;
  }


  const { user, selectedChat, setSelectedChat, notification, setNotification } = context;

  const { apiURL } = userContext;

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user)
    socket.on("connected", () => setSocketConnected(true))
    socket.on('typing', () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false))
  }, []);

  useEffect(() => {
    // console.log(messages)
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat])

  console.log(notification);


  useEffect(() => {
    socket.on("message received", (newMessageReceived: any) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        // give notification

        if (!notification.includes(newMessageReceived)) {
          setNotification([...notification, newMessageReceived])
          setFetchAgain(!fetchAgain)
        }
      } else {
        setMessages([...messages, newMessageReceived])
      }

    })
  });



  const fetchMessages = async () => {
    if (!selectedChat) return

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      }
      setLoading(true);

      const { data } = await axios.get(`${apiURL}/api/message/${selectedChat._id}`, config);
      // console.log(data);
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id)
    } catch (error) {
      toast.error("Error Occured");
    }

  }

  const sendMessage = async (event: any) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`
          }
        }

        setNewMessage("");
        const { data } = await axios.post(`${apiURL}/api/message`,
          {
            content: newMessage,
            chatId: selectedChat._id
          }, config);
        // console.log(messages)
        socket.emit("new message", (data))
        setMessages([...messages, data])

      } catch (error) {
        toast.error("Error Occured");
      }
    }
  }

  const typeHandler = (e: any) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id)
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      var timeNow = new Date().getTime();

      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength)
  }



  // useEffect(() => {
  //   console.log(newMessage)
  // }, [])

  return (
    <>
      {
        selectedChat
          ? <>
            <div className='text-md md:text-xl flex pb-3 px-2 w-full font-sans  justify-between items-start'>
              <button className='btn flex md:hidden' onClick={() => setSelectedChat("")}>
                <LuArrowLeft />
              </button>

              {!selectedChat.isGroupChat ? (
                <>
                  <div className="text-2xl font-medium">
                    {genSender(user, selectedChat.users)}
                  </div>
                  <ProfileModal user={genSenderFull(user, selectedChat.users)} />
                </>) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModel fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
                </>)}
            </div>
            <div className="flex flex-col justify-center p-10 bg-[#E8E8E8] w-full h-full overflow-y-hidden">
              {loading ? (
                <span className="loading loading-spinner loading-lg text-2xl h-20 self-center m-auto"></span>
              ) : (

                <div className="h-full w-full ">
                  <div className=" overflow-y-scroll h-full w-full ">
                    {/* Messages */}
                    <ScrollableChat messages={messages} />
                  </div>
                </div>
              )}

              <div onKeyDown={sendMessage} className="mt-3">
                {isTyping ? (<div className="text-base-400 ">
                  Loading...
                </div>) : (<div></div>)}

                <input className="input input-bordered w-full" type="text" placeholder="Enter messages" onChange={typeHandler} value={newMessage} />
              </div>
            </div>


          </> : (
            <div className="flex justify-center items-center h-full w-full">
              <h1 className='text-3xl text-center pb-3 font-sans'>
                Click on a user to start chatting
              </h1>
            </div>
          )
      }
    </>
  )
}

export default SingleChat