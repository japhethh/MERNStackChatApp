import  { useContext } from 'react'
import { ChatContext } from '../context/ChatProvider'
import { LuArrowLeft } from "react-icons/lu";
import { genSender, genSenderFull } from '../config/ChatLogics';
import ProfileModal from '../miscellaneous/ProfileModal'
import UpdateGroupChatModel from '../miscellaneous/UpdateGroupChatModel';

const SingleChat = ({ fetchAgain, setFetchAgain }: any) => {

  const context = useContext(ChatContext);
  if (!context) {
    return null;
  }

  const { user, selectedChat, setSelectedChat } = context;

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
                  <UpdateGroupChatModel fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
                </>)}
            </div>
            <div className="flex flex-col justify-end p-3 bg-[#E8E8E8] w-full h-full overflow-y-hidden">
                  {/* Message Here */}
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