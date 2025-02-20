import { Button } from "@/components/ui/button";
import Link from "next/link";

const AuthPage = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-4">
      <p>No content here. Go to</p>
      <div className="inline-flex gap-4">
        <Link href={"/auth/login"}>
          <Button variant={"link"} className="bg-green-400">
            Login page
          </Button>
        </Link>
        <Link href={"/auth/register"}>
          <Button variant={"link"} className="bg-orange-400">
            Register page
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AuthPage;
