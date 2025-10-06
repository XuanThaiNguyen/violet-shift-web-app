import { EMPTY_STRING } from "@/constants/empty";
import type { IClient } from "@/types/client";
import { capitalizeFirstLetter } from "@/utils/strings";
import {
  addToast,
  Avatar,
  Button,
  Divider,
  useDisclosure,
} from "@heroui/react";
import { format, isValid } from "date-fns";
import { Camera, Mail, Phone, Smartphone } from "lucide-react";
import { useNavigate } from "react-router";
import ArchiveClientModal from "./ArchiveClientModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePostArchiveClient } from "@/states/apis/client";

interface ClientDetailProps {
  clientId: string;
  detailClient?: IClient;
}

const ClientDetail = ({ clientId, detailClient }: ClientDetailProps) => {
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: usePostArchiveClient,
    onSuccess: () => {
      addToast({
        title: "Update client successful",
        color: "success",
        timeout: 2000,
        isClosing: true,
      });
      navigate("/clients/list");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: () => {
      addToast({
        title: "Update client failed",
        color: "danger",
        timeout: 2000,
        isClosing: true,
      });
    },
  });

  const handleConfirm = () => {
    mutate({ id: clientId, isArchived: true });
    onClose();
  };

  return (
    <div>
      <div className="p-4 w-full mx-auto shadow-lg rounded-lg bg-content1">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-medium">Demographic Detail</span>
          <div
            className="cursor-pointer"
            onClick={() => {
              navigate(`/clients/${clientId}/update`);
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
            <span className="text-md font-semibold">
              {detailClient?.displayName}
            </span>
            <span className="font-medium text-gray-500">Contact:</span>
            <div className="flex items-center gap-4">
              <Smartphone size={16} className="text-gray-400" />{" "}
              <span className="text-md font-semibold">
                {detailClient?.mobileNumber || EMPTY_STRING}
              </span>
              <Phone size={16} className="text-gray-400" />{" "}
              <span className="text-md font-semibold">
                {detailClient?.phoneNumber || EMPTY_STRING}
              </span>
              <Mail size={16} className="text-gray-400" />{" "}
              <span className="text-md font-semibold">
                {detailClient?.email || EMPTY_STRING}
              </span>
            </div>
            <span className="text-gray-500 text-md">Address:</span>
            <span className="text-md font-semibold">
              {detailClient?.address || EMPTY_STRING}
            </span>
            <span className="text-gray-500 text-md">Gender:</span>
            <span className="text-md font-semibold">
              {detailClient?.gender
                ? capitalizeFirstLetter(detailClient.gender)
                : EMPTY_STRING}
            </span>
            <span className="text-gray-500 text-md">DOB:</span>
            <span className="text-md font-semibold">
              {detailClient?.birthdate &&
              isValid(new Date(detailClient.birthdate))
                ? format(detailClient?.birthdate, "dd-MM-yyyy")
                : EMPTY_STRING}
            </span>
            <span className="text-gray-500 text-md">Maritial Status:</span>
            <span className="text-md font-semibold">
              {detailClient?.maritalStatus
                ? capitalizeFirstLetter(detailClient.maritalStatus)
                : EMPTY_STRING}
            </span>
            <span className="text-gray-500 text-md">Religion:</span>
            <span className="text-md font-semibold">
              {detailClient?.religion || EMPTY_STRING}
            </span>
            <span className="text-gray-500 text-md">Nationality:</span>
            <span className="text-md font-semibold">
              {detailClient?.nationality || EMPTY_STRING}
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
      <div className="h-8"></div>
      <span>Archive Client</span>
      <div className="h-4"></div>
      <div className="p-4 w-full mx-auto shadow-lg rounded-lg bg-content1">
        <span className="text-sm text-gray-500">
          This will archive the client and you will not able to see client in
          your list. If you do wish to access the client, please go to Archive
          sub-menu.
        </span>
        <div className="h-4"></div>
        <Button onPress={onOpen} size="sm" color="danger">
          Archive Client
        </Button>
      </div>

      <ArchiveClientModal
        isOpen={isOpen}
        isPending={isPending}
        onClose={onClose}
        onConfirm={handleConfirm}
        clientName={detailClient?.displayName || ""}
      />
    </div>
  );
};

export default ClientDetail;
