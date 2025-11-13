import { useStaffDetail } from "@/states/apis/staff";
import { useParams } from "react-router";
import { getDisplayName } from "@/utils/strings";

import type { FC } from "react";

const StaffWorklogs: FC = () => {
  const { staffId } = useParams();

  const { data: staff } = useStaffDetail(staffId as string);
  const staffName = getDisplayName({
    salutation: staff?.salutation,
    firstName: staff?.firstName,
    middleName: staff?.middleName,
    lastName: staff?.lastName,
    preferredName: staff?.preferredName,
  });

  return (
    <div className="container mx-auto pt-4">
      <div className="bg-content1 shadow-md rounded-lg p-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{staffName}'s worklogs</h1>
        </div>
        <div className="h-4"></div>
      </div>
    </div>
  );
};

export default StaffWorklogs;
