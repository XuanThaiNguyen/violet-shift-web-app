import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useEffect, useState } from "react";

interface UpdateConfirmProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const UpdateConfirm = ({
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}: UpdateConfirmProps) => {
  const [internalOpen, setInternalOpen] = useState(isOpen);

  useEffect(() => {
    setInternalOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    if (isLoading) return;
    setInternalOpen(false);
    setTimeout(onClose, 200);
  };

  return (
    <Modal
      isOpen={internalOpen}
      onClose={handleClose}
      size="2xl"
      placement="top"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-lg font-semibold">
              Update Shift
            </ModalHeader>
            <Divider />
            <ModalBody>
              <div className="p-3 bg-warning-50 border border-warning-100 rounded-md mt-2">
                <p className="font-semibold">
                  Are you sure you want to update this shift?
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  This action will update this shift. Date and time changes may
                  not be irreversible.
                </p>
              </div>
            </ModalBody>
            <Divider />
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={onConfirm}
                isLoading={isLoading}
                isDisabled={isLoading}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UpdateConfirm;
