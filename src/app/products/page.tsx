import { findAll } from "@/actions/product";
import Image from 'next/image';
import AddToCart from "@/components/Button/AddToCart";
import { formatter } from '@/common/currencyFormat';

export default async function page() {
  const products = await findAll();

  return (
    <div className="grid grid-cols-2  lg:grid-cols-4 sm:gap-4 gap-2 lg:gap-8 items-center px-4 lg:px-8 pb-16">
      {products.map((item, index) => (
        <div key={index} className="card w-full bg-base-100 shadow-md mb-8">
          <figure>
            <Image
              src={item.image}
              width={500}
              height={500}
              alt={item.title}
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-center text-sm justify-center">{item.title}</h2>
            <p className="text-sm text-center">{formatter.format(item.price)}</p>
            <div className="card-actions justify-center">
              <AddToCart data={{
                id: item.id,
                title: item.title,
                price: item.price,
                image: item.image
              }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
