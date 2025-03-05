import PlayListForm from "@/components/form/playListForm";
import { options } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

// Page to create a new playlist
export default async function Page() {
  const session = await getServerSession(options);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/list/create");
  }
  return (
    <>
      <h1 className="text-center mb-8 text-3xl md:text-4xl font-bold text-[#5E5034] mt-6">
        My Playlist
      </h1>
      <PlayListForm type="create" />
    </>
  );
}
