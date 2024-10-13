"use client";

import { SearchCommand } from "@/components/search-command";
import { Spinner } from "@/components/spinner";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Navigation } from "./_components/navigation";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();

  if (status === "loading")
    return (
      <div className={"flex h-full items-center justify-center"}>
        <Spinner />
      </div>
    );

  if (status === "unauthenticated") {
    return redirect("/");
  }

  return (
    <div className={"flex h-full dark:bg-[#1F1F1F]"}>
      <Navigation />
      <main className={"h-full flex-1 overflow-y-auto"}>
        <SearchCommand />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
