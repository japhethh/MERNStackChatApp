import React from 'react'
import Login from '../components/Authentication/Login'
const HomePage = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div role="tablist" className="tabs tabs-lifted">
        <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Login" />
        <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6 h-72 w-72">
          <Login />
        </div>

        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          className="tab"
          aria-label="Sign Up"
          defaultChecked />
        <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6 h-72 w-72">
          Tab content 2
        </div>


      </div>
    </div>
  )
}

export default HomePage