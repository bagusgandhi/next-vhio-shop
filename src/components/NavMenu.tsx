"use client"
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useCartStore } from '@/store/useCartStore';
import Image from "next/image";
import CartIcon from '../../public/cart.svg';
import OptionIcon from '../../public/dot.svg';
import MenuIcon from '../../public/menu.svg';


import { formatter } from "@/common/currencyFormat";

export default function AuthMenu() {
    const { data: session } = useSession();
    const { totalItems, totalPrice, clearCart } = useCartStore()

    const handleSignOut = () => {
        clearCart();
        signOut({ callbackUrl: '/auth' });
    }

    return (
        <>
            <div className=" navbar flex items-center justify-between py-4 border-b-2 border-primary mb-8 lg:mb-16">

                {/* mobile */}
                <div className="lg:hidden">
                    <div className="dropdown dropdown-start">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                            <Image
                                priority
                                src={MenuIcon}
                                alt="menu"
                                width={28}
                                height={28}
                            />
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li>
                                <Link href={'/products'}>Products</Link>
                            </li>
                            <li>
                                <Link href={'/orders'}>History Order</Link>
                            </li>

                            {session && session.user?.name ? (
                                <li>
                                    <button onClick={() => handleSignOut()}>SIgn Out</button>
                                </li>
                            ) : (<>
                                <li>
                                    <Link href={'/auth'}>Sign In</Link>
                                </li>
                            </>)}

                        </ul>
                    </div>
                </div>

                {/* mobile */}
                <div className="lg:hidden">
                    <Link href={'/products'}>
                        <h1 className="text-2xl font-bold text-center text-purple-900">Vhio Shop</h1>
                    </Link>
                </div>



                {/* desktop view */}
                <div className="hidden lg:flex gap-10 items-center">
                    <Link href={'/products'}>
                        <h1 className="text-2xl font-bold text-center text-purple-900">Vhio Shop</h1>
                    </Link>
                    <Link href={'/orders'}>
                        <h1 className="text-center text-purple-900 hover:text-black">History Order</h1>
                    </Link>
                </div>

                <div className="flex lg:gap-4 items-center justify-between  lg:w-fit">
                    {/* cart info */}
                    <div className="dropdown dropdown-hover dropdown-end z-20">
                        <label className="btn m-1 btn-secondary btn-circle lg:bg-grey-secondary-50 btn-outline">
                            <div className="indicator">
                                <Image
                                    priority
                                    src={CartIcon}
                                    alt="cart item"
                                />
                                <span
                                    className="badge badge-sm indicator-item h-4 w-4 p-2 bg-primary text-white">
                                    {totalItems}
                                </span>
                            </div>
                        </label>
                        <div className="card card-compact dropdown-content w-52 bg-white shadow">
                            <div className="card-body">
                                <span className="font-bold text-lg">{totalItems} items</span>
                                <span className="text-slate-400">Total: {formatter.format(totalPrice)}</span>
                                <Link href={'/cart'}>
                                    <div className="card-actions">
                                        <button className="btn btn-primary btn-block text-white">View cart</button>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>



                    {session && session.user?.name ? (
                        <div className="lg:flex hidden items-center gap-4">
                            <p>Hi, {session.user?.name}</p>

                            <div className="dropdown dropdown-end" >
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle border-1 border-gray-400">
                                    <Image
                                        priority
                                        src={OptionIcon}
                                        alt="options"
                                    />
                                </div>
                                <ul tabIndex={0} role="button" className=" dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-lg w-52">
                                    <li className="hover:bg-error hover:text-white p-2 rounded-lg text-sm" onClick={() => handleSignOut()}>Sign Out</li>
                                </ul>
                            </div>

                        </div>
                    ) : (<>
                        <Link href={'/auth'} className="hidden lg:block">
                            <h1 className="text-center text-purple-900 hover:text-black">Sign In</h1>
                        </Link>
                    </>)}
                </div>

                {/* mobile view */}

            </div>
        </>
    )
}