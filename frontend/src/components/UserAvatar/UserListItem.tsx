
interface User {
  user: any;
  handlerFunction: any;
}
const UserListItem = ({ user, handlerFunction }: User) => {
  return (
    <div className="p-2 flex gap-2  rounded-md" onClick={handlerFunction}>
      <div className="avatar">
        <div className="w-10 rounded-full">
          <img alt={user.name} src={user.pic} />
        </div>
      </div>
      <div>
        <h1>{user.name}</h1>
        <h1><span className="font-semibold">Email:</span> {user.email} </h1>
      </div>
    </div>
  )
}

export default UserListItem