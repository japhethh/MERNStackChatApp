
import { useContext } from "react"
import { ChatContext } from "../context/ChatProvider"
import MyChats from "../components/MyChats";

import SideDrawer from "../miscellaneous/SideDrawer";
import ChatBox from "../components/ChatBox";
const ChatPage = () => {

  const context = useContext(ChatContext);
  if (!context) {
    return null;
  }

  const { user } = context;

  return (
    <div className="w-full">
      {user && <SideDrawer />}
      <div className="flex justify-between w-full p-10 h-[96.5vh]"> 
        {user && <MyChats />}
        {user && <ChatBox />}
      </div>
    </div>
  )
}

export default ChatPage