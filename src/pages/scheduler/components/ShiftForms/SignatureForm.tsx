import type { IShiftValues } from "@/types/shift";
import { Divider, Switch } from "@heroui/react";
import type { FormikErrors } from "formik";
import { Signature } from "lucide-react";
import type { FC, SetStateAction } from "react";

type SignatureFormProps = {
  values: IShiftValues;
  setValues: (
    values: SetStateAction<IShiftValues>,
    shouldValidate?: boolean
  ) => Promise<FormikErrors<IShiftValues>> | Promise<void>;
};

const SignatureForm: FC<SignatureFormProps> = ({ values, setValues }) => {
  return (
    <div className="py-4 px-3 rounded-lg mt-2 bg-content1">
      <div className="flex items-center gap-2">
        <Signature size={20} color={"grey"} />
        <span className="font-medium text-md">Signature</span>
      </div>
      <div className="h-2"></div>
      <Divider />
      <div className="h-4"></div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Require client signature on clock out</span>
        <Switch
          isSelected={values.clientClockOutRequired}
          onValueChange={(value) =>
            setValues((prev) => ({
              ...prev,
              clientClockOutRequired: value,
            }))
          }
        />
      </div>
      <div className="h-4"></div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Require staff signature on clock out</span>
        <Switch
          isSelected={values.staffClockOutRequired}
          onValueChange={(value) =>
            setValues((prev) => ({
              ...prev,
              staffClockOutRequired: value,
            }))
          }
        />
      </div>
    </div>
  );
};

export default SignatureForm;
