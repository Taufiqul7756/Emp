import { Label } from "@/components/ui/label";
import { FaStarOfLife } from "react-icons/fa6";

const LabelWithRequired = ({ children }: { children: React.ReactNode }) => (
  <div className="flex">
    <Label className="text-grayscaleText text-[13px] font-normal leading-[15.6px]">
      {children}
    </Label>
    <span className="pl-1 text-danger-500">
      <FaStarOfLife size={5} />
    </span>
  </div>
);

export default LabelWithRequired;
