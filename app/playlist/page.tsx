import { searchPlaylists } from "@/lib/data";
import PlayListCollection from "@/components/playListCollection";
import SearchInput from "@/components/searchPlaylist";
import Pagination from "@/components/pagination";

export default async function Page(props: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams?.search || "";
  const page = Number(searchParams?.page) || 1;
  const { playlists, totalPages } = await searchPlaylists(page, search);

  return (
    <>
      <h1>Search Playlists</h1>
      <SearchInput />
      <PlayListCollection playlists={playlists} />
      <Pagination totalPages={totalPages} currentPage={page} />
    </>
  );
}
