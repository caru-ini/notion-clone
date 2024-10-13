import Logo from "@/app/(marketing)/_components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Footer = () => {
  return (
    <div className={"z-50 flex w-full items-center bg-background p-6"}>
      <Logo />
      <div
        className={
          "flex w-full items-center justify-between gap-x-2 text-muted-foreground md:ml-auto md:justify-end"
        }
      >
        <Button variant={"ghost"} size={"sm"} asChild>
          <Link href={"/privacy"}>Privacy Policy</Link>
        </Button>
        <Button variant={"ghost"} size={"sm"} asChild>
          <Link href={"/terms"}>Terms of Service</Link>
        </Button>
      </div>
    </div>
  );
};

export default Footer;
