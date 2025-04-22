import { Category } from "@/payload-types";
import Link from "next/link";

interface SubCategoryMenuProps {
  category: Category;
  isOpen: boolean;
  position: { top: number; left: number };
}
export const SubCategoryMenu = ({
  category,
  isOpen,
  position,
}: SubCategoryMenuProps) => {
  if (!isOpen || !category || category.subCategories?.length === 0) {
    return null;
  }
  const backgroundColor = category.color || "#F5F5F5";
  return (
    <div
      className="fixed z-100"
      style={{
        top: position.top,
        left: position.left,
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
              href="/"
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
