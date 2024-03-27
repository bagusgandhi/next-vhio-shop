"use client"
import toast from 'react-hot-toast';
import React from 'react';
import { Product, useCartStore } from '@/store/useCartStore';

export default function AddToCart({ data }: { data: Product}) {
    const addToCart = useCartStore(state => state.addToCart);

    return (
        <button onClick={() => addToCart(data)} className="btn btn-primary btn-sm">add to cart</button>
    )
}
