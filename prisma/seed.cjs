// import { PrismaClient } from '@prisma/client'
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
async function main() {

  const product1 = await prisma.product.create({
    data: {
      title: "Rose Bouquet Glamorous",
      price: 200000,
      image: "https://asset-3.tstatic.net/jualbeli/img/2023/9/2725908/3-1364044587-Buket-Snack-Wisuda-Jogja.jpg"
    },
  })

  const product2 = await prisma.product.create({
    data: {
      title: "Rose Cream Bouquet",
      price: 225000,
      image: "https://images.tokopedia.net/img/cache/700/VqbcmM/2023/10/13/98eb8809-01a1-4281-953f-b4e11f2c3d53.jpg"
    },
  })

  const product3 = await prisma.product.create({
    data: {
      title: "Snack Bouquet",
      price: 175000,
      image: "https://images.tokopedia.net/img/cache/700/VqbcmM/2021/2/4/7ffeb95a-7be7-472b-b3ac-b16fb0b45c88.jpg"
    },
  })

  console.log({ product1, product2, product3 })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })