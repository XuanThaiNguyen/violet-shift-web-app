import { UserCheck } from "lucide-react";
import { Chip, Divider } from "@heroui/react";

// constants
import { AllowanceTypeMap, ShiftTypeMap } from "../../constant";

// types
import type { FC } from "react";
import type { IFullShiftDetail } from "@/types/shift";

type ShiftInfoSectionProps = {
  values: IFullShiftDetail;
};

const ShiftInfoSection: FC<ShiftInfoSectionProps> = ({ values }) => {
  return (
    <div className="py-4 px-3 rounded-lg bg-content1">
      <div className="flex items-center gap-2">
        <UserCheck size={20} color={"black"} />
        <span className="font-medium text-md">Shift Info</span>
      </div>
      <div className="h-2"></div>
      <Divider />
      <div className="h-4"></div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Shift Type</span>
        <span className="text-sm">{ShiftTypeMap[values.shiftType]}</span>
      </div>
      <div className="h-4"></div>
      <div className="flex justify-between gap-2">
        <span className="text-sm">Additional Shift Types</span>
        <div className="flex justify-end items-center gap-2">
          {values.additionalShiftTypes.map((shiftType) => (
            <Chip key={shiftType} className="text-sm">{ShiftTypeMap[shiftType]}</Chip>
          ))}
        </div>
      </div>
      <div className="h-4"></div>
      <div className="flex justify-between gap-2">
        <span className="text-sm">Allowance</span>
        <div className="flex justify-end items-center gap-2">
          {values.allowances.map((allowance) => (
            <Chip key={allowance} className="text-sm">{AllowanceTypeMap[allowance]}</Chip>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShiftInfoSection;
