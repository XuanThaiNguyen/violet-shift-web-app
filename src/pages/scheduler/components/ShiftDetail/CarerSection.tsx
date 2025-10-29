import { UserIcon } from "lucide-react";
import { Divider, User } from "@heroui/react";

// apis
import { useStaffs } from "@/states/apis/staff";

// constants
import { EMPTY_OBJECT } from "@/constants/empty";

// utils
import { getDisplayName } from "@/utils/strings";

// types
import type { FC, SetStateAction } from "react";
import type { IShiftValues } from "@/types/shift";
import type { FormikErrors } from "formik";
import type { User as IUser } from "@/types/user";
import { PayMethodMap } from "../../constant";

type CarerSectionProps = {
  values: IShiftValues;
  setValues: (
    values: SetStateAction<IShiftValues>,
    shouldValidate?: boolean
  ) => Promise<FormikErrors<IShiftValues>> | Promise<void>;
};

const CarerSection: FC<CarerSectionProps> = ({ values }) => {
  const { data: allStaffsData } = useStaffs({
    query: "",
    page: 1,
    limit: 100,
  });
  const allStaffsMap: Record<string, IUser> = allStaffsData?.map || EMPTY_OBJECT;

  return (
    <div className="py-4 px-3 rounded-lg bg-content1">
      <div className="flex items-center gap-2">
        <UserIcon size={20} color={"blue"} />
        <span className="font-medium text-md">Carer</span>
      </div>
      <div className="h-2"></div>
      <Divider />
      <div className="h-4"></div>
      <div className="flex flex-col gap-3">
        {values.staffSchedules.map((staffSchedule) => {
          const staff = allStaffsMap?.[staffSchedule.staff!];
          const name = getDisplayName(staff);
          const actualName = `${staff.firstName}+${staff.lastName}`;
          const avatar = staff.avatar || `https://ui-avatars.com/api/?name=${actualName}`;
          return (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm">Carer</span>
                <User avatarProps={{ src: avatar, size: "sm" }} name={name} />
              </div>
              <div className="h-2"></div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pay Group</span>
                <span className="text-sm">
                  {PayMethodMap[staffSchedule.paymentMethod || "default"]}
                </span>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default CarerSection;
