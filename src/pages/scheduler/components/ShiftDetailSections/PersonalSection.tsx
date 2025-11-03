import { useMe } from "@/states/apis/me";
import { getDisplayName } from "@/utils/strings";
import { Divider, User } from "@heroui/react";
import { UserIcon } from "lucide-react";

const PersonalSection = () => {
  const { data } = useMe();

  const name = getDisplayName({
    firstName: data?.firstName,
    lastName: data?.lastName,
    middleName: data?.middleName,
    preferredName: data?.preferredName,
    salutation: data?.salutation,
  });
  const actualName = `${data?.firstName}+${data?.lastName}`;
  const avatar =
    data?.avatar || `https://ui-avatars.com/api/?name=${actualName}`;

  return (
    <div className="py-4 px-3 rounded-lg bg-content1">
      <div className="flex items-center gap-2">
        <UserIcon size={20} color={"blue"} />
        <span className="font-medium text-md">Carer</span>
      </div>
      <div className="h-2"></div>
      <Divider />
      <div className="h-4"></div>
      <div className={"flex flex-col gap-2"}>
        <div className="flex items-center justify-between">
          <span className="text-sm">Carer</span>
          <User avatarProps={{ src: avatar, size: "sm" }} name={name} />
        </div>
      </div>
    </div>
  );
};

export default PersonalSection;
