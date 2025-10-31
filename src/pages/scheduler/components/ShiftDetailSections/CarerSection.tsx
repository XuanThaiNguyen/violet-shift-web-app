import { UserIcon } from "lucide-react";
import { Divider, User } from "@heroui/react";

// apis
import { useStaffs } from "@/states/apis/staff";

// constants
import { EMPTY_OBJECT, EMPTY_STRING } from "@/constants/empty";

// utils
import { getDisplayName } from "@/utils/strings";
import clsx from "clsx";

// types
import type { FC } from "react";
import type { IFullShiftDetail } from "@/types/shift";
import type { User as IUser } from "@/types/user";
import { PayMethodMap } from "../../constant";

type CarerSectionProps = {
  values: IFullShiftDetail;
};

const CarerSection: FC<CarerSectionProps> = ({ values }) => {
  const { data: allStaffsData } = useStaffs({
    query: "",
    page: 1,
    limit: 100,
  });
  const allStaffsMap: Record<string, IUser> =
    allStaffsData?.map || EMPTY_OBJECT;

  return (
    <div className="py-4 px-3 rounded-lg bg-content1">
      <div className="flex items-center gap-2">
        <UserIcon size={20} color={"blue"} />
        <span className="font-medium text-md">Carer</span>
      </div>
      <div className="h-2"></div>
      <Divider />
      <div className="h-4"></div>
      <div className="flex flex-col">
        {values.staffSchedules.map((staffSchedule, index) => {
          const staff = allStaffsMap?.[staffSchedule.staff!];
          const name = staff ? getDisplayName(staff) : EMPTY_STRING;
          const actualName = staff ? `${staff.firstName}+${staff.lastName}` : EMPTY_STRING;
          const avatar =
            staff?.avatar || `https://ui-avatars.com/api/?name=${actualName}`;
          const isLast = index === values.staffSchedules.length - 1;
          return (
            <div
              className={clsx(
                "flex flex-col gap-2",
                !isLast && "border-b border-divider mb-2"
              )}
              key={staffSchedule.staff!}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">Carer</span>
                <User avatarProps={{ src: avatar, size: "sm" }} name={name} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pay Group</span>
                <span className="text-sm">
                  {PayMethodMap[staffSchedule.paymentMethod || "default"]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CarerSection;
