import {
  usePostFunding,
  useUpdateFunding,
  type IAddFunding,
  type IFunding,
} from "@/states/apis/funding";
import {
  addToast,
  Button,
  DatePicker,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
} from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { isValid } from "date-fns";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ClientFundingMessages } from "../Constants";

interface FundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPending?: boolean;
  clientId: string;
  selectedFund?: IFunding | null;
}

export interface FundingModalValues {
  name: string;
  amount?: string;
  startDate?: string;
  expireDate?: string;
  isDefault?: boolean;
}

const initialValues: FundingModalValues = {
  name: "",
  isDefault: false,
};

const FundingModal = ({
  isOpen,
  onClose,
  clientId,
  selectedFund,
}: FundingModalProps) => {
  const queryClient = useQueryClient();

  const { mutate: mutateAdd, isPending: isPendingAdd } = useMutation({
    mutationFn: usePostFunding,
    onSuccess: () => {
      addToast({
        title: "Add fund successfully",
        color: "success",
        timeout: 2000,
        isClosing: true,
      });
      onClose();
      queryClient.invalidateQueries({ queryKey: ["fundings"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.data?.code) {
          addToast({
            title: ClientFundingMessages[error.response.data.code],
            color: "danger",
            timeout: 2000,
            isClosing: true,
          });
        }
      } else {
        addToast({
          title: "Add fund failed",
          color: "danger",
          timeout: 2000,
          isClosing: true,
        });
      }
    },
  });

  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useMutation({
    mutationFn: useUpdateFunding,
    onSuccess: () => {
      addToast({
        title: "Update fund successfully",
        color: "success",
        timeout: 2000,
        isClosing: true,
      });
      onClose();
      queryClient.invalidateQueries({ queryKey: ["fundings"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.data?.code) {
          addToast({
            title: ClientFundingMessages[error.response.data.code],
            color: "danger",
            timeout: 2000,
            isClosing: true,
          });
        }
      } else {
        addToast({
          title: "Update fund failed",
          color: "danger",
          timeout: 2000,
          isClosing: true,
        });
      }
    },
  });

  const {
    errors,
    touched,
    values,
    setFieldValue,
    setFieldTouched,
    handleSubmit,
  } = useFormik<FundingModalValues>({
    initialValues: selectedFund
      ? { ...initialValues, ...selectedFund }
      : initialValues,
    validationSchema: Yup.object({
      name: Yup.string().required("Title is required"),
      amount: Yup.number().min(0).optional(),
      startDate: Yup.date().optional(),
      expireDate: Yup.date().optional(),
      isDefault: Yup.boolean().optional(),
    }),
    onSubmit: (_values) => {
      if (selectedFund) {
        const params: IAddFunding = {
          client: clientId,
          name: _values.name,
          isDefault: _values.isDefault,
        };

        if (_values.startDate) {
          params.startDate = _values.startDate;
        }
        if (_values.expireDate) {
          params.expireDate = _values.expireDate;
        }
        if (_values.amount) {
          params.amount = _values.amount;
        }

        mutateUpdate({ id: selectedFund.id, values: params });
      } else {
        const submitValues = {
          ..._values,
          client: clientId,
        };
        mutateAdd(submitValues);
      }
    },
  });

  const _startDate =
    values.startDate && isValid(new Date(values.startDate))
      ? new Date(values.startDate)
      : null;
  const _expireDate =
    values.expireDate && isValid(new Date(values.expireDate))
      ? new Date(values.expireDate)
      : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" placement="top">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-lg font-semibold">
              {selectedFund ? "Edit Fund" : "Add Fund"}
            </ModalHeader>
            <Divider />
            <div className="h-2"></div>
            <ModalBody>
              <div className="flex items-center gap-8">
                <div className="flex-1">
                  <span>Name</span>
                  <div className="h-1"></div>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Enter name"
                    isInvalid={!!errors.name && touched.name}
                    errorMessage={
                      errors.name && touched.name ? errors.name : ""
                    }
                    value={values.name}
                    onValueChange={(value) => {
                      setFieldValue("name", value);
                    }}
                    onBlur={() => {
                      setFieldTouched("name", true);
                    }}
                  />
                </div>
                <div className="flex-1">
                  <span>Amount</span>
                  <div className="h-1"></div>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    startContent={
                      <span className="text-default-400 text-small">$</span>
                    }
                    name="amount"
                    value={values.amount}
                    onValueChange={(value) => {
                      setFieldValue("amount", value);
                    }}
                    onBlur={() => {
                      setFieldTouched("amount", true);
                    }}
                  />
                </div>
              </div>
              <div className="h-1"></div>
              <div className="flex items-center gap-8">
                <div className="flex-1">
                  <span>Start Date</span>
                  <div className="h-1"></div>
                  <DatePicker
                    showMonthAndYearPickers
                    value={
                      _startDate
                        ? new CalendarDate(
                            _startDate.getFullYear(),
                            _startDate.getMonth() + 1,
                            _startDate.getDate()
                          )
                        : null
                    }
                    onChange={(value) => {
                      if (value) {
                        const dateStr = `${value.year}-${String(
                          value.month
                        ).padStart(2, "0")}-${String(value.day).padStart(
                          2,
                          "0"
                        )}`;
                        setFieldValue(
                          "startDate",
                          new Date(dateStr).toISOString()
                        );
                      }
                    }}
                  />
                </div>
                <div className="flex-1">
                  <span>Expires Date</span>
                  <div className="h-1"></div>
                  <DatePicker
                    showMonthAndYearPickers
                    value={
                      _expireDate
                        ? new CalendarDate(
                            _expireDate.getFullYear(),
                            _expireDate.getMonth() + 1,
                            _expireDate.getDate()
                          )
                        : null
                    }
                    onChange={(value) => {
                      if (value) {
                        const dateStr = `${value.year}-${String(
                          value.month
                        ).padStart(2, "0")}-${String(value.day).padStart(
                          2,
                          "0"
                        )}`;
                        setFieldValue(
                          "expireDate",
                          new Date(dateStr).toISOString()
                        );
                      }
                    }}
                  />
                </div>
              </div>
              <div className="h-1"></div>
              <div className="flex items-center gap-2">
                <span>Default</span>
                <Switch
                  isSelected={values.isDefault}
                  onValueChange={() =>
                    setFieldValue("isDefault", !values.isDefault)
                  }
                />
              </div>
              <div className="h-2"></div>
            </ModalBody>
            <div className="h-2"></div>
            <Divider />
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                type="submit"
                onPress={() => handleSubmit()}
                isLoading={isPendingAdd || isPendingUpdate}
              >
                {selectedFund ? "Update" : "Save"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default FundingModal;
