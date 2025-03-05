import SignUpForm from "@/components/form/signUpForm";
import { options } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

// Page to create an account
export default async function Page() {
  const session = await getServerSession(options);
  if (session) {
    redirect("/");
  }
  return <SignUpForm />;
}
