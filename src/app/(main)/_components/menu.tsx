"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocument } from "@/hooks/use-document";
import { MoreHorizontal, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type MenuProps = {
  documentId: string;
};

export const Menu = ({ documentId }: MenuProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const { archive } = useDocument({ documentId });

  const onArchive = async () => {
    const promise = archive();
    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Moved to trash!",
      error: "Failed to move to trash",
    });

    router.push("/documents");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"sm"} variant={"ghost"}>
          <MoreHorizontal className={"size-4"} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={"w-60"} align={"end"} alignOffset={8} forceMount>
        <DropdownMenuItem onClick={onArchive}>
          <Trash className={"mr-2 size-4"} />
          Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className={"p-2 text-xs text-muted-foreground"}>
          Last edited by: {session?.user?.name}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className={"size-10"} />;
};
