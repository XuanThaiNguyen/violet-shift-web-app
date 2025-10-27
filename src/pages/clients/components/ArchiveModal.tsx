import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
} from "@heroui/react";

interface ArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  clientName: string;
  isPending: boolean;
  mode: "staff" | "client";
}

const ArchiveModal = ({
  isOpen,
  onClose,
  onConfirm,
  clientName,
  isPending,
  mode,
}: ArchiveModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" placement="top">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-lg font-semibold">
              Archive {mode === "client" ? "Client" : "Staff"}
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
                Archive {mode === "client" ? "Client" : "Staff"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ArchiveModal;
