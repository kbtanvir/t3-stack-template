import { faker } from "@faker-js/faker"

// export function createRandomUser() {
//   return {
//     id: faker.string.uuid,
//     name: faker.person.lastName,
//     email: faker.internet.email,
//   }
// }

export function createRandomProducts(createdById: string) {
  return {
    id: faker.string.uuid(),
    title: faker.commerce.productName(),
    price: parseFloat(faker.commerce.price()),
    userId: createdById,
  }
}

// export function createRandomImage(postId: string) {
//   return {
//     id: faker.datatype.uuid(),
//     url: `${faker.image.imageUrl()}?random=${Math.round(Math.random() * 500)}`,
//     postId,
//   }
// }
