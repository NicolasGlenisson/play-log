import { searchPlaylists } from "@/lib/playlist";
import PlayListCollection from "@/components/playlist/playlistCollection";
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
    <div className="flex flex-col items-center w-full max-w-7xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#5E5034] mt-6 mb-2">
          Discover Game Lists
        </h1>
        <p className="text-[#9B7E55] max-w-xl mx-auto">
          Explore collections created by the community or create your own game
          selection
        </p>
      </div>

      <div className="w-full max-w-lg mb-8">
        <SearchInput />
      </div>

      {/* Center the playlist collection horizontally */}
      <div className="w-full flex justify-center mb-8">
        <div className="w-full">
          <PlayListCollection playlists={playlists} canCreate={true} />
        </div>
      </div>

      <div className="mb-12">
        <Pagination totalPages={totalPages} currentPage={page} />
      </div>
    </div>
  );
}
