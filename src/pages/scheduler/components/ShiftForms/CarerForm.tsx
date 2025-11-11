import { useMemo } from "react";
import { UserIcon } from "lucide-react";
import {
  Divider,
  Select as HerouiSelect,
  SelectItem,
  User,
} from "@heroui/react";
import { Select } from "@/components/select/Select";

// apis
import { useStaffs } from "@/states/apis/staff";

// constants
import { EMPTY_ARRAY } from "@/constants/empty";

// utils
import { getDisplayName } from "@/utils/strings";

// types
import type { FC, SetStateAction } from "react";
import type { IShiftValues } from "@/types/shift";
import type { FormikErrors } from "formik";
import type { User as IUser } from "@/types/user";
import { PayMethodOptions } from "../../constant";

type CarerFormProps = {
  values: IShiftValues;
  setValues: (
    values: SetStateAction<IShiftValues>,
    shouldValidate?: boolean
  ) => Promise<FormikErrors<IShiftValues>> | Promise<void>;
};

const CarerForm: FC<CarerFormProps> = ({ values, setValues }) => {
  const { data: allStaffsData } = useStaffs({
    query: "",
    page: 1,
    limit: 100,
  });
  const allStaffs = allStaffsData?.data || EMPTY_ARRAY;

  const allStaffsOptions = useMemo(() => {
    return allStaffs.map((staff: IUser) => {
      const name = getDisplayName(staff);
      const actualName = `${staff.firstName}+${staff.lastName}`;
      const avatar =
        staff.avatar || `https://ui-avatars.com/api/?name=${actualName}`;
      return {
        label: (
          <User
            avatarProps={{ src: avatar, size: "sm" }}
            name={name}
            description={staff.email}
          />
        ),
        value: staff.id!,
      };
    });
  }, [allStaffs]);

  return (
    <div className="py-4 px-3 rounded-lg bg-content1">
      <div className="flex items-center gap-2">
        <UserIcon size={20} color={"blue"} />
        <span className="font-medium text-md">Carer</span>
      </div>
      <div className="h-2"></div>
      <Divider />
      <div className="h-4"></div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Choose carer</span>
        <Select
          className="max-w-xs"
          placeholder="Select carer"
          classNames={{
            content: "w-screen max-w-xs",
          }}
          options={allStaffsOptions}
          value={values.staffSchedules[0]?.staff || undefined}
          onValueChange={(value) => {
            setValues((old) => {
              return {
                ...old,
                staffSchedules: [
                  {
                    staff: value as string,
                    timeFrom: old.timeFrom,
                    timeTo: old.timeTo,
                    paymentMethod: "default",
                  },
                ],
              };
            });
          }}
        />
      </div>
      <div className="h-4"></div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Choose pay group</span>
        <HerouiSelect
          className="max-w-xs"
          placeholder="Select pay group"
          selectedKeys={[values.staffSchedules[0]?.paymentMethod || "default"]}
          onSelectionChange={([value]) => {
            if (typeof value === "string") {
              setValues((prev) => ({
                ...prev,
                staffSchedules: [
                  {
                    ...prev.staffSchedules[0],
                    paymentMethod: value,
                  },
                ],
              }));
            }
          }}
        >
          {PayMethodOptions.map((payMethod) => (
            <SelectItem key={payMethod.key}>{payMethod.label}</SelectItem>
          ))}
        </HerouiSelect>
      </div>
    </div>
  );
};

export default CarerForm;
