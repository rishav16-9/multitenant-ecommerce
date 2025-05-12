import { Category } from "@/payload-types";
import Link from "next/link";
import { CategoriesGetManyOutput } from "@/modules/categories/types";

interface SubCategoryMenuProps {
  category: CategoriesGetManyOutput[1];
  isOpen: boolean;
}
export const SubCategoryMenu = ({ category, isOpen }: SubCategoryMenuProps) => {
  if (!isOpen || !category || category.subCategories?.length === 0) {
    return null;
  }
  const backgroundColor = category.color || "#F5F5F5";
  return (
    <div
      className="absolute z-100"
      style={{
        top: "100%",
        left: 0,
      }}
    >
      {/* Inviible bridge to maintain hover */}
      <div className="h-6 w-60" />
      <div
        className="w-60 text-black overflow-hidden border rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[2px] -translate-y-[2px]"
        style={{ backgroundColor }}
      >
        <div>
          {category.subCategories?.map((subCategory: Category) => (
            <Link
              key={subCategory.slug}
              href={`/${category.slug}/${subCategory.slug}`}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center underline font-medium"
            >
              {subCategory.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
