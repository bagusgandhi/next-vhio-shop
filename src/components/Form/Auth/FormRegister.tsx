"use client"
import React from 'react'
import { toast } from 'react-hot-toast';
import { useForm, SubmitHandler } from "react-hook-form";
import { signUp } from '@/actions/auth';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type InputsSignUp = {
    name: string
    email: string
    password: string
}

const SignUpSchema = z.object({
    name: z.string().min(3).max(255),
    email: z.string().email(),
    password: z.string().min(8).max(255),
});

type SignUpSchemaType = z.infer<typeof SignUpSchema>;

const onSubmit: SubmitHandler<InputsSignUp> = async (data) => {
    try {
        await signUp(data);
    } catch (error: unknown) {
        if (error instanceof Error) {
            toast.error(error?.message);
        } else {
            toast.error('Something went wrong!');
        }
    }
}

export default function FormRegister() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<InputsSignUp>({ resolver: zodResolver(SignUpSchema) })

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6">
                <h1 className="text-2xl font-bold text-center text-purple-900">Vhio Shop</h1>
                <input {...register("name", { required: true })}  name='name' type="text" placeholder="Name" className="input input-bordered w-full" />
                {errors.name && <span className='text-error text-xs'>{errors.name.message}</span>}

                <input {...register("email", { required: true })}  name='email' type="email" placeholder="Email" className="input input-bordered w-full" />
                {errors.email && <span className='text-error text-xs'>{errors.email.message}</span>}
                
                <input {...register("password", { required: true })}  name='password' type="password" placeholder="Password" className="input input-bordered w-full" />
                {errors.password && <span className='text-error text-xs'>{errors.password.message}</span>}
                
                <button type='submit' className="btn btn-primary">Register</button>
            </form>
        </>
    )
}
