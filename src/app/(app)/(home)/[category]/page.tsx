interface PageProps {
  params: Promise<{
    category: string;
  }>;
}
export const dynamic = "force-dynamic";

const Page = async ({ params }: PageProps) => {
  const { category } = await params;
  return <div>Category page: {category}</div>;
};

export default Page;
