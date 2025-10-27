import { EMPTY_STRING } from "@/constants/empty";
import { ROLES } from "@/constants/roles";
import ArchiveModal from "@/pages/clients/components/ArchiveModal";
import { useMe } from "@/states/apis/me";
import { usePostArchiveStaff } from "@/states/apis/staff";
import type { User } from "@/types/user";
import { capitalizeFirstLetter } from "@/utils/strings";
import {
  addToast,
  Avatar,
  Button,
  Divider,
  useDisclosure,
} from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, isValid } from "date-fns";
import { Camera, Mail, Phone, Smartphone } from "lucide-react";
import { useNavigate } from "react-router";

interface StaffDetailProps {
  staffId: string;
  detailStaff?: User;
  staffName: string;
}

const StaffDetail = ({
  detailStaff,
  staffName = "",
  staffId,
}: StaffDetailProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: user } = useMe();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: usePostArchiveStaff,
    onSuccess: () => {
      addToast({
        title: "Update staff successfully",
        color: "success",
        timeout: 2000,
        isClosing: true,
      });
      navigate("/staffs/list");
      queryClient.invalidateQueries({ queryKey: ["staffs"] });
    },
    onError: () => {
      addToast({
        title: "Update staff failed",
        color: "danger",
        timeout: 2000,
        isClosing: true,
      });
    },
  });

  const handleConfirm = () => {
    mutate({ id: staffId, isArchived: true });
    onClose();
  };

  return (
    <div>
      <div className="p-4 w-full mx-auto shadow-lg rounded-lg bg-content1">
        <span className="text-2xl font-medium">Demographic Detail</span>
        <div className="h-4"></div>
        <Divider />
        <div className="h-4"></div>
        <div className="flex">
          <div className="flex-1 grid grid-cols-[320px_1fr] gap-y-4 text-gray-700">
            <span className="text-gray-500 text-md">Name:</span>
            <span className="text-md font-semibold">{staffName}</span>
            <span className="text-gray-500 text-md">Role:</span>
            <span className="text-md font-semibold">
              {ROLES[detailStaff?.role as keyof typeof ROLES]}
            </span>
            <span className="font-medium text-gray-500">Contact:</span>
            <div className="flex items-center gap-4">
              <Smartphone size={16} className="text-gray-400" />{" "}
              <span className="text-md font-semibold">
                {detailStaff?.mobileNumber || EMPTY_STRING}
              </span>
              <Phone size={16} className="text-gray-400" />{" "}
              <span className="text-md font-semibold">
                {detailStaff?.phoneNumber || EMPTY_STRING}
              </span>
              <Mail size={16} className="text-gray-400" />{" "}
              <span className="text-md font-semibold">
                {detailStaff?.email || EMPTY_STRING}
              </span>
            </div>
            <span className="text-gray-500 text-md">Address:</span>
            <span className="text-md font-semibold">
              {detailStaff?.address || EMPTY_STRING}
            </span>
            <span className="text-gray-500 text-md">Gender:</span>
            <span className="text-md font-semibold">
              {detailStaff?.gender
                ? capitalizeFirstLetter(detailStaff.gender)
                : EMPTY_STRING}
            </span>
            <span className="text-gray-500 text-md">DOB:</span>
            <span className="text-md font-semibold">
              {detailStaff?.birthdate &&
              isValid(new Date(detailStaff.birthdate))
                ? format(detailStaff?.birthdate, "dd-MM-yyyy")
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
      {staffId === user?.id ? (
        <></>
      ) : (
        <>
          <div className="h-8"></div>
          <span>Archive Staff</span>
          <div className="h-4"></div>
          <div className="p-4 w-full mx-auto shadow-lg rounded-lg bg-content1">
            <span className="text-sm text-gray-500">
              This will archive the staff and you will not able to see staff in
              your list. If you do wish to access the staff, please go to
              Archive sub-menu.
            </span>
            <div className="h-4"></div>
            <Button onPress={onOpen} size="sm" color="danger">
              Archive Staff
            </Button>
          </div>
        </>
      )}

      <ArchiveModal
        mode={"staff"}
        isOpen={isOpen}
        isPending={isPending}
        onClose={onClose}
        onConfirm={handleConfirm}
        clientName={detailStaff?.preferredName || ""}
      />
    </div>
  );
};

export default StaffDetail;
