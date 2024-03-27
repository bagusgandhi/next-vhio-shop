import { findAllOrderByUserId } from '@/actions/order'
import { getServerSession } from 'next-auth'
import { formatter } from '@/common/currencyFormat';
import Link from 'next/link';

export default async function page() {
  const session = await getServerSession();
  const orderData = await findAllOrderByUserId(session?.user?.email!);

  console.log()

  return (
    <>
      <h3 className="text-grey pb-4 hidden lg:block">Your Order History</h3>
      <table className='min-w-full divide-y divide-gray-200 table'>
        <thead>
          <tr className="border-b-primary">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <p className="font-bold text-sm lg:hidden"> Order History List</p>
            </th>
            <th
              className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <p className="font-bold text-sm">Invoice</p>
            </th>
            <th
              className="hidden md:table-cell px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              <p className="font-bold text-sm">Total</p>
            </th>
            <th
              className="hidden md:table-cell px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              <p className="font-bold text-sm">Payment Status</p>
            </th>
            <th
              className="hidden md:table-cell px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              <p className="font-bold text-sm">Date</p>
            </th>
          </tr>
        </thead>
        <tbody>
          {orderData ? orderData.map((item: any, index: number) => (
            <>
              <tr key={index}>
                <td className='lg:hidden w-full'>
                  <div className='flex items-center justify-between'>
                    <span className="flex gap-2 ">
                      {index + 1}
                      <div>
                        <Link className="items-center" href={`orders/${item.invoice}`}>
                          <p className="text-primary font-bold">{item.invoice}</p>
                        </Link>
                        <p className="text-gray">{item.payment?.transaction_status}</p>
                        <p className="text-gray text-sm text-gray">{item.payment?.transaction_time.toLocaleString()}</p>
                      </div>
                    </span>
                    <p>{formatter.format(item.total)}</p>
                  </div>
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap lg:w-1/12">
                  <span className="p-2 hover:text-error cursor-pointer hidden lg:block">
                    {index + 1}
                  </span>
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                  <Link className="grid grid-cols-4  items-center" href={`orders/${item.invoice}`}>
                    <span className="col-span-2 hover:text-primary">{item.invoice}</span>
                  </Link>
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-center">
                  <p>{formatter.format(item.total)}</p>
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-center">
                  <span className="col-span-2 hover:text-primary">{item.payment?.transaction_status}</span>
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-center">
                  <span className="col-span-2 hover:text-primary">{item.payment?.transaction_time.toLocaleString()}</span>
                </td>
              </tr>
            </>)) : <p> Data not found</p>}
        </tbody>
      </table>
    </>
  )
}
