import { Divider } from "@heroui/react";
import { Signature } from "lucide-react";

// types
import type { IFullShiftDetail } from "@/types/shift";
import type { FC } from "react";

type SignatureSectionProps = {
  values: IFullShiftDetail;
};

const SignatureSection: FC<SignatureSectionProps> = ({ values }) => {
  return (
    <div className="py-4 px-3 rounded-lg mt-2 bg-content1">
      <div className="flex items-center gap-2">
        <Signature size={20} color={"grey"} />
        <span className="font-medium">Signature</span>
      </div>
      <div className="h-2"></div>
      <Divider />
      <div className="h-4"></div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Require client signature on clock out</span>
        <span className="text-sm">
          {values.clientClockOutRequired ? "Yes" : "No"}
        </span>
      </div>
      <div className="h-4"></div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Require staff signature on clock out</span>
        <span className="text-sm">
          {values.staffClockOutRequired ? "Yes" : "No"}
        </span>
      </div>
    </div>
  );
};

export default SignatureSection;
