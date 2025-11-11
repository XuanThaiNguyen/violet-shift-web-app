import { createNewShift } from "@/states/apis/shift";
import type { IShiftValues } from "@/types/shift";
import {
  addToast,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import { ErrorMessages, ShiftTypeKeys, ShiftTypeOptions } from "../constant";
import SimpleAddShiftLayout from "./ShiftLayouts/SimpleAddShiftLayout";

const initialValues: IShiftValues = {
  clientSchedules: [],
  staffSchedules: [],
  shiftType: ShiftTypeOptions[0].key,
  additionalShiftTypes: [],
  allowances: [],
  timeFrom: 0,
  timeTo: 0,
  isCompanyVehicle: false,
  tasks: [],
  clientClockOutRequired: false,
  staffClockOutRequired: false,
  instruction: "",
};

const clientScheduleSchema = Yup.object().shape({
  client: Yup.string().required(),
  timeFrom: Yup.number().required(),
  timeTo: Yup.number().required().min(Yup.ref("timeFrom"), "Time To must be greater than Time From"),
});

const staffScheduleSchema = Yup.object().shape({
  staff: Yup.string().required("Staff is required"),
  timeFrom: Yup.number().required("Staff Time From is required"),
  timeTo: Yup.number().required("Staff Time To is required").min(Yup.ref("timeFrom"), "Staff Time To must be greater than Staff Time From"),
});

const shiftSchema = Yup.object().shape({
  clientSchedules: Yup.array().of(clientScheduleSchema).required(),
  staffSchedules: Yup.array().of(staffScheduleSchema).required(),
  shiftType: Yup.string()
    .oneOf(ShiftTypeKeys, "Invalid key")
    .required("Shift Type is required"),
  timeFrom: Yup.number().required("Time From is required"),
  timeTo: Yup.number().required("Time To is required").min(Yup.ref("timeFrom"), "Time To must be greater than Time From"),
  address: Yup.string().optional(),
  isCompanyVehicle: Yup.boolean().optional(),
  mileage: Yup.string().optional(),
  mileageCap: Yup.string().optional(),
});

interface CreateShiftDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateShiftDrawer = ({ isOpen, onClose }: CreateShiftDrawerProps) => {
  const [internalOpen, setInternalOpen] = useState(isOpen);

  useMemo(() => {
    const nineAm = new Date();
    nineAm.setHours(9, 0, 0, 0);
    const nineAmUnix = nineAm.getTime();
    const defaultFrom =
      Date.now() > nineAmUnix ? nineAmUnix + 1000 * 60 * 60 * 24 : nineAmUnix;
    const defaultTo = defaultFrom + 1000 * 60 * 60 * 1;
    initialValues.timeFrom = defaultFrom;
    initialValues.timeTo = defaultTo;
  }, []);

  const queryClient = useQueryClient();

  const { mutate: mutateAddShift, isPending: isPendingAddShift } = useMutation({
    mutationFn: createNewShift,
    onSuccess: (_, payload) => {
      addToast({
        title: "Add shift successfully",
        color: "success",
        timeout: 2000,
        isClosing: true,
      });
      queryClient.removeQueries({
        predicate: (query) => {
          const firstKey = query.queryKey[0];
          const secondKey = query.queryKey[1];
          if (firstKey === "staffSchedules") {
            const staffSchedules = payload.staffSchedules;
            return (
              staffSchedules?.some(
                (schedule) => schedule.staff === secondKey
              ) || false
            );
          }
          return false;
        },
      });
      // maybe don't need this
      // queryClient.invalidateQueries({
      //   predicate: (query) => {
      //     const firstKey = query.queryKey[0];
      //     const secondKey = query.queryKey[1];
      //     if (firstKey === "staffSchedules") {
      //       const staffSchedules = payload.staffSchedules;
      //       return (
      //         staffSchedules?.some(
      //           (schedule) => schedule.staff === secondKey
      //         ) || false
      //       );
      //     }
      //     return false;
      //   },
      // });
      onClose();
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const errorCode = error.response?.data?.code;
        const msg = ErrorMessages[errorCode] ?? "Something went wrong";
        addToast({
          title: "Add shift failed",
          description: msg,
          color: "danger",
          timeout: 2000,
          isClosing: true,
        });
      } else {
        addToast({
          title: "Add shift failed",
          color: "danger",
          timeout: 2000,
          isClosing: true,
        });
      }
    },
  });

  const { values, setValues, handleSubmit, errors } = useFormik<IShiftValues>({
    initialValues: initialValues,
    validationSchema: shiftSchema,
    onSubmit: (values) => {
      mutateAddShift(values);
    },
  });

  const closeDrawer = () => {
    setInternalOpen(false);
    setTimeout(onClose, 200);
  };

  useEffect(() => {
    setInternalOpen(isOpen);
  }, [isOpen]);

  return (
    <Drawer
      isOpen={internalOpen}
      closeButton={<div></div>}
      size="5xl"
      onClose={closeDrawer}
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="flex items-center justify-between bg-conten1">
              <div className="flex items-center gap-2">
                <Button
                  size="md"
                  className="bg-content1 border-1 border-divider"
                  startContent={<X size={16} />}
                  onPress={onClose}
                >
                  Close
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="md"
                  color={"primary"}
                  isLoading={isPendingAddShift}
                  isDisabled={
                    !values.clientSchedules?.[0]?.client ||
                    !values.staffSchedules?.[0]?.staff ||
                    !values.clientSchedules[0]?.priceBook ||
                    !values.clientSchedules[0]?.fund
                  }
                  onPress={() => handleSubmit()}
                  startContent={<Save size={16} />}
                >
                  Save
                </Button>
              </div>
            </DrawerHeader>
            <DrawerBody className="bg-background px-3 py-2">
              <SimpleAddShiftLayout values={values} errors={errors} setValues={setValues} />
            </DrawerBody>
            <DrawerFooter className="bg-background">
              <div className="h-2"></div>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default CreateShiftDrawer;
