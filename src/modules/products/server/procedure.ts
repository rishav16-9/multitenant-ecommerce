import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import type { Where } from "payload";
import { z } from "zod";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxprice: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};
      if (input.minPrice && input.maxprice) {
        where.price = {
          greater_than_equal: input.minPrice,
          less_than_equal: input.maxprice,
        };
      } else if (input.minPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
        };
      } else if (input.maxprice) {
        where.price = {
          ...where.price,
          less_than_equal: input.maxprice,
        };
      }
      if (input.category) {
        const categoriesData = await ctx.db.find({
          collection: "categories",
          limit: 1,
          depth: 1, // Populate subcategories, subcategories.[0] will be type of category
          pagination: false,
          where: {
            slug: { equals: input.category },
          },
        });
        const formattedData = categoriesData.docs.map((doc) => ({
          ...doc,
          subCategories: (doc.subCategories?.docs ?? []).map((doc) => ({
            //because depth 1 we are confident doc wil be type of category
            ...(doc as Category),
            subCategory: undefined,
          })),
        }));
        const subcategoriesSlug = [];
        const parentCategory = formattedData[0];
        if (parentCategory) {
          subcategoriesSlug.push(
            ...parentCategory.subCategories.map(
              (subcategory) => subcategory.slug
            )
          );
          where["category.slug"] = {
            in: [parentCategory.slug, ...subcategoriesSlug],
          };
        }
      }
      const data = await ctx.db.find({
        collection: "products",
        depth: 1, //Poulate catetories and image
        where,
      });

      return data;
    }),
});
