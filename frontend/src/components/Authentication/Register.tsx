import React, { useContext, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from 'zod';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'

// Define the validation schema
const schema = z.object({
  name: z.string().min(3, "Name must contain at least 3 characters"),
  email: z.string().email("Invalid email format").min(5, "Email must contain at least 5 characters").trim(),
  password: z.string().min(8, "Password must contain at least 8 characters").max(15, "Password can contain a maximum of 15 characters").trim(),
  confirmpassword: z.string().min(8, "Confirm password must contain at least 8 characters").trim(),
  image: z
    .instanceof(File)
    .optional() // Make optional if not required
});

type FormField = z.infer<typeof schema>;

const Register = () => {
  const [show, setShow] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null); // State for the image preview
  const imageRef = React.useRef<HTMLInputElement | null>(null); // Ref for the file input
  const [loading, setLoading] = useState<boolean>(false)
  const context = useContext(UserContext);
  const navigate = useNavigate();
  if (!context) {
    return null;
  }

  const { apiURL } = context;

  const { handleSubmit, register, formState: { errors }, setValue } = useForm<FormField>({
    resolver: zodResolver(schema)
  });

  const onSubmit: SubmitHandler<FormField> = async (data) => {
    setLoading(true)
    console.log(data);
    if (!data.name || !data.email || !data.password || !data.confirmpassword) {
      toast.error("Please Fill all the field");
      return;
    }


    if (data.password !== data.confirmpassword) {
      toast.error("Passwords Do not Match")
      return;
    }
    // Retrieve the file from the ref
    const fileInput = imageRef.current;
    if (fileInput?.files?.[0]) {
      data.image = fileInput.files[0];
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmpassword", data.confirmpassword);

    if (data.image) {
      formData.append("image", data.image);
    }

    try {
      const response = await axios.post(`${apiURL}/api/user/`, formData);
      if (response.data.success) {
        navigate("/chats")
        console.log(response);
        toast.success("Successfully Register")
        setLoading(false)
        localStorage.setItem("userInfo", JSON.stringify(response.data.data))
      }

    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message)
      }
      console.log(error);
    }
  };

  const handleClick = () => setShow(!show);

  // Update preview when image file is selected
  const handleImagePreview = () => {
    const fileInput = imageRef.current;
    if (fileInput?.files?.[0]) {
      const file = fileInput.files[0];
      setPreview(URL.createObjectURL(file)); // Update the preview state with the file URL
    }
  };

  return (
    <div>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Name <span className="text-red-500 font-semibold">*</span></label>
        <input id="name" type="text" className="input input-bordered join-item" placeholder="Name" {...register("name")} />
        {errors.name && (
          <span className="text-red-500">
            {errors.name.message}
          </span>
        )}

        <label htmlFor="email">Email <span className="text-red-500 font-semibold">*</span></label>
        <input id="email" type="text" className="input input-bordered join-item" placeholder="Email" {...register("email")} />
        {errors.email && (
          <span className="text-red-500">
            {errors.email.message}
          </span>
        )}

        <label htmlFor="password">Password <span className="text-red-500 font-semibold">*</span></label>
        <div className="join w-auto">
          <input id="password" type={show ? "text" : "password"} className="input input-bordered join-item w-5/6" placeholder="Password" {...register("password")} />
          <div className="btn join-item rounded-r-full" onClick={handleClick}>{show ? "Hide" : "Show"}</div>
        </div>
        {errors.password && (
          <span className="text-red-500">
            {errors.password.message}
          </span>
        )}

        <label htmlFor="confirmpassword">Confirm Password <span className="text-red-500 font-semibold">*</span></label>
        <input id="confirmpassword" type="password" className="input input-bordered join-item" placeholder="Confirm Password" {...register("confirmpassword")} />
        {errors.confirmpassword && (
          <span className="text-red-500">
            {errors.confirmpassword.message}
          </span>
        )}

        <label htmlFor="image">Profile Picture</label>
        <div className="shrink-0">
          <img
            className="h-16 w-16 object-cover rounded-full"
            src={preview || "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1361&q=80"} // Show preview or default image
            alt="Current profile photo"
          />
        </div>
        <label className="block">
          <span className="sr-only">Choose profile photo</span>
          <input
            id="image"
            type="file"
            className="block w-full text-sm text-slate-500 
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
            {...register("image")}
            ref={imageRef} // Use ref to access the file input
            onChange={handleImagePreview} // Update preview on change
          />
        </label>
        {errors.image && (
          <span className="text-red-500">
            {errors.image.message}
          </span>
        )}

        <button className="btn w-full bg-blue-500 text-white mx-auto" type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
