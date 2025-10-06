import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
} from "@heroui/react";

interface ArchiveClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  clientName: string;
  isPending: boolean;
}

const ArchiveClientModal = ({
  isOpen,
  onClose,
  onConfirm,
  clientName,
  isPending,
}: ArchiveClientModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" placement="top">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-lg font-semibold">
              Archive Client
            </ModalHeader>
            <Divider />
            <div className="h-2"></div>
            <ModalBody>
              <p className="text-md text-gray-500">
                Are you sure you want to archive{" "}
                <span className="text-md font-semibold text-danger">
                  {clientName}
                </span>
                ?
              </p>

              <div className="p-3 bg-warning-50 border border-warning-100 rounded-md mt-2">
                <p className="font-semibold">This action cannot be undone</p>
                <p className="text-sm text-gray-500 mt-2">
                  All shifts scheduled from tomorrow onwards will be removed.
                  Please manually delete any shifts for today and contact the
                  assigned staff members.
                </p>
              </div>
            </ModalBody>
            <div className="h-2"></div>
            <Divider />
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="danger" onPress={onConfirm} isLoading={isPending}>
                Archive Client
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ArchiveClientModal;
