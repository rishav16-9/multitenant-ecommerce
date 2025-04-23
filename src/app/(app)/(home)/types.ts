import { Category } from "@/payload-types";

export type customCategory = Category & {
  subCategories: Category[];
};
