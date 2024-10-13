"use client";

import Logo from "@/app/(marketing)/_components/logo";
import UserMenu from "@/components/auth/user-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import useScrollTop from "@/hooks/use-scroll-to-top";
import { cn } from "@/lib/utils";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export const Navbar = () => {
  const scrolled = useScrollTop();
  const { status, data: session } = useSession();
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  return (
    <div
      className={cn(
        "fixed top-0 z-50 flex w-full items-center bg-background p-6",
        scrolled && "border-b shadow-sm"
      )}
    >
      <Logo />
      <div className={"flex w-full items-center justify-between gap-x-2 md:ml-auto md:justify-end"}>
        {isLoading && <Spinner />}
        {!isAuthenticated && !isLoading && (
          <>
            <Button variant={"ghost"} size={"sm"} onClick={() => signIn()}>
              Log in
            </Button>
            <Button size={"sm"} onClick={() => signIn()}>
              Get Notion free
            </Button>
          </>
        )}
        {isAuthenticated && !isLoading && (
          <>
            <Button variant={"ghost"} size={"sm"} asChild>
              <Link href={"/documents"}>Enter Notion</Link>
            </Button>
            <UserMenu user={session?.user!} />
          </>
        )}

        <ModeToggle />
      </div>
    </div>
  );
};
