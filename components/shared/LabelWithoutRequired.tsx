import { Label } from "@/components/ui/label";
import { FaStarOfLife } from "react-icons/fa6";

const LabelWithoutRequired = ({ children }: { children: React.ReactNode }) => (
  <div className="flex">
    <Label className="text-[13px] leading-[15.6px]">{children}</Label>
  </div>
);

export default LabelWithoutRequired;
