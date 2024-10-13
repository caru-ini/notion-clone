import Footer from "@/app/(marketing)/_components/footer";
import { Heroes } from "@/app/(marketing)/_components/heroes";
import { Heading } from "./_components/heading";

const MarketingPage = () => {
  return (
    <div className={"flex min-h-full flex-col"}>
      <div
        className={
          "flex flex-1 flex-col items-center justify-center gap-y-8 px-6 pb-10 text-center md:justify-start"
        }
      >
        <Heading />
        <Heroes />
      </div>
      <Footer />
    </div>
  );
};

export default MarketingPage;
