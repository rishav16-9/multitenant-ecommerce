import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Category } from "@/payload-types";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.find({
      collection: "categories",
      depth: 1, // Populate subcategories, subcategories.[0] will be type of category
      pagination: false,
      where: {
        parent: {
          exists: false,
        },
      },
      sort: "name",
    });

    const formattedData = data.docs.map((doc) => ({
      ...doc,
      subCategories: (doc.subCategories?.docs ?? []).map((doc) => ({
        //because depth 1 we are confident doc wil be type of category
        ...(doc as Category),
      })),
    }));
    return formattedData;
  }),
});
