import { useMemo } from "react";
import { OctagonAlert, UserIcon } from "lucide-react";
import {
  Divider,
  Select as HerouiSelect,
  SelectItem,
  User,
} from "@heroui/react";
import { Select } from "@/components/select/Select";

// apis
import { useStaffs } from "@/states/apis/staff";
import { useGetAvailabilities } from "@/states/apis/availability";

// constants
import { EMPTY_ARRAY } from "@/constants/empty";
import { PayMethodOptions } from "../../constant";

// utils
import { getDisplayName } from "@/utils/strings";

// types
import type { FC, SetStateAction } from "react";
import type { IShiftValues } from "@/types/shift";
import type { FormikErrors } from "formik";
import type { User as IUser } from "@/types/user";
import type { IAvailibility } from "@/types/availability";

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
    archived: false,
    joined: true,
  });

  const { data: dataAvailabilities = EMPTY_ARRAY } = useGetAvailabilities({
    from: values.timeFrom,
    to: values.timeTo,
    type: "unavailable",
    isApproved: true,
  });
  const dataAvailabilitiesMap = useMemo(() => {
    return dataAvailabilities.reduce((acc, item) => {
      acc[item.staff] = item;
      return acc;
    }, {} as Record<string, IAvailibility>);
  }, [dataAvailabilities]);

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
        <span className="text-sm">
          Choose carer <span className="text-red-500">*</span>
        </span>
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
      {dataAvailabilitiesMap[values.staffSchedules[0]?.staff || ""] && (
        <div className="mt-2 text-xs text-danger bg-danger-50 p-2 rounded-md max-w-xs ml-auto flex items-center gap-2">
          <OctagonAlert size={16} />
          <span>This carer is unavailable on the selected time.</span>
        </div>
      )}
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
