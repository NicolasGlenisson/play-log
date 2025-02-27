import { CardGridSkeleton } from "@/components/cardCollection";
import SearchBar from "@/components/searchBar";

export default async function Page(props: {
  searchParams?: Promise<{
    name?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <>
      <SearchBar defaultValue={searchParams?.name} />
      <CardGridSkeleton />
    </>
  );
}
