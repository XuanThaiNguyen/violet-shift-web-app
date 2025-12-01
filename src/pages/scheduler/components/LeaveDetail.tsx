import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  addToast,
} from "@heroui/react";
import { useStaffDetail } from "@/states/apis/staff";
import { getDisplayName } from "@/utils/strings";
import { format } from "date-fns";
import { useEffect, useState } from "react";

import type { IAvailibility } from "@/types/availability";
import DeclineLeaveRequest from "./DeclineLeaveRequest";

interface LeaveDetailProps {
  isOpen: boolean;
  unavailability: IAvailibility;
  onClose: () => void;
}

const LeaveDetail = ({ isOpen, onClose, unavailability }: LeaveDetailProps) => {

  const [internalOpen, setInternalOpen] = useState(isOpen);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  const { data: staffDetail } = useStaffDetail(unavailability.staff);
  

  const handleClose = () => {
    setInternalOpen(false);
    setTimeout(onClose, 200);
  };

  useEffect(() => {
    setInternalOpen(isOpen);
  }, [isOpen]);


  return (
    <Modal isOpen={internalOpen} onClose={handleClose} size="2xl" placement="top">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-lg font-semibold">
              Leave Detail
            </ModalHeader>
            <Divider />
            <ModalBody>
              <div className="flex flex-col gap-2 ">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-md">Staff:</span>
                  <span className="text-md font-semibold">{getDisplayName(staffDetail || {})}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-md">From:</span>
                  <span className="text-md font-semibold">{format(unavailability.from, "dd/MM/yyyy HH:mm")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-md">To:</span>
                  <span className="text-md font-semibold">{format(unavailability.to, "dd/MM/yyyy HH:mm")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-md">Note:</span>
                  <span className="text-md font-semibold">{unavailability.note}</span>
                </div>
              </div>
            </ModalBody>
            <Divider />
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="danger" onPress={() => setOpenDeleteConfirm(true)}>
                Decline
              </Button>
            </ModalFooter>

            <DeclineLeaveRequest
              isOpen={openDeleteConfirm}
              onClose={() => setOpenDeleteConfirm(false)}
              onConfirm={() => {
                handleClose();
                addToast({
                  title: "Leave request declined",
                  color: "success",
                  timeout: 2000,
                  isClosing: true,
                });
              }}
              availability={unavailability}
            />
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default LeaveDetail;
