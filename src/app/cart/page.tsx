"use client"
import React from 'react'
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';
import Image from 'next/image';
import TrashIcon from '../../../public/trash.svg';
import UpdateCart from '@/components/Button/UpdateCart';
import { formatter } from '@/common/currencyFormat';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { paymentBank } from '@/common/constants/bank';
import { orderType, submitOrder } from '@/actions/order';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

type InputsPaymentBank = {
  bank: "bca" | "bri" | "bni"
}

export default function page() {
  const { totalItems, totalPrice, cart, removeFromCart, clearCart } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { isLoading }
  } = useForm<InputsPaymentBank>({
    defaultValues: {
      bank: 'bca',
    },
  });

  const onSubmit: SubmitHandler<InputsPaymentBank> = async (data) => {
    try {
      const orderData: orderType = {
        total: totalPrice,
        email: session?.user?.email!,
        cart
      }

      const user = {
        email: session?.user?.email!,
        name: session?.user?.name!
      }
      const response = await submitOrder(orderData, user, data.bank)

      clearCart();

      console.log(response);
      router.push(`/payment/${response}`)

      return response;

    } catch (error: unknown) {
      toast.error('Something went wrong!');
    }
  }

  return (
    <>
      {!totalItems ? (
        <div className="text-center bg-grey-secondary-50 rounded-md p-10 h-screen flex flex-col gap-2">
          <h3 className="font-bold text-xl">Your Cart is Empty</h3>
          <p>Your shopping cart is currently empty. It's time to start shopping!</p>
          <Link href={'/products'}>
            <button className="btn btn-sm btn-primary rounded-lg font-bold text-white text-md ">Shop
              Now!</button>
          </Link>
        </div>
      ) : (
        <div className='px-4'>
          <h3 className="text-grey pb-4 hidden lg:block">All product inside your cart</h3>
          <div className='pb-16'>
            <table className="min-w-full divide-y divide-gray-200 table">
              <thead>
                <tr className="border-b-primary">
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <p className="font-bold text-sm lg:hidden">Cart List</p>
                  </th>
                  <th
                    className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <p className="font-bold text-sm">Products</p>
                  </th>
                  <th
                    className="hidden lg:table-cell px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <p className="font-bold text-sm">Price</p>
                  </th>
                  <th
                    className="hidden lg:table-cell px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <p className="font-bold text-sm">QTY</p>
                  </th>
                  <th
                    className="hidden lg:table-cell px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <p className="font-bold text-sm">Total Price</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={index}>
                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap lg:w-1/12">
                      <span onClick={() => removeFromCart(item)} className="p-2 hover:text-error cursor-pointer hidden lg:block">
                        <Image
                          priority
                          src={TrashIcon}
                          alt="cart item"
                        />
                      </span>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                      <div
                        className="flex gap-4 items-center">
                        <span>
                          <Image
                            className='h-20'
                            src={item.image}
                            alt={item.title}
                            width={'100'}
                            height={'100'}
                          />
                        </span>
                        <span className="col-span-2">{item.title}</span>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-center">
                      <p>{formatter.format(item.price)}</p>
                    </td>
                    <td className="relative lg:table-cell">
                      <div className="lg:hidden grid grid-cols-3 gap-4 items-center">
                        <div className='col-span-2 flex items-center gap-2'>
                          <Image
                            className='h-20'
                            src={item.image}
                            alt={item.title}
                            width={'100'}
                            height={'100'}
                          />
                          <span className="text-sm">
                            <p>{item.title}</p>
                            <p className='font-bold pt-1'>{formatter.format(item.price)}</p>
                          </span>
                        </div>
                        <UpdateCart data={item} />
                        <span onClick={() => removeFromCart(item)} className="p-2 hover:text-error bg-red-100 rounded text-shite col-span-3 mb-4  cursor-pointer">
                          <Image
                            priority
                            src={TrashIcon}
                            alt="cart item"
                          />
                        </span>
                      </div>
                      <div className='hidden lg:block'>
                        <UpdateCart data={item} />
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-center">
                      {formatter.format(item.price * item.quantity!)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="lg:p-4 py-4 flex lg:block items-center justify-between lg:w-1/3 ml-auto rounded">
              <div className="flex flex-row items-center justify-between gap-4">
                <p className="lg:text-xl">Total: </p>
                <p className="lg:text-2xl text-xl font-bold pr-2">{formatter.format(totalPrice)}</p>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} >
              <h3 className="font-semibold lg:pb-4">Select Payment</h3>
              <div className="my-6 flex flex-col gap-4">
                {paymentBank.map((item, index) => (
                  <label key={index} className="px-4 rounded-md border-2 border-primary label cursor-pointer flex flex-row gap-4">
                    <span className="flex items-center gap-4">
                      <Image
                        priority
                        src={item.image}
                        alt={item.name}
                        width={32}
                        height={32}
                      />
                    </span>
                    <input {...register("bank", { required: true })} type="radio" className="radio radio-primary" value={item.name} />
                  </label>
                ))}
              </div>

              <button type="submit" disabled={isLoading} className="btn btn-md bg-gray-800 text-white rounded-lg w-full">
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    Pay Now
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  )
}
