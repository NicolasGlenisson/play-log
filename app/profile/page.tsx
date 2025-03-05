import EditProfileForm from "@/components/form/editProfile";
import { options } from "@/lib/auth";
import { fetchUser } from "@/lib/user";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(options);
  if (!session) {
    redirect("/");
  }

  const user = await fetchUser(session.user.id);

  return <EditProfileForm username={user.name} email={user.email} />;
}
