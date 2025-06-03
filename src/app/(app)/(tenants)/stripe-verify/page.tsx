"use client";

import { useEffect } from "react";
import { useTRPC } from "@/trpc/client";
import { LoaderIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

const Page = () => {
  const trpc = useTRPC();
  const { mutate: verify } = useMutation(
    trpc.checkout.verify.mutationOptions({
      onSuccess: (data) => {
        console.log({ data });
        window.location.href = data.url;
      },
      onError: () => {
        window.location.href = "/";
      },
    })
  );

  useEffect(() => {
    console.log("in page");
    verify();
  }, [verify]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoaderIcon className="animate-spin text-muted-foreground" />
    </div>
  );
};

export default Page;
