import React, { useContext, useEffect, useState } from 'react'
import { FaEye } from 'react-icons/fa';
import { ChatContext } from '../context/ChatProvider';
import UserBadgeItem from '../components/UserAvatar/UserBadgeItem';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain }: any) => {
  const [groupChatName, setGroupChatName] = useState<string>("");
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const context = useContext(ChatContext);
  if (!context) {
    return null;
  }
  const { setSelectedChat, selectedChat, user } = context;

  const usercontext = useContext(UserContext);
  if (!usercontext) {
    return null;
  }
  const { apiURL } = usercontext;



  const handleRemove = (user: any) => {
  }
  const handleRename = async () => {
    setLoading(true);
    if(!groupChatName) return 

    try {
      setRenameLoading(true);

      const config = {
        headers:{
          Authorization:`Bearer ${user?.token}`,
        }
      }

      const {data} = await axios.put(`${apiURL}/api/chat/rename`, {
        
      })
    } catch (error) {
      
    }
  }
  const handleSearch = () => {


  }

  //   <div>
  //   <input type="text" value={groupChatName} onChange={(e) => handleSearch(e.target.value)} className="input input-bordered w-full max-w-xs my-2" placeholder="Add user to the group"/>
  // </div>
  return (
    <div>
      <FaEye
        className="text-xl"
        onClick={() => document.getElementById('my_modal_3')?.showModal()}
      />
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg text-center">
            {selectedChat.chatName}
          </h3>
          <div className="py-4">
            <div className="flex flex-wrap w-full gap-2 my-2">
              {selectedChat.users.map((u: any) => (
                <UserBadgeItem key={u._id} user={u} handlerFunction={() => handleRemove(u)} />
              ))}

            </div>
            <div className="flex gap-2">
              <input type="text" value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} className="input input-bordered w-full max-w-xs my-2" />
              <button className="btn my-2" type='submit' onClick={handleRename}>{loading ? (<span className="loading loading-spinner loading-xs"></span>) : <h1>Update</h1>}</button>
            </div>
            <div>
              <input type="text" onChange={(e) => handleSearch(e.target.value)} className="input input-bordered w-full max-w-xs my-2" placeholder="Add user to the group" />
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button onClick={() => handleRemove(user)} className="btn">Leave group</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default UpdateGroupChatModel