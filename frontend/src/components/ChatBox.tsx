import { useContext } from "react"
import { ChatContext } from "../context/ChatProvider"
import SingleChat from "./SingleChat";

const ChatBox = ({fetchAgain, setFetchAgain}:any) => {

  const context = useContext(ChatContext);
  if (!context) {
    return null;
  }

  const { selectedChat } = context;

  return (
    <div className={`${selectedChat ? "flex" : "hidden"} flex-col md:flex max-md:w-full md:w-full  rounded-lg p-2 `}>

      {/* Making Single Chat */}
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />

    </div>
  )
}

export default ChatBox