import { getServerSession } from 'next-auth'
import { formatter } from '@/common/currencyFormat';
import { findAllOrderByUserId } from '@/actions/order';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default async function page({ params }: { params: { invoice: string } }) {
  const session = await getServerSession();
  const orderData = await findAllOrderByUserId(session?.user?.email!, params.invoice[0]);

  console.log(orderData);

  if (!orderData) {
    return redirect('/orders')
  }

  return (
    <>
      <div className='flex flex-col lg:flex-row items-center justify-between lg:mx-auto px-4 '>
        <div className="lg:w-1/2 w-full">
          <h3 className="font-bold text-2xl">Invoice</h3>
          <p className="text-xl">{orderData.invoice}</p>
        </div>
        <div className="rounded-lg p-6 w-full border-2 border-gray-400">
          <span className='rounded text-center'>
            {
              orderData.payment.expiry_time > Date.now() && orderData.payment.transaction_status === "pending"
                ? (
                  <Link href={`/payment/${orderData.invoice}`} className='w-full btn btn-sm bg-gray-800 text-white'>Pay Now!</Link>
                )
                : orderData.payment.transaction_status === 'settlement' || orderData.payment.transaction_status === 'capture'
                  ? (<p className="font-bold text-center text-success">Payment success!.</p>)
                  : (<p className="font-bold text-error">This payment has been expired.</p>)
            }
          </span>
        </div>
      </div>
      <div>
        <table className="min-w-full divide-y divide-gray-200 table">
          <thead>
            <tr className="lg:bg-grey-secondary-50">
              <th className="lg:hidden">
                <p className="font-bold text-sm">Order Deails</p>
              </th>
              <th
                className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <p className="font-bold text-sm">Order Deails</p>
              </th>
              <th
                className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <p className="font-bold text-sm text-center">QTY</p>
              </th>
              <th
                className="hidden lg:table-cell px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                <p className="font-bold text-sm text-center">Subtotal</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {orderData.orderProduct.map((item: any, index: number) => (
              <tr key={index}>
                <td className="lg:table-cell px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-row items-center gap-4">
                    <div className="w-24 lg:w-14">
                      <Image
                        className="h-24 lg:h-14 mx-auto"
                        src={item.product.image}
                        width={500}
                        height={500}
                        alt={item.product.title}
                      />
                    </div>
                    <div className="lg:hidden">
                      <p className="text-primary">{item.product.title}</p>
                      <p className="text-gray-600">Items: {item.qty}</p>
                      <p className="text-pink-primary font-bold">
                        {formatter.format(item.total_price)}
                      </p>
                    </div>
                    <p className="hidden lg:block">{item.product.title}</p>

                  </div>
                </td>
                <td className="hidden lg:table-cell">
                  <p className="text-center">{item.qty}</p>
                </td>
                <td className="hidden lg:table-cell">
                  <p className="text-center">{formatter.format(item.total_price)}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='flex bg-primary p-4 w-full rounded justify-between items-center text-white'>
          <p>Total</p>
          <p className="text-center font-bold">
            {formatter.format(orderData.total)}</p>
        </div>

        {orderData.payment.transaction_status === "settlement" || orderData.payment.transaction_status === "capture" ? (
          <div className="pt-6 bg-success text-white">
            <h4 className="font-bold px-2 text-green">Detail Payment</h4>
            <table className="min-w-full table">
              <tbody>
                <tr>
                  <td>
                    <p className="font-bold">VA Number: {orderData.payment.va_number}</p>
                    <p>at {orderData.payment.transaction_time.toLocaleString()}</p>
                  </td>
                  <td>
                    <p className="text-right font-bold">Bank {orderData.payment.bank}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (<></>)}

      </div>
    </>
  )
}
