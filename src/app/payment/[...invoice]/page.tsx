"use client"
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { findPaymentByInvoice } from '@/actions/payment';
import { formatter } from '@/common/currencyFormat';
import { useRouter } from 'next/navigation';
import io from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { PaymentStatus } from '@prisma/client';

const CountDown = dynamic(() => import('@/components/CountDown'), { ssr: false });

const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'}`);

export default function page({ params }: { params: { invoice: string } }) {
  const [paymentData, setPaymentData] = useState<any>();
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    const onNotif = ({ invoice, transaction_status }: { invoice: string, transaction_status: PaymentStatus }) => {
      console.log(`$Recieved from SERVER :: ${invoice}`, transaction_status);
      router.push(`/orders/${params.invoice[0]}`)
    }

    socket.on(`${params.invoice[0]}`, onNotif);

    const fetchData = async () => {
      const result = await findPaymentByInvoice(session?.data?.user?.email!, params.invoice[0]);

      if (!result) {
        return router.push(`/orders`)
      }

      if (result?.transaction_status != "pending") {
        return router.push(`/orders/${params.invoice[0]}`);
      }

      setPaymentData(result);
    }

    fetchData();

    return () => {
      socket.off(`${params.invoice[0]}`, onNotif);
    };

  }, [])


  return (
    <>
      {paymentData && (
        <div className='h-screen'>
          <div className="flex flex-col justify-center gap-2 p-4 m-4 bg-gray-800 text-white rounded">
            <span className="text-center text-sm">VA Number</span>
            <h4 className="text-center font-bold text-xl">{paymentData.va_number}</h4>
          </div>
          <div className="py-4 text-center text-lg font-bold text-error">
            <p className='text-xs text-gray-700'>Expired in</p>
            <CountDown invoice={params.invoice[0]} expiryTime={new Date(paymentData.expiry_time)} />
          </div>
          <div className="px-4 lg:w-1/3 mx-auto">
            <table className="table w-full bg-white border-2  border-gray-600">
              <tbody>
                <tr>
                  <td>Bank</td>
                  <td>{paymentData.bank}</td>
                </tr>
                <tr>
                  <td>Total</td>
                  <td>{formatter.format(parseInt(paymentData.gross_amount))}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}
