import { useContext, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from 'zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../../context/UserContext';




const schema = z.object({
  email: z.string().email().min(5, "Email must contain at least 5 characters").trim(),
  password: z.string().min(8, "Password must contain at least 8 characters").
    max(15).trim()
})

type FormField = z.infer<typeof schema>;

const Login = () => {
  const [show, setShow] = useState<boolean>(false);
  const navigate = useNavigate();
  const context = useContext(UserContext);
  if (!context) {
    return null
  }
  const { apiURL } = context;
  interface Data {
    email: string;
    password: string;
  }

  const { handleSubmit, register, formState: { errors } } = useForm<FormField>(
    { resolver: zodResolver(schema) }
  );

  const onSubmit: SubmitHandler<Data> = async (data) => {

    if (!data.email || !data.password) {
      toast.warning("Please Fill all the field");
      return;
    }
    try {
      const response = await axios.post(`${apiURL}/api/user/login`, data);
      if(response.data.success){
        navigate("/chats");
        console.log(response);
        toast.success("Successfully Login")
        localStorage.setItem("userInfo",JSON.stringify(response.data.data));
        window.location.reload();
      }
    } catch (error:any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message)
      }
      console.log(error);
    }
    console.log(data)
  }

  const handleClick = () => setShow(!show)
  return (
    <div>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">Email <span className="text-red-500 font-semibold">*</span></label>
        <input id='email' type="text" className="input input-bordered join-item" placeholder="Email" {...register("email")} />
        {errors.email && (
          <span className="text-red-500">
            {errors.email.message}
          </span>
        )}
        <label htmlFor="password">Password <span className="text-red-500 font-semibold">*</span></label>
        <div className="join w-auto">
          <input id="password" type={`${show ? "text" : "password"}`} className="input input-bordered join-item w-5/6" placeholder="Password" {...register("password")} />
          <div className="btn join-item rounded-r-full" onClick={handleClick}>{show ? "Hide" : "Show"}</div>
        </div>
        {errors.password && (
          <span className="text-red-500">
            {errors.password.message}
          </span>
        )}

        <button className="btn w-full bg-blue-500 text-white mx-auto " type='submit'>Login</button>

        <button className="btn w-full mx-auto bg-red-500 text-white" type='submit'>Get Guest User Credentials</button>
      </form>

    </div>
  )
}

export default Login