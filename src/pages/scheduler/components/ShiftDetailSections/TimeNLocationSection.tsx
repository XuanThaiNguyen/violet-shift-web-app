import { CalendarIcon } from "lucide-react";
import { Chip, Divider } from "@heroui/react";

// empty
import { EMPTY_STRING } from "@/constants/empty";

// utils
import { format, isValid } from "date-fns";
import { getFormattedTz } from "@/utils/datetime";

// types
import type { FC } from "react";
import type { IShiftValues } from "@/types/shift";

type TimeNLocationFormProps = {
  values: IShiftValues;
};

const formattedTz = getFormattedTz();

const TimeNLocationForm: FC<TimeNLocationFormProps> = ({ values }) => {
  return (
    <div className="py-4 px-3 rounded-lg bg-content1">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon size={20} color={"red"} />
          <span className="font-medium text-md">Time & Location</span>
        </div>
        <Chip className="rounded-lg" color="default" variant="flat">
          {formattedTz}
        </Chip>
      </div>
      <div className="h-2"></div>
      <Divider />
      <div className="h-4"></div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Date</span>
        <span className="text-sm">
          {isValid(values.timeFrom)
            ? format(values.timeFrom!, "yyyy-MMM-dd")
            : "N/A"}
        </span>
      </div>
      <div className="h-4"></div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Time</span>
        <div className="text-sm">
          {isValid(values.timeFrom) ? format(values.timeFrom!, "HH:mm") : "N/A"}{" "}
          - {isValid(values.timeTo) ? format(values.timeTo!, "HH:mm") : "N/A"}
        </div>
      </div>
      <div className="h-4"></div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Address</span>
        <span className="text-sm">{values.address || EMPTY_STRING}</span>
      </div>
      <div className="h-4"></div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Unit/Apartment Number</span>
        <span className="text-sm">{values.unitNumber || EMPTY_STRING}</span>
      </div>
      <div className="h-4"></div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Shift Bonus</span>
        <span className="text-sm">
          {values.bonus ? `$${values.bonus.toFixed(2)}` : EMPTY_STRING}
        </span>
      </div>
    </div>
  );
};

export default TimeNLocationForm;
