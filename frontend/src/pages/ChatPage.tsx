
import { useContext, useState } from "react"
import { ChatContext } from "../context/ChatProvider"
import MyChats from "../components/MyChats";

import SideDrawer from "../miscellaneous/SideDrawer";
import ChatBox from "../components/ChatBox";
const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);

  const context = useContext(ChatContext);
  if (!context) {
    return null;
  }
  const { user } = context;




  return (
    <div className="w-full ">
      {user && <SideDrawer />}
      <div className="flex justify-between w-full gap-2   p-2 md:p-10 h-[96.5vh]">
        {user && (
          <MyChats fetchAgain={fetchAgain} />
        )}
        {user && (<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />)}
       
      </div>
    </div>
  )
}

export default ChatPage