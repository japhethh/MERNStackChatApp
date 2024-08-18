import { ReactNode, useContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { ChatContext } from "../context/ChatProvider";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import UserListItem from "../components/UserAvatar/UserListItem";
import UserBadgeItem from "../components/UserAvatar/UserBadgeItem";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { SubmitHandler, useForm } from "react-hook-form"
// import { ReactTyped } from 'react-typed';


// import { z } from 'zod';

// const schema = z.object({
//   email: z.string().email().min(12, "Email must contain at least 12 characters").trim(),
//   password: z.string().min(12, "Password must contain at least 12 characters").
//     max(15).trim()
// })

// type FormField = z.infer<typeof schema>;


interface Props {
  children: ReactNode;
}

interface User {
  _id: string;
  name: string;
  email: string;
}
const GroupChatModel = ({ children }: Props) => {


  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);


  const context = useContext(ChatContext);
  if (!context) {
    return null;
  }
  const { user, chats, setChats } = context;

  const usercontext = useContext(UserContext);
  if (!usercontext) {
    return null;
  }

  const { apiURL } = usercontext;

  // const { handleSubmit, register, formState: { errors } } = useForm<FormField>(
  //   { resolver: zodResolver(schema) }
  // );

  // const onSubmit: SubmitHandler<FormField> = (data) => {
  //   console.log(data)
  // }

  const handleSearch = async (value: any) => {
    setSearch(value);
    if (!value) {
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        }
      }

      const { data } = await axios.get(`${apiURL}/api/user?search=${search}`, config);
      console.log(data)
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      toast.error("Error Occured!");
    }
  }

  const handleSubmit = async () => {
    if (!selectedUsers || !groupChatName) {
      toast.error("Please fill all the feilds")
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      };

      const { data } = await axios.post(`${apiURL}/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id))
        }, config)


      setChats([data, ...chats]);

      toast.success("New Group Chat Created");
    } catch (error) {
      toast.error("Error")
    }
  }

  const handleGroup = (userToAdd: User) => {  // Updated logic to simplify `handleGroup`
    if (selectedUsers.some((user) => user._id === userToAdd._id)) {  // Removed redundant type annotation in `.some()`
      toast.error("User is already added in this group!");
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);  // Updated the way users are added to selectedUsers
    toast.success("User added to the group!");
  }


  const handleDelete = (userDelete: User) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== userDelete._id));
  }

  const handleClose = () => {
    setSelectedUsers([]);
  }
  return (
    <div>
      {/* Open the modal using document.getElementById('ID').showModal() method */}

      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <div className="flex justify-center">
            <h3 className="font-bold text-2xl font-sans justify-center">Create Group Chat</h3>
          </div>
          <div className="flex flex-col gap-2 my-4 items-center ">
            {/* <form onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="email">
                
              </label>
              <input type="text" id="email" {...register("email")} />
              {errors.email && (<span style={{ color: "red", display: "block" }}></span>)}
            </form> */}
            <form className="w-full flex justify-center items-center">
              <input className="input input-bordered w-full max-w-xs" type="text" placeholder="Chat Name" onChange={(e: any) => setGroupChatName(e.target.value)} />
            </form>
            <form className="w-full flex justify-center items-center">
              <input className="input input-bordered w-full max-w-xs" placeholder="Add Users eg:John, Piyush, Jane" type="text" onChange={(e: any) => handleSearch(e.target.value)} />
            </form>
            <div className="flex flex-wrap gap-1 w-8/12 mx-auto">
              {selectedUsers.map((item: any) => (
                <UserBadgeItem

                  user={item}
                  handlerFunction={() => handleDelete(item)}
                  key={item._id}
                />
              ))}
            </div>
            <div className="overflow-y-scroll h-32 menu text-base-content min-h-full w-80 p-4">
              <ul className="menu bg-base-100">
                <li>
                  {loading ? (
                    <div>Loading</div>
                  ) : (
                    searchResult.slice(0, 3).map((user: User) => (  // Removed redundant `any` type and corrected callback in `.map()`
                      <UserListItem
                        key={user._id}  // Moved key prop directly to UserListItem
                        user={user}
                        handlerFunction={() => handleGroup(user)}  // Fixed callback to correctly pass the user to be added
                      />
                    ))
                  )}
                </li>
              </ul>
            </div>


            {/* Selected users */}
            {/* Render Search Users */}

          </div>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn" onClick={handleClose}>Close</button>
            </form>
            <button className="btn" onClick={handleSubmit}>Create Chat</button>

          </div>
        </div>
      </dialog>
      {children}
    </div>
  )
}

export default GroupChatModel