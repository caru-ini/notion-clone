import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Image from "next/image";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const Logo = () => {
  return (
    <div className={"hidden items-center gap-x-2 md:flex"}>
      <Image src={"/logo.svg"} className={"dark:invert"} alt={"logo"} width={40} height={40} />
      <p className={cn("text-lg font-semibold", poppins.className)}>Notion</p>
    </div>
  );
};

export default Logo;
