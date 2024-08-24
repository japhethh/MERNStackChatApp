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


const SingleChat = ({ fetchAgain, setFetchAgain }: any) => {
  const [messages, setMessages] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState("");

  const context = useContext(ChatContext);
  if (!context) {
    return null;
  }

  const userContext = useContext(UserContext);
  if (!userContext) {
    return null;
  }


  const { user, selectedChat, setSelectedChat } = context;

  const { apiURL } = userContext;

  useEffect(() => {
    // console.log(messages)
    fetchMessages();
  }, [selectedChat])


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
      console.log(data);
      setMessages(data);
      setLoading(false);

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


        console.log(messages)
        setMessages([...messages, data])

      } catch (error) {
        toast.error("Error Occured");
      }
    }
  }

  const typeHandler = (e: any) => {
    setNewMessage(e.target.value);
  }


  useEffect(() => {
    console.log(newMessage)
  }, [])

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
                  <UpdateGroupChatModel fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages}/>
                </>)}
            </div>
            <div className="flex flex-col justify-center p-3 bg-[#E8E8E8] w-full h-full overflow-y-hidden">
              {loading ? (
                <span className="loading loading-spinner loading-lg text-2xl h-20 self-center m-auto"></span>
              ) : (
                
                <div className="h-full w-full ">
                <div className="messages">
                {/* Messages */}
              <ScrollableChat messages={messages}/>

                </div>
                </div>
              )}

              <div onKeyDown={sendMessage} className="mt-3 ">
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