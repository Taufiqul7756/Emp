import { Label } from "@/components/ui/label";
import { FaStarOfLife } from "react-icons/fa6";

const LabelWithRequiredClone = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className="flex">
    <Label className="text-[13px] font-normal leading-[15.6px] text-grayscaleText">
      {children}
    </Label>
    <span className="pl-1 text-danger-500">
      <FaStarOfLife size={5} />
    </span>
  </div>
);

export default LabelWithRequiredClone;
