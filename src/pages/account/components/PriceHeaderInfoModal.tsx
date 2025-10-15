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
  onConfirm: ({
    title,
    externalId,
  }: {
    title: string;
    externalId: string;
  }) => void;
  priceBookTitle?: string;
  priceBookId?: string;
  mode: "add" | "edit" | "duplicate";
}

const PriceHeaderInfoModal = ({
  isOpen,
  onClose,
  onConfirm,
  priceBookTitle = "",
  priceBookId = "",
  mode = "add",
}: PriceHeaderInfoModalProps) => {
  const {
    values,
    handleSubmit,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
  } = useFormik<{
    title: string;
    externalId: string;
  }>({
    initialValues: {
      title: priceBookTitle,
      externalId: priceBookId,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      externalId: Yup.string().required("External ID is required"),
    }),
    onSubmit: ({ title, externalId }) => {
      console.log("123123123");

      onConfirm({ title, externalId });
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
                  name="title"
                  isRequired
                  placeholder="Enter title"
                  isInvalid={!!errors.title && touched.title}
                  errorMessage={
                    errors.title && touched.title ? errors.title : ""
                  }
                  value={values.title}
                  onValueChange={(value) => {
                    setFieldValue("title", value);
                  }}
                  onBlur={() => {
                    setFieldTouched("title", true);
                  }}
                />
                <div className="h-4"></div>
                <span>External ID</span>
                <div className="h-2"></div>
                <Input
                  type="text"
                  name="externalId"
                  isRequired
                  placeholder="Enter external ID"
                  isInvalid={!!errors.externalId && touched.externalId}
                  errorMessage={
                    errors.externalId && touched.externalId
                      ? errors.externalId
                      : ""
                  }
                  value={values.externalId}
                  onValueChange={(value) => {
                    setFieldValue("externalId", value);
                  }}
                  onBlur={() => {
                    setFieldTouched("externalId", true);
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
