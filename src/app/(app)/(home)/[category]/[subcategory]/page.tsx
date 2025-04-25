interface PageProps {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}
export const dynamic = "force-dynamic";

const Page = async ({ params }: PageProps) => {
  const { category, subcategory } = await params;
  return (
    <div>
      Category: {category}
      <br />
      Subcategory: {subcategory}
    </div>
  );
};

export default Page;
