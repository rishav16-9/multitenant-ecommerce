"use client";
import { useEffect } from "react";
import { useTRPC } from "@/trpc/client";
import { useCart } from "../../hooks/use-cart";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { generateTenantUrl } from "@/lib/utils";
import { CheckoutItem } from "../components/checkout-item";
import { CheckoutSidebar } from "../components/checkout-sidebar";
import { InboxIcon, LoaderIcon } from "lucide-react";
import { useCheckoutStates } from "../../hooks/use-checkout-states";
import { useRouter } from "next/navigation";

interface CheckoutViewProps {
  tenantSlug: string;
}

export const CheckoutView = ({ tenantSlug }: CheckoutViewProps) => {
  const { productIds, removeProduct, clearCart } = useCart(tenantSlug);
  const { state, setState } = useCheckoutStates();
  const trpc = useTRPC();
  const router = useRouter();
  const { data, error, isLoading } = useQuery(
    trpc.checkout.getProducts.queryOptions({ ids: productIds })
  );

  const purchase = useMutation(
    trpc.checkout.purchase.mutationOptions({
      onMutate: () => {
        setState({ success: false, cancel: false });
      },
      onSuccess: (data) => {
        window.location.href = data.url;
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          router.push("/sign-in");
        }
        toast.error(error.message);
      },
    })
  );
  useEffect(() => {
    if (state.success) {
      setState({ success: false, cancel: false });
      clearCart();
      // todo: invalidate library
      router.push("/products");
    }
  }, [state.success, clearCart, router, setState]);
  useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      clearCart();
      toast.warning("Inavlid product found, cart cleared");
    }
  }, [error, clearCart]);
  if (isLoading) {
    return (
      <div className="lg:p-16 pt-4 lg:px-12 px-4 ">
        <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
          <LoaderIcon className="text-muted-foreground animate-spin" />
        </div>
      </div>
    );
  }
  if (data?.totalDocs === 0) {
    return (
      <div className="lg:p-16 pt-4 lg:px-12 px-4 ">
        <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
          <InboxIcon />
          <p className="text-base font-medium">No products found</p>
        </div>
      </div>
    );
  }
  return (
    <div className="lg:p-16 pt-4 lg:px-12 px-4 ">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
        <div className="col-span-4">
          <div className="rounded-md bg-white overflow-hidden border">
            {data?.docs.map((product, index) => (
              <CheckoutItem
                key={product.id}
                isLast={index === data?.docs.length - 1}
                imageUrl={product.image?.url}
                name={product.name}
                productUrl={`${generateTenantUrl(product.tenant.slug)}/products/${product.id}`}
                tenantUrl={generateTenantUrl(product.tenant.slug)}
                tenantName={product.tenant.name}
                price={product.price}
                onRemove={() => removeProduct(product.id)}
              />
            ))}
          </div>
        </div>
        <div className="col-span-3">
          <CheckoutSidebar
            total={data?.totalPrice || 0}
            onPurchase={() =>
              purchase.mutate({
                productIds,
                tenantSlug,
              })
            }
            isCanceled={state.cancel}
            disabled={purchase.isPending}
          />
        </div>
      </div>
    </div>
  );
};
