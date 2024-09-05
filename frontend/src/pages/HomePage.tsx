import  { useEffect } from 'react'
import Login from '../components/Authentication/Login'
import Register from '../components/Authentication/Register'
import { useNavigate } from 'react-router-dom'
const HomePage = () => {
  // const navigate = useNavigate();

  useEffect(() => {
    // const userInfo = localStorage.getItem("userInfo");

    // if (userInfo) {
    //   const user = JSON.parse(userInfo);
    //   if (user) {
    //     navigate("/");
    //   }
    // }

  })


  return (
    <div className="h-screen w-full flex justify-center mt-10">
      <div>
        <div role="tablist" className="tabs tabs-lifted">
          <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Login" />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6 h-92 w-92">
            <Login />
          </div>

          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab"
            aria-label="Sign Up"
            defaultChecked />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6 h-92 w-92">
            <Register />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage