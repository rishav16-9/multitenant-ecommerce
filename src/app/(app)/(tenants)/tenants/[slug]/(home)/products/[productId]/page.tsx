import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ProductView } from "@/modules/products/ui/views/product-view";

interface PageProps {
  params: Promise<{ slug: string; productId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { slug, productId } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getOne.queryOptions({
      id: productId,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductView tenantSlug={slug} productId={productId} />
    </HydrationBoundary>
  );
};

export default Page;
