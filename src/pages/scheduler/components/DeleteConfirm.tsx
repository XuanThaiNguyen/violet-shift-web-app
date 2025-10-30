import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";

interface DeleteConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirm = ({ isOpen, onClose, onConfirm }: DeleteConfirmProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" placement="top">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-lg font-semibold">
              Delete Shift
            </ModalHeader>
            <Divider />
            <ModalBody>
              <div className="p-3 bg-warning-50 border border-warning-100 rounded-md mt-2">
                <p className="font-semibold">This action cannot be undone</p>
                <p className="text-sm text-gray-500 mt-2">
                  All shifts scheduled from this day onwards will be removed.
                  Please contact the assigned staff members and inform them that the shift has been deleted.
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
              <Button color="danger" onPress={onConfirm}>
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirm;
