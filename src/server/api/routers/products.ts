import { type Prisma } from "@prisma/client"
import { type inferAsyncReturnType } from "@trpc/server"
import { z } from "zod"
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  type createTRPCContext,
} from "~/server/api/trpc"

export const productRouter = createTRPCRouter({
  infiniteProfileFeed: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(async ({ input: { limit = 10, userId, cursor }, ctx }) => {
      return await getInfiniteproducts({
        limit,
        ctx,
        cursor,
        whereClause: { userId },
      })
    }),
  infiniteFeed: publicProcedure
    .input(
      z.object({
        onlyFollowing: z.boolean().optional(),
        limit: z.number().optional(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).optional(),
      })
    )
    .query(
      async ({ input: { limit = 10, onlyFollowing = false, cursor }, ctx }) => {
        const currentUserId = ctx.session?.user.id
        return await getInfiniteproducts({
          limit,
          ctx,
          cursor,
        })
      }
    ),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        price: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!input.title) {
        throw new Error("Post must have title text")
      }

      const trimmedContent = input.title.trim()

      if (trimmedContent.length === 0) {
        throw new Error("Post must have content text")
      }

      if (trimmedContent.length > 280) {
        throw new Error("Post content must be up to 280 characters")
      }

      const product = await ctx.prisma.product.create({
        data: {
          title: input.title,
          price: input.price,
          userId: ctx.session.user.id,
        },
      })

      void ctx.revalidateSSG?.(`/profiles/${ctx.session.user.id}`)

      return product
    }),
})

async function getInfiniteproducts({
  whereClause,
  ctx,
  limit,
  cursor,
}: {
  whereClause?: Prisma.ProductWhereInput
  limit: number
  cursor: { id: string; createdAt: Date } | undefined
  ctx: inferAsyncReturnType<typeof createTRPCContext>
}) {
  const currentUserId = ctx.session?.user.id

  const data = await ctx.prisma.product.findMany({
    take: limit + 1,
    cursor: cursor ? { createdAt_id: cursor } : undefined,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    where: whereClause,
    select: {
      id: true,
      title: true,
      createdAt: true,

      user: {
        select: { name: true, id: true, image: true },
      },
    },
  })

  let nextCursor: typeof cursor | undefined
  if (data.length > limit) {
    const nextItem = data.pop()
    if (nextItem != null) {
      nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt }
    }
  }

  return {
    products: data.map((product) => {
      return {
        id: product.id,
        title: product.title,
        createdAt: product.createdAt,
      }
    }),
    nextCursor,
  }
}
