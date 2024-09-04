import { useContext, useEffect, useState } from 'react';
import { IoMdSearch } from 'react-icons/io';
import { GoBellFill } from 'react-icons/go';
import { ChatContext } from '../context/ChatProvider';
import ProfileModal from '../miscellaneous/ProfileModal';
// import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from "../context/UserContext";
import axios from 'axios';
import ChatLoading from '../components/ChatLoading';
import UserListItem from '../components/UserAvatar/UserListItem';
import { genSender } from '../config/ChatLogics';

interface User {
  name: string;
  email: string;
  token: string;
  _id: string;
  pic: string;
  // Add more fields as neededd
}

const SideDrawer = () => {
  const [search, setSearch] = useState<string>('');
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingChat, setLoadingChat] = useState<boolean>(false);
  // const navigate = useNavigate();

  const chatContext = useContext(ChatContext);
  const userContext = useContext(UserContext);

  if (!chatContext || !userContext) return null;

  const { user, setSelectedChat, chats, setChats, notification, setNotification } = chatContext;
  const { apiURL } = userContext;

  useEffect(() => {
    console.log(search);
    console.log(searchResult);
  }, [search, searchResult]);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    // navigate("/logout");
    window.location.href = "/login";
  };

  const handlerSearch = async () => {
    if (!search) {
      toast.warn('Please enter something in search.', {
        position: "top-center",
      });
      return;
    }

    try {
      setLoading(true);
      setLoadingChat(false);

      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.get(`${apiURL}/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error("Error Occurred!", {
        position: "top-center",
      });
      setLoading(false);
    }
  };

  const accessChat = async (userId: string) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.post(`${apiURL}/api/chat`, { userId }, config);

      if (!chats.find((c: any) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
    } catch (error) {
      toast.error("Error Occurred!", {
        position: "top-center",
      });
      setLoadingChat(false);
    }
  };

  const notificationLogic = () => {
    return notification.length;
  }

  const handleSetLogic = (notif: any) => {
    console.log("notif.chat")
    setSelectedChat(notif.chat);
    setNotification(notification.filter((n: any) => n !== notif));
  }

  return (
    <div className="flex justify-between items-center bg-white w-full py-1 px-2 border-2">
      <div className="tooltip tooltip-bottom" data-tip="Search User to Chat">
        <label htmlFor="my-drawer" className="btn-ghost btn drawer-button">
          <IoMdSearch className="text-lg" />
          <h1 className="md:flex max-md:hidden px-3">Search User</h1>
        </label>
      </div>

      <div>
        <h1 className="text-2xl font-sans">Chat</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className={`${notificationLogic() ? "indicator" : ""}`}>
              <span className={`${notificationLogic() ? "indicator-item badge badge-secondary" : ""}`}>{notification.length ? `${notification.length}` : ""}</span>
              <GoBellFill className="text-2xl" />
            </div>
          </div>
          <div className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-72 shadow">
            <div className="card-body">

              <span className="text-info">
                <ul tabIndex={0} className="menu bg-base-200 rounded-box w-full ">
                  {!notification.length && <div>No new messages</div>}
                  {notification.map((notif: any) => (
                    <li className="cursor-pointer" key={notif._id} onClick={() => handleSetLogic(notif)}>
                      <a >
                        {notif.chat.isGroupChat
                          ? `New Message in ${notif.chat.chatName}`
                          : `New Message from ${genSender(user, notif.chat.users)}`}
                      </a>
                    </li>
                  ))}

                </ul>

              </span>
            </div>
          </div>
        </div>

        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="User Avatar"
                src={user?.pic}
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li>
              <ProfileModal user={user}>
                <a className="justify-between">
                  My Profile
                  <span className="badge">New</span>
                </a>
              </ProfileModal>
            </li>
            <li><a onClick={logoutHandler}>Logout</a></li>
          </ul>
        </div>

        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-side">
            <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>

            <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
              <li className="menu-title text-xl">Title</li>

              <div className="py-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full max-w-xs"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button className="btn btn-md" type="submit" onClick={handlerSearch}>Go</button>
                </div>
              </div>

              <li className="py-2">
                {loading ? (
                  <ChatLoading />
                ) : (
                  searchResult.map((item) => (
                    <UserListItem
                      key={item._id}
                      user={item}
                      handlerFunction={() => accessChat(item._id)}
                    />
                  ))
                )}
              </li>

              {loadingChat && (
                <div className="flex justify-center items-center">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideDrawer;
