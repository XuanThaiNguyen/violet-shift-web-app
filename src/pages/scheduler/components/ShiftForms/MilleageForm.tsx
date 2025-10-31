import { Milestone } from "lucide-react";
import { Divider, Input, Switch } from "@heroui/react";

// types
import type { FC, SetStateAction } from "react";
import type { IShiftValues } from "@/types/shift";
import type { FormikErrors } from "formik";

type MilleageFormProps = {
  values: IShiftValues;
  setValues: (
    values: SetStateAction<IShiftValues>,
    shouldValidate?: boolean
  ) => Promise<FormikErrors<IShiftValues>> | Promise<void>;
};

const MilleageForm: FC<MilleageFormProps> = ({ values, setValues }) => {

  return (
    <div className="py-4 px-3 rounded-lg mt-2 bg-content1">
      <div className="flex items-center gap-2">
        <Milestone size={20} color={"green"} />
        <span className="font-medium text-md">Mileage</span>
      </div>
      <div className="h-2"></div>
      <Divider />
      <div className="h-4"></div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Mileage cap</span>
        <Input
          label=""
          type="number"
          name="mileageCap"
          className="w-80"
          defaultValue="0"
          value={values.mileageCap?.toString() ?? ""}
          onValueChange={(value) => {
            setValues((prev) => ({ ...prev, mileageCap: Number(value) }));
          }}
        />
      </div>
      <div className="h-4"></div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Mileage</span>
        <Input
          label=""
          type="number"
          name="mileage"
          className="w-80"
          defaultValue="0"
          value={values.mileage?.toString() ?? ""}
          onValueChange={(value) => {
            setValues((prev) => ({ ...prev, mileage: Number(value) }));
          }}
        />
      </div>
      <div className="h-4"></div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Company Vehicle</span>
        <Switch
          isSelected={values.isCompanyVehicle}
          onValueChange={(value) =>
            setValues((prev) => ({
              ...prev,
              isCompanyVehicle: value,
            }))
          }
        />
      </div>
      <div className="h-2"></div>
    </div>
  );
};

export default MilleageForm;
