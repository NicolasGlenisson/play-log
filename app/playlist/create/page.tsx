import PlayListForm from "@/components/form/playListForm";
import { options } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

// Page to create a new playlist
export default async function Page() {
  const session = await getServerSession(options);
  if (!session) {
    notFound();
  }
  return <PlayListForm type="create" />;
}
