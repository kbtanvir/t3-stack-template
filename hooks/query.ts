import { api } from "~/utils/api"

export type QueryParams = {
  sort: "newest" | "top" | "oldest"
  time: "day" | "week"
}

export function useProductQuery(
  params: QueryParams = {
    sort: "newest",
    time: "week",
  }
) {
  return api.product.getAll.useQuery(
    {
      sort: params.sort,
      time: params.time,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  )
}
