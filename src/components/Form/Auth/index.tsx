"use client"
import React, { useState } from 'react'
import FormLogin from './FormLogin';
import FormRegister from './FormRegister';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
import { useEffect } from "react";
import Image from 'next/image';
import GoogleIcon from '../../../../public/google.svg';

export default function FormAuth() {
  const [showLogin, setShowLogin] = useState<boolean>(true);
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams?.get("error") === "Acount may have registered without google sign in") {
      toast.error('Acount may have registered without google sign in')
    } else if (searchParams?.get("error") === "OAuthSignin") {
      toast.error('Something went wrong!')
    }
  }, [])

  const handleLOginWIthGoogle = () => {
    signIn('google', { callbackUrl: '/products' });
  }

  return (
    <div>
      {showLogin ? (
        <>
          <FormLogin />
          <p className='text-sm text-center w-full py-4'>Don't have account? <button className='text-purple-600 font-bold' onClick={() => setShowLogin(false)}>Create an account</button></p>
          <p className='text-center text-gray-400'>or</p><br />
          <button onClick={handleLOginWIthGoogle} className='btn btn-small bg-white w-full border-1 border-gray-400'>
            <Image
              priority
              src={GoogleIcon}
              alt="google icon"
              width={32}
              height={32}
            />
            Login with Google
          </button>
        </>
      ) : (
        <>
          <FormRegister />
          <p className='text-sm text-center w-full py-4'>Alreasy have an account? <button className='text-purple-600 font-bold' onClick={() => setShowLogin(true)}>Sign in</button></p>
        </>
      )}
    </div>
  )
}
