"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsLeftRight, LogOutIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export const UserItem = () => {
  const { data: session } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div role={"button"} className={"flex w-full items-center p-3 text-sm hover:bg-primary/5"}>
          <div className={"flex max-w-[150px] items-center gap-x-2"}>
            <Avatar>
              <AvatarImage src={session?.user?.image ?? ""} />
              <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className={"line-clamp-1 text-start font-medium"}>
              {session?.user?.name}&apos;s Notion
            </span>
          </div>
          <ChevronsLeftRight className={"ml-2 size-4 rotate-90 text-muted-foreground"} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={"w-80"} align={"start"} alignOffset={11} forceMount>
        <div className={"flex flex-col space-y-4 p-2"}>
          <p className={"text-xs font-medium leading-none text-muted-foreground"}>
            {session?.user?.email}
          </p>
          <div className={"flex items-center gap-x-2"}>
            <div className={"rounded-md bg-secondary p-1"}>
              <Avatar className={"size-8"}>
                <AvatarImage src={session?.user?.image ?? ""} />
                <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div className={"space-y-1"}>
              <p className={"line-clamp-1 text-sm"}>{session?.user?.name}&apos;s Notion</p>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className={"w-full cursor-pointer text-muted-foreground"}>
          <div role={"button"} onClick={() => signOut()}>
            <LogOutIcon className={"mr-2 size-4"} />
            Log out
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
