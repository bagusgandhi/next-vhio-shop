"use client"
import { Product } from '@/store/useCartStore';
import React from 'react';
import { useCartStore } from '@/store/useCartStore';


export default function UpdateCart({ data }: { data: Product }) {
    const { decrease, addToCart } = useCartStore()

    return (
        <div className="flex flex-row rounded-md font-bold items-center text-md lg:text-md ">
            <button onClick={() => decrease(data)} className="lg:p-2 px-4 cursor-pointer">-</button>
            <p className="py-2 text-center ">
                {data.quantity}</p>
            <button onClick={() => addToCart(data)}  className="lg:p-2 px-4 cursor-pointer">+</button>
        </div>
    )
}
