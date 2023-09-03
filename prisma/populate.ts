import { faker } from "@faker-js/faker"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
export function createRandomProducts(createdById: string) {
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    userId: createdById,
  }
}

async function main() {
  const PRODUCTS = [] as ReturnType<typeof createRandomProducts>[]
  Array.from({ length: 100 }).forEach(() => {
    PRODUCTS.push(createRandomProducts("cllz5ogy40000bj6c0xn8r50u"))
  })
  const data = PRODUCTS.map((product) => ({ ...product }))
  
  console.log(data)
  await prisma.product.createMany({
    data: data,
  })
}

main()
  .then(async () => {
    console.log("Seeded products")

    await prisma.$disconnect()

    console.log("Disconnected from database")
  })
  .catch(async () => {
    await prisma.$disconnect()
    process.exit(1)
  })
