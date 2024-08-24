import React, { useContext, useEffect, useState } from 'react'
import { FaEye } from 'react-icons/fa';
import { ChatContext } from '../context/ChatProvider';
import UserBadgeItem from '../components/UserAvatar/UserBadgeItem';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import UserListItem from '../components/UserAvatar/UserListItem';
const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain, fetchMessages }: any) => {
  const [groupChatName, setGroupChatName] = useState<string>("");
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
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



  const handleAddUser = async (user1: any) => {
    if (selectedChat.users.find((u: any) => u._id === user1._id)) {
      toast.error("User already in the group!");
      return;
    }

    if (selectedChat.groupAdmin._id !== user?._id) {
      toast.success("Only admin can add someone")
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      }

      const { data } = await axios.put(`${apiURL}/api/chat/groupAdd`, {
        chatId: selectedChat._id,
        userId: user1._id
      }, config);

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);

    } catch (error) {
      toast.error("Error Occured");
      setLoading(false);
    }
  }

  const handleRemove = async (user1: any) => {
    if (selectedChat.groupAdmin._id !== user?._id && user1._id !== user?._id) {
      toast.error("Only admins can remove someone!");
      return
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      }
      const { data } = await axios.put(`${apiURL}/api/chat/groupRemove`, {
        chatId: selectedChat._id,
        userId: user1._id
      }, config);

      user1._id === user?._id ? setSelectedChat("") : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast.error("Error Occured");
      setLoading(false);
    }
  }

  const handleRename = async () => {
    if (!groupChatName) return
    setRenameLoading(true);

    try {

      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        }
      }

      const { data } = await axios.put(`${apiURL}/api/chat/rename`, {
        chatId: selectedChat._id,
        chatName: groupChatName
      }, config);

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      setLoading(false);
    } catch (error) {
      toast.error("Error Occured!")
    }
    setGroupChatName("")
  }

  const handleSearch = async (search: string) => {
    if (!search) {
      toast.warn('Please enter something in search.', {
        position: "top-center",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.get(`${apiURL}/api/user?search=${search}`, config);
      setLoading(false)
      setSearchResult(data);
      setRenameLoading(false);
    } catch (error) {
      toast.error("Error Occurred!", {
        position: "top-center",
      });
      setRenameLoading(false);
    }
  };




  return (
    <div>
      <button className="btn">
        <FaEye
          className="text-xl"
          onClick={() => document.getElementById('my_modal_3')?.showModal()}
        />
      </button>
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
              <button className="btn my-2 bg-green-500 text-white" type='submit' onClick={handleRename}>{renameLoading ? (<span className="loading loading-spinner loading-xs"></span>) : <h1>Update</h1>}</button>
            </div>
            <div>
              <input type="text" onChange={(e) => handleSearch(e.target.value)} className="input input-bordered w-full max-w-xs my-2" placeholder="Add user to the group" />
            </div>
            <div className="overflow-y-scroll min-h-0 max-h-32">
              {loading ? (
                <div className="flex justify-center items-center my-5">
                  <span className="loading loading-spinner loading-md text-center"></span>
                </div>
              ) : (
                <div className="menu  rounded-box w-full ">
                  {
                    searchResult.map((item: any) => (
                      <li className='my-2'>
                        <UserListItem
                          key={item._id}
                          user={item}
                          handlerFunction={() => handleAddUser(item)}
                        />
                      </li>
                    ))
                  }
                </div>
              )}
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button onClick={() => handleRemove(user)} className="btn bg-red-500 text-white">Leave group</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default UpdateGroupChatModel