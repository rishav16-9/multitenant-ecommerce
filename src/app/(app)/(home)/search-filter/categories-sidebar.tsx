import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { CategoriesGetManyOutput } from "@/modules/categories/types";

interface CategoriesSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CategoriesSidebar = ({
  open,
  onOpenChange,
}: CategoriesSidebarProps) => {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.categories.getMany.queryOptions());
  const router = useRouter();
  const [parentCategories, setParentCategories] =
    useState<CategoriesGetManyOutput | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<
    CategoriesGetManyOutput[1] | null
  >(null);

  //if we have parentCategories, show those, or show root categories
  const currentCategories = parentCategories || data || [];

  const handleBackClick = () => {
    if (parentCategories) {
      setParentCategories(null);
      setSelectedCategories(null);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setParentCategories(null);
    setParentCategories(null);
    onOpenChange(open);
  };

  const handleCategoryClick = (category: CategoriesGetManyOutput[1]) => {
    if (category.subCategories && category.subCategories.length > 0) {
      setParentCategories(category.subCategories as CategoriesGetManyOutput);
      setSelectedCategories(category);
    } else {
      //this is a leaf category (no subcategories)
      if (parentCategories && selectedCategories) {
        //this is a sub-category navgate to /category/subCategory
        router.push(`/${selectedCategories.slug}/${category.slug}`);
      } else {
        // this is main category - navigate to cateogry
        if (category.slug === "all") {
          router.push("/");
        } else {
          router.push(`${category.slug}`);
        }
      }
      handleOpenChange(false);
    }
  };

  const backgroundColor = selectedCategories?.color || "white";
  return (
    <Sheet onOpenChange={handleOpenChange} open={open}>
      <SheetContent
        side="left"
        className="p-0 trnasition-none"
        style={{ backgroundColor }}
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {parentCategories && (
            <button
              onClick={() => handleBackClick()}
              className="w-full text-left p-4 text-base font-medium flex items-center hover:bg-black hover:text-white"
            >
              <ChevronLeftIcon className="size-4 mr-2" />
              Back
            </button>
          )}
          {currentCategories.map((category) => (
            <button
              className="w-full cursor-pointer text-left p-4 text-base font-medium flex justify-between items-center hover:bg-black hover:text-white"
              key={category.slug}
              onClick={() => {
                handleCategoryClick(category);
              }}
            >
              {category.name}
              {category.subCategories && category.subCategories.length > 0 && (
                <ChevronRightIcon className="size-4" />
              )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
