import { Suspense } from "react";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { SearchFilter, SearchFilterSkeleton } from "./search-filter";

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  const queryCient = getQueryClient();
  void queryCient.prefetchQuery(trpc.categories.getMany.queryOptions());
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <HydrationBoundary state={dehydrate(queryCient)}>
        <Suspense fallback={<SearchFilterSkeleton />}>
          <SearchFilter />
        </Suspense>
      </HydrationBoundary>
      <div className="flex-1 bg-[#F4F4F0]">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
