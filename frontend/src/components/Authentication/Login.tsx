import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from 'zod';




const schema = z.object({
  email: z.string().email().min(12, "Email must contain at least 12 characters").trim(),
  password: z.string().min(12, "Password must contain at least 12 characters").
    max(15).trim()
})

type FormField = z.infer<typeof schema>;

const Login = () => {
  interface Data {
    email: string;
    password: string;
  }

  const { handleSubmit, register, formState: { errors } } = useForm<FormField>(
    { resolver: zodResolver(schema) }
  );

  const onSubmit: SubmitHandler<Data> = async (data) => {
    // try {

    // } catch (error) {

    // }
    console.log(data)
  }


  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" {...register("email")} />
        {errors.email && (
          <span className="text-red-500">
            {errors.email.message}
          </span>
        )}
        <input type="text" {...register("password")} />
        {errors.password && (
          <span className="text-red-500">
            {errors.password.message}
          </span>
        )}

        <button type='submit'>Login</button>
      </form>

    </div>
  )
}

export default Login