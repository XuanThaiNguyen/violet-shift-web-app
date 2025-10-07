import { EMPTY_STRING } from "@/constants/empty";
import { useMe } from "@/states/apis/me";
import { capitalizeFirstLetter, getDisplayName } from "@/utils/strings";
import { Avatar, Divider } from "@heroui/react";
import { format, isValid } from "date-fns";
import { Camera, Mail, Phone, Smartphone } from "lucide-react";
import { useNavigate } from "react-router";

const ProfileInfo = () => {
  const navigate = useNavigate();

  const { data: detailUser } = useMe();

  const _name = getDisplayName({
    salutation: detailUser?.salutation,
    firstName: detailUser?.firstName,
    middleName: detailUser?.middleName,
    lastName: detailUser?.lastName,
    preferredName: detailUser?.preferredName,
  });

  return (
    <div>
      <div className="p-4 w-full mx-auto shadow-lg rounded-lg bg-content1">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-medium">Demographic Detail</span>
          <div
            className="cursor-pointer"
            onClick={() => {
              navigate(`/profile/update`);
            }}
          >
            <span className="text-blue-400 text-md font-medium">EDIT</span>
          </div>
        </div>
        <div className="h-4"></div>
        <Divider />
        <div className="h-4"></div>
        <div className="flex">
          <div className="flex-1 grid grid-cols-[320px_1fr] gap-y-4 text-gray-700">
            <span className="text-gray-500 text-md">Name:</span>
            <span className="text-md font-semibold">{_name}</span>
            <span className="font-medium text-gray-500">Contact:</span>
            <div className="flex items-center gap-4">
              <Smartphone size={16} className="text-gray-400" />{" "}
              <span className="text-md font-semibold">
                {detailUser?.mobileNumber || EMPTY_STRING}
              </span>
              <Phone size={16} className="text-gray-400" />{" "}
              <span className="text-md font-semibold">
                {detailUser?.phoneNumber || EMPTY_STRING}
              </span>
              <Mail size={16} className="text-gray-400" />{" "}
              <span className="text-md font-semibold">
                {detailUser?.email || EMPTY_STRING}
              </span>
            </div>
            <span className="text-gray-500 text-md">Address:</span>
            <span className="text-md font-semibold">
              {detailUser?.address || EMPTY_STRING}
            </span>
            <span className="text-gray-500 text-md">Gender:</span>
            <span className="text-md font-semibold">
              {detailUser?.gender
                ? capitalizeFirstLetter(detailUser.gender)
                : EMPTY_STRING}
            </span>
            <span className="text-gray-500 text-md">DOB:</span>
            <span className="text-md font-semibold">
              {detailUser?.birthdate && isValid(new Date(detailUser.birthdate))
                ? format(detailUser?.birthdate, "dd-MM-yyyy")
                : EMPTY_STRING}
            </span>
            <span className="text-gray-500 text-md">Language Spoken:</span>
            <span className="">{EMPTY_STRING}</span>
          </div>
          <div className="flex md:justify-end cursor-pointer">
            <div className="relative w-72 h-72 p-2 rounded-lg border border-gray-200 flex items-center justify-center">
              <Avatar
                className="w-full h-full rounded-full object-cover"
                color={"primary"}
              />
              <button className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full cursor-pointer">
                <Camera size={18} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
