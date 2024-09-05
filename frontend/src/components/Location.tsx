import { IoMdArrowBack } from "react-icons/io";
import { NavLink, useNavigate } from 'react-router-dom';
const Location = () => {
  const navigate = useNavigate();


  const handleGoBack = () =>{
    // navigate("/")
    window.location.href = "/"
  }
  return (
    <div className="">
      <div className="flex justify-start items-center h-16 w-[96%] mx-auto">
        <div onClick={handleGoBack}>
          <IoMdArrowBack className="text-2xl" />
        </div>

      </div>
      <div className="flex justify-center items-center h-full w-full">

        <p><iframe className="w-screen m-0" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.558505351758!2d121.05188017267832!3d14.680978675108584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b73514246a25%3A0x989e04ab1fceff31!2sPingkian%201%2C%20Himlayan%20Ave%2C%20Quezon%20City%2C%201107%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1725505962337!5m2!1sen!2sph" height="450"   ></iframe></p>
      </div>
    </div>
  )
  }

  export default Location