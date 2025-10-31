import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import { useFormik } from "formik";
import * as Yup from "yup";

interface PriceHeaderInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: ({ name }: { name: string }) => void;
  name?: string;
  mode: "add" | "edit" | "duplicate";
}

const PriceHeaderInfoModal = ({
  isOpen,
  onClose,
  onConfirm,
  name = "",
  mode = "add",
}: PriceHeaderInfoModalProps) => {
  console.log("namename", name);

  const {
    values,
    handleSubmit,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
  } = useFormik<{
    name: string;
  }>({
    initialValues: {
      name,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
    }),
    onSubmit: ({ name }) => {
      onConfirm({ name });
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" placement="top">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-lg font-semibold">
              {mode === "edit"
                ? "Edit"
                : mode === "duplicate"
                ? "Duplicate"
                : "Add"}{" "}
              Price Book
            </ModalHeader>
            <Divider />
            <div className="h-2"></div>
            <ModalBody>
              <form>
                <span>Name</span>
                <div className="h-2"></div>
                <Input
                  type="text"
                  name="name"
                  isRequired
                  placeholder="Enter name"
                  isInvalid={!!errors.name && touched.name}
                  errorMessage={errors.name && touched.name ? errors.name : ""}
                  value={values.name}
                  onValueChange={(value) => {
                    setFieldValue("name", value);
                  }}
                  onBlur={() => {
                    setFieldTouched("name", true);
                  }}
                />
                <div className="h-6"></div>
                <Divider />
                <div className="h-6"></div>
                <div className="flex justify-end gap-2">
                  <Button variant="flat" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color={"primary"} onPress={() => handleSubmit()}>
                    Save
                  </Button>
                </div>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PriceHeaderInfoModal;
