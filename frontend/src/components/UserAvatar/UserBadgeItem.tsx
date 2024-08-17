import React, { ReactNode } from 'react'
import { IoIosClose } from "react-icons/io";

interface User {
  user: any;
  handlerFunction: any;
}
const UserBadgeItem = ({ user, handlerFunction }: User) => {
  return (
    <div className="badge badge-primary cursor-pointer flex justify-center items-center" onClick={handlerFunction}>
      <h1>
        {user.name}
      </h1>
      <IoIosClose className="text-xl "/>

    </div>
  )
}

export default UserBadgeItem