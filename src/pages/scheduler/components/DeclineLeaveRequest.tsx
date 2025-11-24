import { declineLeaveRequest } from "@/states/apis/availability";
import type { IAvailibility } from "@/types/availability";
import {
  addToast,
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DeclineLeaveRequestProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  availability: IAvailibility;
}

const DeclineLeaveRequest = ({
  isOpen,
  onClose,
  onConfirm,
  availability,
}: DeclineLeaveRequestProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: declineLeaveRequest,
    onSuccess: () => {
      queryClient.removeQueries({
        predicate: (query) =>
          query.queryKey[0] === "staffAvailability" &&
          query.queryKey[1] === availability.staff,
      });
      onConfirm();
    },
    onError: () => {
      addToast({
        title: "Decline leave request failed",
        color: "danger",
        timeout: 2000,
        isClosing: true,
      });
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" placement="top">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-lg font-semibold">
              Decline Leave Request
            </ModalHeader>
            <Divider />
            <ModalBody>
              <div className="p-3 bg-warning-50 border border-warning-100 rounded-md mt-2">
                <p className="font-semibold">This action cannot be undone</p>
                <p className="text-sm text-gray-500 mt-2">
                  This action will decline the leave request and notify the
                  staff member.
                </p>
              </div>
              <p className="text-md text-gray-500 mt-2">
                Are you sure you want to delete this shift?
              </p>
            </ModalBody>
            <Divider />
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={() => mutate(availability._id)}
                isLoading={isPending}
              >
                Decline
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DeclineLeaveRequest;
