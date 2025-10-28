import { UserCheck } from "lucide-react";
import { Divider, Select as HerouiSelect, SelectItem } from "@heroui/react";

// constants
import { AllowanceOptions, ShiftTypeOptions } from "../../constant";

// types
import type { FC, SetStateAction } from "react";
import type { AllowanceTypeEnum, IShiftValues, ShiftTypeEnum } from "@/types/shift";
import type { FormikErrors } from "formik";

type ShiftInfoFormProps = {
  values: IShiftValues;
  setValues: (
    values: SetStateAction<IShiftValues>,
    shouldValidate?: boolean
  ) => Promise<FormikErrors<IShiftValues>> | Promise<void>;
};

const ShiftInfoForm: FC<ShiftInfoFormProps> = ({ values, setValues }) => {
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
        <HerouiSelect
          placeholder="Select shift type"
          className="max-w-xs"
          selectedKeys={[values.shiftType]}
          onSelectionChange={([value]) => {
            if (typeof value === "string") {
              setValues((prev) => ({
                ...prev,
                shiftType: value,
              }));
            }
          }}
        >
          {ShiftTypeOptions.map((shiftItem) => (
            <SelectItem key={shiftItem.key}>{shiftItem.label}</SelectItem>
          ))}
        </HerouiSelect>
      </div>
      <div className="h-4"></div>
      <div className="flex justify-between">
        <span className="text-sm">Additional Shift Types</span>
        <HerouiSelect
          placeholder="Select additional shift types"
          className="max-w-xs"
          selectedKeys={values.additionalShiftTypes}
          selectionMode="multiple"
          onSelectionChange={(value) => {
            const selected = Array.from(value);
            setValues((prev) => ({
              ...prev,
              additionalShiftTypes: selected as ShiftTypeEnum[],
            }));
          }}
        >
          {ShiftTypeOptions.map((shiftItem) => (
            <SelectItem key={shiftItem.key}>{shiftItem.label}</SelectItem>
          ))}
        </HerouiSelect>
      </div>
      <div className="h-4"></div>
      <div className="flex justify-between">
        <span className="text-sm">Allowance</span>
        <HerouiSelect
          placeholder="Select allowance"
          className="max-w-xs"
          selectedKeys={values.allowances}
          onSelectionChange={(value) => {
            const selected = Array.from(value);
            setValues((prev) => ({
              ...prev,
              allowances: selected as AllowanceTypeEnum[],
            }));
          }}
        >
          {AllowanceOptions.map((allowanceItem) => (
            <SelectItem key={allowanceItem.key}>
              {allowanceItem.label}
            </SelectItem>
          ))}
        </HerouiSelect>
      </div>
    </div>
  );
};

export default ShiftInfoForm;
