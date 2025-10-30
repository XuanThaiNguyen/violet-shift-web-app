import {
  createNewShift,
  deleteShift,
  useGetClientSchedulesByShift,
  useGetShiftDetail,
  useGetStaffSchedulesByShift,
  useGetTasksByShift,
} from "@/states/apis/shift";
import type { IShiftValues, IStaffSchedule } from "@/types/shift";
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
import { ArrowLeft, Edit, Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import { ErrorMessages, ShiftTypeKeys, ShiftTypeOptions } from "../constant";
import DeleteConfirm from "./DeleteConfirm";
import { EMPTY_ARRAY } from "@/constants/empty";
import SimpleUpdateShiftLayout from "./ShiftLayouts/SimpleUpdateShiftLayout";
import ViewShiftLayout from "./ShiftLayouts/ViewShiftLayout";

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
};

const clientScheduleSchema = Yup.object().shape({
  client: Yup.string().required(),
  timeFrom: Yup.number().required(),
  timeTo: Yup.number().required(),
});

const staffScheduleSchema = Yup.object().shape({
  staff: Yup.string().required("Staff is required"),
  timeFrom: Yup.string().required("Staff Time From is required"),
  timeTo: Yup.string().required("Staff Time To is required"),
});

const shiftSchema = Yup.object().shape({
  clientSchedules: Yup.array().of(clientScheduleSchema).required(),
  staffSchedules: Yup.array().of(staffScheduleSchema).required(),
  shiftType: Yup.string()
    .oneOf(ShiftTypeKeys, "Invalid key")
    .required("Shift Type is required"),
  timeFrom: Yup.string().required("Time From is required"),
  timeTo: Yup.string().required("Time To is required"),
  address: Yup.string().optional(),
  isCompanyVehicle: Yup.boolean().optional(),
  mileage: Yup.string().optional(),
  mileageCap: Yup.string().optional(),
});

interface ShiftDrawerProps {
  isOpen: boolean;
  selectedShiftId?: string;
  onClose: () => void;
}

const ShiftDrawer = ({
  isOpen,
  selectedShiftId,
  onClose,
}: ShiftDrawerProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [internalOpen, setInternalOpen] = useState(isOpen);

  const queryClient = useQueryClient();

  const { mutate: mutateAddShift } = useMutation({
    mutationFn: createNewShift,
    onSuccess: () => {
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
            return (
              staffSchedules?.some(
                (schedule) => schedule.staff === secondKey
              ) || false
            );
          }
          return false;
        },
      });
      onClose();
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const errorCode = error.response?.data?.code;
        const msg = ErrorMessages[errorCode] ?? "Something went wrong";
        addToast({
          title: msg,
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

  const {
    data: dataShiftDetail,
    isLoading,
    isSuccess,
  } = useGetShiftDetail(selectedShiftId);

  const {
    data: staffSchedules = EMPTY_ARRAY,
    isLoading: staffScheduleLoading,
  } = useGetStaffSchedulesByShift(selectedShiftId || "");

  const {
    data: clientSchedules = EMPTY_ARRAY,
    isLoading: clientScheduleLoading,
  } = useGetClientSchedulesByShift(selectedShiftId || "");

  const { data: tasks = EMPTY_ARRAY, isLoading: tasksLoading } =
    useGetTasksByShift(selectedShiftId || "");

  const fullShiftLoading =
    isLoading || staffScheduleLoading || clientScheduleLoading || tasksLoading;

  useMemo(() => {
    if (selectedShiftId) return;
    const nineAm = new Date();
    nineAm.setHours(9, 0, 0, 0);
    const nineAmUnix = nineAm.getTime();
    const defaultFrom =
      Date.now() > nineAmUnix ? nineAmUnix + 1000 * 60 * 60 * 24 : nineAmUnix;
    const defaultTo = defaultFrom + 1000 * 60 * 60 * 1;
    initialValues.timeFrom = defaultFrom;
    initialValues.timeTo = defaultTo;
  }, [selectedShiftId]);

  const { mutate: mutateDeleteShift } = useMutation({
    mutationFn: deleteShift,
    onSuccess: () => {
      addToast({
        title: "Delete shift successfully",
        color: "success",
      });
      queryClient.removeQueries({
        predicate: (query) => {
          const firstKey = query.queryKey[0];
          const secondKey = query.queryKey[1];
          if (firstKey === "shiftDetail") {
            return secondKey === selectedShiftId;
          }
          if (firstKey === "staffSchedulesByShift") {
            return secondKey === selectedShiftId;
          }
          if (firstKey === "staffSchedules") {
            return (
              staffSchedules?.some(
                (schedule) => schedule.staff === secondKey
              ) || false
            );
          }
          return false;
        },
      });
      setIsDeleteConfirmOpen(false);
      onClose();
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const errorCode = error.response?.data?.code;
        const msg = ErrorMessages[errorCode] ?? "Something went wrong";
        addToast({
          title: msg,
          color: "danger",
          timeout: 2000,
          isClosing: true,
        });
      }
    },
  });

  const { values, setValues, handleSubmit } = useFormik<IShiftValues>({
    initialValues: initialValues,
    validationSchema: shiftSchema,
    onSubmit: (values) => {
      mutateAddShift(values);
    },
  });

  const closeDrawer = () => {
    setIsDeleteConfirmOpen(false);
    setInternalOpen(false);
    setTimeout(onClose, 200);
  };

  useEffect(() => {
    setInternalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (dataShiftDetail && !fullShiftLoading && isSuccess) {
      setValues((prev) => ({
        ...prev,
        ...(dataShiftDetail as unknown as IShiftValues),
        clientSchedules: clientSchedules,
        tasks: tasks,
        staffSchedules: staffSchedules as IStaffSchedule[],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataShiftDetail, isSuccess, fullShiftLoading]);

  return (
    <>
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
                  {isEdit ? (
                    <Button
                      size="md"
                      className="bg-content1 border-1 border-divider"
                      startContent={<ArrowLeft size={16} />}
                      onPress={() => setIsEdit(false)}
                    >
                      Go Back
                    </Button>
                  ) : (
                    <></>
                  )}
                  <Button
                    size="md"
                    className="bg-content1 border-1 border-divider"
                    startContent={<X size={16} />}
                    onPress={() => {
                      onClose();
                    }}
                  >
                    Close
                  </Button>
                </div>
                {isEdit ? (
                  <div className="flex items-center gap-2">
                    <Button
                      size="md"
                      color={"primary"}
                      onPress={() => handleSubmit()}
                      startContent={<Save size={16} />}
                    >
                      Update
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      size="md"
                      color="danger"
                      onPress={() => setIsDeleteConfirmOpen(true)}
                    >
                      Delete
                    </Button>
                    <Button
                      size="md"
                      color={"default"}
                      onPress={() => setIsEdit(true)}
                      startContent={<Edit size={16} />}
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </DrawerHeader>
              <DrawerBody className="bg-background px-3 py-2">
                {isEdit ? (
                  <SimpleUpdateShiftLayout
                    values={values}
                    setValues={setValues}
                  />
                ) : (
                  <ViewShiftLayout values={values} />
                )}
              </DrawerBody>
              <DrawerFooter className="bg-background">
                <div className="h-2"></div>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={async () => {
          await mutateDeleteShift(selectedShiftId || "");
        }}
      />
    </>
  );
};

export default ShiftDrawer;
