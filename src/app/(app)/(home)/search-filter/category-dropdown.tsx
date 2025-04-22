"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Category } from "@/payload-types";
import { useRef, useState } from "react";
import { useDropdownPosition } from "./use-dropdown-position";
import { SubCategoryMenu } from "./sub-category-menu";

interface Props {
  category: Category;
  isActive: boolean;
  isNavigationHovered: boolean;
}

export const CategoryDrodown = ({
  category,
  isActive,
  isNavigationHovered,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { getDropdownPosition } = useDropdownPosition(dropdownRef);
  const dropdownPosition = getDropdownPosition();
  const onMouseEnter = () => {
    if (category.subCategories) {
      setIsOpen(true);
    }
  };

  const onMouseLeave = () => {
    if (category.subCategories) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative">
        <Button
          className={cn(
            "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
            isActive && !isNavigationHovered && "bg-white border-primary"
          )}
          variant="elevated"
        >
          {category.name}
        </Button>
        {category.subCategories && category.subCategories.length > 0 && (
          <div
            className={cn(
              "opacity-0 absolute -bottom-3 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-black left-1/2 -translate-x-1/2 ",
              isOpen && "opacity-100"
            )}
          />
        )}
      </div>
      <SubCategoryMenu
        category={category}
        isOpen={isOpen}
        position={dropdownPosition}
      />
    </div>
  );
};
