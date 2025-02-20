import LoginPage from "@/components/LoginPage";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  if (!session) {
    return (
      <main>
        <LoginPage />
      </main>
    );
  }
}
