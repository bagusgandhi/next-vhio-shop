"use client"
import React from 'react'
// import { useFormState } from 'react-dom';
import { toast } from 'react-hot-toast';
import { signIn } from 'next-auth/react';
// import { redirect } from 'next/dist/server/api-utils';
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

type InputsSignIn = {
    email: string
    password: string
}

const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(255),
});

type SignInSchemaType = z.infer<typeof SignInSchema>;

export default function FormLogin() {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<InputsSignIn>({ resolver: zodResolver(SignInSchema) })

    const onSubmit: SubmitHandler<InputsSignIn> = (data) => {
        signIn("cred-email-password", { ...data, redirect: false })
            .then(({ ok, error }: any) => {
                if (ok) {
                    router.push("/products")
                } else {
                    if (error instanceof Error) {
                        toast.error(error?.message);
                    } else {
                        toast.error('Something went wrong!');
                    }
                }
            })
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6 pb-6">
                <h1 className="text-2xl font-bold text-center text-purple-900">Vhio Shop</h1>
                <input {...register("email", { required: true })} name='email' defaultValue={''} type="email" placeholder="Email" className="input input-bordered w-full" />
                {errors.email && <span className='text-error text-xs'>{errors.email.message}</span>}
                <input {...register("password", { required: true })} name='password' defaultValue={''} type="password" placeholder="Password" className="input input-bordered w-full" />
                {errors.password && <span className='text-error text-xs'>{errors.password.message}</span>}

                <button type="submit" className="btn btn-primary">Log In</button>
            </form>
        </>
    )
}
