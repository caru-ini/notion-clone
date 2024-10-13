import Image from "next/image";

export const Heroes = () => {
  return (
    <div className={"flex max-w-5xl flex-col items-center justify-center"}>
      <div className={"flex items-center"}>
        <div className={"relative size-[300px] sm:size-[350px] md:size-[400px]"}>
          <Image
            src={"/reading.png"}
            className={"object-contain dark:hidden"}
            fill
            alt={"Reading"}
          />
          <Image
            src={"/reading-dark.png"}
            className={"hidden object-contain dark:block"}
            fill
            alt={"Reading"}
          />
        </div>
      </div>
    </div>
  );
};
