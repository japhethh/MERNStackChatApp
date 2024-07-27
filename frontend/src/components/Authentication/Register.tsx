import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from 'zod';

// Custom validation for file upload
const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
  .refine((file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type), "Only JPEG, PNG, and GIF files are allowed");

const schema = z.object({
  name: z.string().min(12, "Name must contain at least 12 characters"),
  email: z.string().email().min(12, "Email must contain at least 12 characters").trim(),
  password: z.string().min(12, "Password must contain at least 12 characters").max(15).trim(),
  confirmpassword: z.string().min(12, "Confirmpassword must contain at least 12 characters").trim(),
  image: z.any().refine(file => file instanceof File, "File is required").optional()
});

type FormField = z.infer<typeof schema>;

const Register = () => {
  const [show, setShow] = useState<boolean>(false);

  const { handleSubmit, register, formState: { errors } } = useForm<FormField>({
    resolver: zodResolver(schema)
  });

  const onSubmit: SubmitHandler<FormField> = async (data) => {
    console.log(data);
  }

  const handleClick = () => setShow(!show);

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

        <label htmlFor="image">Profile Picture</label>
        <input id="image" type="file" className="input input-bordered join-item" {...register("image")} />
        {errors.image && (
          <span className="text-red-500">
            {errors.image.message}
          </span>
        )}

        <button className="btn w-full bg-blue-500 text-white mx-auto " type='submit'>Register</button>
      </form>
    </div>
  )
}

export default Register;
