import { useBackgroundStore } from "@/store/bg_store";
import { Button } from "@/components/ui/button";

export const BgControl = ({ bgName }: { bgName: string }) => {
  const { currentBackground, setBackground } = useBackgroundStore();
  
  const bgUrl = `/bgs/${bgName}.gif`
  return (
    <span>
      <Button
        className={`m-3 p-0 border-2 transition-all inline-block ${
          currentBackground === bgUrl
            ? "border-white brightness-100"
            : "border-gray-500 brightness-50"
        }`}
        style={{ width: "90px", height: "90px" }}
        onClick={() => setBackground(bgName)}
      >
        <img
          className="w-full h-full object-cover"
          src={bgUrl}
          alt="background"
        />
      </Button>
    </span>
  );
};