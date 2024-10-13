import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const Heading = async () => {
  const session = await auth();
  return (
    <div className={"max-w-3xl space-y-4"}>
      <h1 className={"text-3xl font-bold sm:text-5xl md:text-6xl"}>
        Your Ideas, Documents, & Plans. Unified. Welcome to{" "}
        <span className={"underline"}>Notion</span>
      </h1>
      <h3 className={"text-base font-medium sm:text-xl md:text-2xl"}>
        Notion is the connected workspace where <br />
        better, faster work happens.
      </h3>
      {session ? (
        <Button asChild>
          <Link href={"/documents"}>
            Enter Notion
            <ArrowRight className={"ml-2 size-4"} />
          </Link>
        </Button>
      ) : (
        <Button>
          Get Notion free
          <ArrowRight className={"ml-2 size-4"} />
        </Button>
      )}
    </div>
  );
};
