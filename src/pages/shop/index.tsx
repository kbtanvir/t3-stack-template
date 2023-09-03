import { Button } from "@/components/ui/button";
import { useProductQuery } from "@/hooks/query"



export default function ShopPage() {
  const query = useProductQuery()

  return (
    <div className="container">
      <Button className="mb-20">Create products</Button>

      <ProductsList query={query} />
    </div>
  )
}

function ProductsList({
  query,
}: {
  query: ReturnType<typeof useProductQuery>
}) {
  if (query.error) {
    return <div>{query.error.message}</div>
  }

  if (query.isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-full grid grid-cols-3 gap-4">
      {query.data.products.map((item) =>
        item ? (
          <>
            <div key={item.id}>
              <div>{item.title}</div>
              <div>{item.price}</div>
              <div>{item.description}</div>
            </div>
          </>
        ) : null
      )}
    </div>
  )
}