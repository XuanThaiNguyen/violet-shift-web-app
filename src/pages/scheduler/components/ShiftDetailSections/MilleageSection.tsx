import { Milestone } from "lucide-react";
import { Divider } from "@heroui/react";

// types
import type { FC } from "react";
import type { IFullShiftDetail } from "@/types/shift";

type MilleageSectionProps = {
  values: IFullShiftDetail;
};

const MilleageSection: FC<MilleageSectionProps> = ({ values }) => {

  return (
    <div className="py-4 px-3 rounded-lg mt-2 bg-content1">
      <div className="flex items-center gap-2">
        <Milestone size={20} color={"green"} />
        <span className="font-medium">Mileage</span>
      </div>
      <div className="h-2"></div>
      <Divider />
      <div className="h-4"></div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Mileage cap</span>
        <span className="text-sm">{values.mileageCap}Km</span>
      </div>
      <div className="h-4"></div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Mileage</span>
        <span className="text-sm">{values.mileage}Km</span>
      </div>
      <div className="h-4"></div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Company Vehicle</span>
        <span className="text-sm">{values.isCompanyVehicle ? "Yes" : "No"}</span>
      </div>
      <div className="h-2"></div>
    </div>
  );
};

export default MilleageSection;
