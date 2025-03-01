import { searchPlaylists } from "@/lib/playlist";
import PlayListCollection from "@/components/playlist/playListCollection";
import SearchInput from "@/components/playlist/searchPlaylist";
import Pagination from "@/components/custom/pagination";

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
