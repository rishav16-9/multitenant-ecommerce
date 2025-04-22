import { getPayload } from "payload";
import configPromise from "@payload-config";

import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { SearchFilter } from "./search-filter";
import { Category } from "@/payload-types";

interface Props {
  children: React.ReactNode;
}
const payload = await getPayload({
  config: configPromise,
});

const data = await payload.find({
  collection: "categories",
  depth: 1, //populate subcategories, subcategories.[0] will be type of "Category"
  pagination: false,
  where: {
    parent: {
      exists: false,
    },
  },
});
const formattedData = data.docs.map((doc) => ({
  ...doc,
  subCategories: doc.subCategories?.docs?.map((doc) => ({
    // because of depth "1", we are confident "doc" will be type of "Category"
    ...(doc as Category),
    subCategories: undefined,
  })),
}));
const Layout = async ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFilter data={formattedData} />
      <div className="flex-1 bg-[#F4F4F0]">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
