import {
  createNewShift,
  deleteShift,
  useGetShiftDetail,
  useGetStaffSchedulesByShift,
} from "@/states/apis/shift";
import type { DateValue, IShiftValues, TimeValue } from "@/types/shift";
import { formatTimeRange } from "@/utils/datetime";
import {
  addToast,
  Button,
  DatePicker,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Input,
  Switch,
  TimeInput,
} from "@heroui/react";
import { parseDate, parseTime } from "@internationalized/date";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { format, fromUnixTime, set } from "date-fns";
import { useFormik } from "formik";
import { ArrowLeft, Calendar, Edit, Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import {
  AllowanceOptions,
  ErrorMessages,
  PayMethodOptions,
  ShiftTypeKeys,
  ShiftTypeOptions,
} from "../constant";
import DeleteConfirm from "./DeleteConfirm";
import ClientForm from "./SimpleCreateShiftDrawer/ClientForm";
import ShiftInfoForm from "./SimpleCreateShiftDrawer/ShiftInfoForm";
import CarerForm from "./SimpleCreateShiftDrawer/CarerForm";
import TaskForm from "./SimpleCreateShiftDrawer/TaskForm";
import MilleageSection from "./ShiftDetail/MilleageSection";
import MilleageForm from "./SimpleCreateShiftDrawer/MilleageForm";

const initialValues = {
  clientSchedules: [],
  staffSchedules: [],
  shiftType: ShiftTypeOptions[0].key,
  additionalShiftTypes: [],
  allowances: [AllowanceOptions[0].key],
  timeFrom: 0,
  timeTo: 0,
  paymentMethod: PayMethodOptions[0].key,
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
  onOpenChange: (isOpen: boolean) => void;
  selectedShiftId?: string;
  mode: "add" | "view";
  onClose: () => void;
  isFromCreate?: boolean;
}

const ShiftDrawer = ({
  isOpen,
  selectedShiftId,
  mode,
  onClose,
  isFromCreate,
}: ShiftDrawerProps) => {
  const [isEdit, setIsEdit] = useState(mode === "add");
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
    data: staffSchedules,
    // isLoading: staffScheduleLoading,
  } = useGetStaffSchedulesByShift(selectedShiftId || "");

  useMemo(() => {
    const nineAm = new Date();
    nineAm.setHours(9, 0, 0, 0);
    const nineAmUnix = nineAm.getTime();
    const defaultFrom =
      Date.now() > nineAmUnix ? nineAmUnix + 1000 * 60 * 60 * 24 : nineAmUnix;
    const defaultTo = defaultFrom + 1000 * 60 * 60 * 1;
    initialValues.timeFrom = defaultFrom;
    initialValues.timeTo = defaultTo;
  }, [])
  
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
    if (dataShiftDetail && !isLoading && isSuccess) {
      setValues((prev) => ({ ...prev, ...dataShiftDetail }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataShiftDetail, isLoading, isSuccess]);

  const [startTime, setStartTime] = useState<TimeValue | null>(null);
  const [endTime, setEndTime] = useState<TimeValue | null>(null);
  const [date, setDate] = useState<DateValue | null>(null);
  const [isBonus, setIsBonus] = useState<boolean>(false);

  useEffect(() => {
    if (!date) return;

    setValues((prev) => {
      let newTimeFrom = prev.timeFrom;
      let newTimeTo = prev.timeTo;

      if (startTime) {
        newTimeFrom = combineDateTime(date, startTime);
      }
      if (endTime) {
        newTimeTo = combineDateTime(date, endTime);
      }

      const updatedClientSchedules = [...prev.clientSchedules];
      if (updatedClientSchedules.length > 0) {
        updatedClientSchedules[0] = {
          ...updatedClientSchedules[0],
          timeFrom: newTimeFrom,
          timeTo: newTimeTo,
        };
      } else {
        updatedClientSchedules.push({
          client: null,
          timeFrom: newTimeFrom,
          timeTo: newTimeTo,
          priceBook: "",
          fund: "",
        });
      }

      const updatedStaffSchedules = [...prev.staffSchedules];
      if (updatedStaffSchedules.length > 0) {
        updatedStaffSchedules[0] = {
          ...updatedStaffSchedules[0],
          timeFrom: newTimeFrom,
          timeTo: newTimeTo,
        };
      } else {
        updatedStaffSchedules.push({
          staff: null,
          timeFrom: newTimeFrom,
          timeTo: newTimeTo,
          paymentMethod: PayMethodOptions[0].key,
        });
      }

      return {
        ...prev,
        timeFrom: newTimeFrom,
        timeTo: newTimeTo,
        clientSchedules: updatedClientSchedules,
        staffSchedules: updatedStaffSchedules,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, startTime, endTime]);

  const combineDateTime = (d: DateValue, t: TimeValue) => {
    const combined = set(new Date(d.year, d.month - 1, d.day), {
      hours: t.hour,
      minutes: t.minute,
      seconds: 0,
      milliseconds: 0,
    });
    return combined.getTime();
  };

  const unixTimestamp = values.timeFrom!; // e.g., 1739385600000 (ms)
  const jsDate = fromUnixTime(unixTimestamp / 1000);
  const isoDate = jsDate.toISOString().split("T")[0]; // "2025-07-21"
  const dateValue = parseDate(isoDate); // DateValue

  const timeFrom = values.timeFrom
    ? parseTime(
        fromUnixTime(values.timeFrom / 1000)
          .toISOString()
          .split("T")[1]
          .slice(0, 5)
      )
    : null;

  const timeTo = values.timeTo
    ? parseTime(
        fromUnixTime(values.timeTo / 1000)
          .toISOString()
          .split("T")[1]
          .slice(0, 5)
      )
    : null;

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
                  {isEdit && !isFromCreate ? (
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
                      if (!isFromCreate) {
                        setIsEdit(false);
                      }
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
                      {isFromCreate ? "Save" : "Update"}
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
                <ClientForm values={values} setValues={setValues} />

                <div className="h-2"></div>

                <ShiftInfoForm values={values} setValues={setValues} />

                {/* date n time section */}
                <div className="h-2"></div>
                <div className="py-4 px-3 rounded-lg bg-content1">
                  <div className="flex items-center gap-2">
                    <Calendar size={20} color={"red"} />
                    <span className="font-medium text-md">Time & Location</span>
                  </div>
                  <div className="h-2"></div>
                  <Divider />
                  <div className="h-4"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Date</span>
                    {isEdit ? (
                      <DatePicker
                        className="w-80"
                        showMonthAndYearPickers
                        label=""
                        name="birthdate"
                        value={values.timeFrom ? dateValue : null}
                        onChange={(date: DateValue | null) => {
                          if (date && date.year && date.month && date.day) {
                            setDate(date);
                          }
                        }}
                      />
                    ) : (
                      <span className="font-medium text-md">
                        {format(
                          fromUnixTime(values.timeFrom! / 1000),
                          "EEE, dd MMMM yyyy"
                        )}
                      </span>
                    )}
                  </div>
                  <div className="h-4"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Time</span>
                    {isEdit ? (
                      <div className="flex items-center gap-2">
                        <TimeInput
                          className="w-40"
                          label=""
                          name="birthdate"
                          value={values.timeFrom ? timeFrom : null}
                          onChange={(time) => {
                            setStartTime(time);
                          }}
                        />
                        -
                        <TimeInput
                          className="w-40"
                          label=""
                          name="birthdate"
                          value={values.timeTo ? timeTo : null}
                          onChange={(time) => {
                            setEndTime(time);
                          }}
                        />
                      </div>
                    ) : (
                      <span className="font-medium text-md">
                        {formatTimeRange(
                          values.timeFrom! / 1000,
                          values.timeTo! / 1000
                        )}
                      </span>
                    )}
                  </div>
                  <div className="h-4"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Address</span>
                    {isEdit ? (
                      <Input
                        label=""
                        type="text"
                        placeholder="Enter Address"
                        name="address"
                        className="w-80"
                        value={values.address}
                        onValueChange={(value) => {
                          setValues((prev) => ({ ...prev, address: value }));
                        }}
                      />
                    ) : (
                      <div className="max-w-md">
                        <span className="font-medium text-md text-right">
                          {values.address}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="h-4"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Unit/Apartment Number</span>
                    {isEdit ? (
                      <Input
                        label=""
                        type="text"
                        placeholder="Enter Unit/Apartment Number"
                        name="unitNumber"
                        className="w-80"
                        value={values.unitNumber}
                        onValueChange={(value) => {
                          setValues((prev) => ({ ...prev, unitNumber: value }));
                        }}
                      />
                    ) : (
                      <span className="font-medium text-md">
                        {values.unitNumber}
                      </span>
                    )}
                  </div>
                  {isEdit && (
                    <>
                      <div className="h-4"></div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Shift Bonus</span>
                        <Switch
                          isSelected={isBonus}
                          onChange={() => setIsBonus(!isBonus)}
                        />
                      </div>
                    </>
                  )}
                  {isEdit && isBonus && (
                    <>
                      <div className="h-4"></div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Bonus Amount</span>
                        <Input
                          label=""
                          type="number"
                          placeholder="Enter Bonus Amount"
                          startContent={
                            <span className="text-default-400 text-small">
                              $
                            </span>
                          }
                          name="bonus"
                          className="w-80"
                          value={values.bonus}
                          onValueChange={(value) => {
                            setValues((prev) => ({ ...prev, bonus: value }));
                          }}
                        />
                      </div>
                    </>
                  )}
                  {!isEdit ? (
                    <>
                      <div className="h-4"></div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Bonus Amount</span>
                        <span className="font-medium text-md">
                          ${values.bonus || 0}
                        </span>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>

                <div className="h-2"></div>
                <CarerForm values={values} setValues={setValues} />

                <div className="h-2"></div>
                <TaskForm values={values} setValues={setValues} />

                <div className="h-2"></div>
                <MilleageForm values={values} setValues={setValues} />
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
