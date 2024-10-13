import Image from "next/image";

export const Heroes = () => {
  return (
    <div className={"flex max-w-5xl flex-col items-center justify-center"}>
      <div className={"flex items-center"}>
        <div className={"relative size-[300px] sm:size-[350px] md:size-[400px]"}>
          <Image
            src={"/hero-illustration.png"}
            className={"object-contain dark:invert"}
            fill
            alt={"Hero Illustration"}
          />
        </div>
      </div>
    </div>
  );
};
