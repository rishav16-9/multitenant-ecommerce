import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      required: true,
      index: true,
    },
    {
      name: "color",
      type: "text",
    },
    {
      name: "parent",
      type: "relationship",
      relationTo: "categories",
      hasMany: false,
    },
    {
      name: "subCategories",
      type: "join",
      collection: "categories",
      on: "parent",
      hasMany: true,
    },
  ],
};
