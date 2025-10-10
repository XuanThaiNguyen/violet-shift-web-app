import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import { MessageSquareWarning } from "lucide-react";

interface ArchiveWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ArchiveWarningModal = ({
  isOpen,
  onClose,
  onConfirm,
}: ArchiveWarningModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" placement="top">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-lg font-semibold gap-2">
              <MessageSquareWarning color={"red"} />
              Warning
            </ModalHeader>
            <Divider />
            <ModalBody>
              <span>
                When archiving Price Guides, any future shifts (including
                recurring shifts) with this Price Guide will keep the archived
                price and can be invoiced with the archived price. To change to
                a live Price Guide the shifts will need to be updated directly.
                Do you want to continue?
              </span>
              <Divider />
              <div className="flex justify-end gap-2">
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color={"danger"} onPress={onConfirm}>
                  Archive
                </Button>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ArchiveWarningModal;
