import { EMPTY_ARRAY, EMPTY_STRING } from "@/constants/empty";
import { useGetClients, type ClientFilter } from "@/states/apis/client";
import { useGetFundingsByUser } from "@/states/apis/funding";
import { useGetPrices } from "@/states/apis/prices";
import {
  createNewShift,
  deleteShift,
  useGetShiftDetail,
  useGetStaffSchedulesByShift,
} from "@/states/apis/shift";
import { useStaffs } from "@/states/apis/staff";
import type { DateValue, IShiftValues, TimeValue } from "@/types/shift";
import type { User } from "@/types/user";
import { formatTimeRange } from "@/utils/datetime";
import { getDisplayName } from "@/utils/strings";
import {
  addToast,
  Autocomplete,
  AutocompleteItem,
  Button,
  Checkbox,
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
import {
  ArrowLeft,
  Calendar,
  ClipboardList,
  Edit,
  Milestone,
  Save,
  UserCheck,
  User as UserIcon,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import {
  AllowanceOptions,
  ErrorMessages,
  PayMethodOptions,
  ShiftTypeKeys,
  ShiftTypeOptions,
} from "../constant";
import { getAllowanceTypeLabel, getShiftTypeLabel } from "../util";
import MultiSelectAutocomplete from "./MultiSelectAutocomplete";
import DeleteConfirm from "./DeleteConfirm";
import ClientForm from "./SimpleCreateShiftDrawer/ClientForm";
import ShiftInfoForm from "./SimpleCreateShiftDrawer/ShiftInfoForm";

const initialValues = {
  clientSchedules: [],
  staffSchedules: [],
  shiftType: ShiftTypeOptions[0].key,
  additionalShiftTypes: [],
  allowances: [AllowanceOptions[0].key],
  timeFrom: null,
  timeTo: null,
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

interface CreateShiftDrawerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedShiftId?: string;
  mode: "add" | "view";
  onClose: () => void;
  isFromCreate?: boolean;
}

const CreateShiftDrawer = ({
  isOpen,
  onOpenChange,
  selectedShiftId,
  mode,
  onClose,
  isFromCreate,
}: CreateShiftDrawerProps) => {
  const [isEdit, setIsEdit] = useState(mode === "add");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

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

  const [filter] = useState<ClientFilter>({
    query: "",
    page: 1,
    limit: 10,
    sort: "createdAt",
    order: "asc",
  });
  const { data: dataCarers } = useStaffs(filter);

  const carers = dataCarers?.data || EMPTY_ARRAY;

  const { values, setValues, handleSubmit } = useFormik<IShiftValues>({
    initialValues: initialValues,
    validationSchema: shiftSchema,
    onSubmit: (values) => {
      mutateAddShift(values);
    },
  });

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
  const [task, setTask] = useState<{
    name: string;
    isMandatory: boolean;
  }>({
    name: "",
    isMandatory: false,
  });

  const { data: dataPriceBooks } = useGetPrices();
  const _dataPriceBooks = dataPriceBooks || EMPTY_ARRAY;

  const { data: dataFunds } = useGetFundingsByUser({
    userId: values?.clientSchedules[0]?.client || "",
  });
  const _dataFunds = dataFunds || [];

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
        isOpen={isOpen}
        closeButton={<div></div>}
        size="5xl"
        onOpenChange={(open) => {
          if (!open) {
            setIsEdit(false);
          }
          onOpenChange?.(open);
        }}
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

                {/* <div className="py-4 px-3 rounded-lg bg-content1">
                  <div className="flex items-center gap-2">
                    <UserCheck size={20} color={"black"} />
                    <span className="font-medium text-md">Shift</span>
                  </div>
                  <div className="h-2"></div>
                  <Divider />
                  <div className="h-4"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Shift Type</span>
                    {isEdit ? (
                      <Autocomplete
                        size="sm"
                        className="max-w-xs"
                        isClearable={false}
                        defaultSelectedKey={
                          values.shiftType
                            ? values.shiftType
                            : `${ShiftTypeOptions[0].key}`
                        }
                        onSelectionChange={(value) => {
                          setValues((prev) => ({
                            ...prev,
                            shiftType: value as string,
                          }));
                        }}
                      >
                        {ShiftTypeOptions.map((shiftItem) => (
                          <AutocompleteItem key={shiftItem.key}>
                            {shiftItem.label}
                          </AutocompleteItem>
                        ))}
                      </Autocomplete>
                    ) : (
                      <span className="font-medium text-md">
                        {getShiftTypeLabel(values.shiftType)}
                      </span>
                    )}
                  </div>
                  <div className="h-4"></div>
                  <div className="flex justify-between">
                    <span className="text-sm">Additional Shift Types</span>
                    {isEdit ? (
                      <MultiSelectAutocomplete
                        selectedOptionsKeys={values.additionalShiftTypes}
                        options={ShiftTypeOptions}
                        onChangeOptions={(values) => {
                          setValues((prev) => ({
                            ...prev,
                            additionalShiftTypes: values,
                          }));
                        }}
                      />
                    ) : (
                      <div className="max-w-md">
                        <span className="font-medium text-md flex text-right">
                          {values.additionalShiftTypes?.length
                            ? values.additionalShiftTypes
                                .map(getShiftTypeLabel)
                                .join(", ")
                            : EMPTY_STRING}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="h-4"></div>
                  <div className="flex justify-between">
                    <span className="text-sm">Allowance</span>
                    {isEdit ? (
                      <MultiSelectAutocomplete
                        selectedOptionsKeys={values.allowances}
                        options={AllowanceOptions}
                        onChangeOptions={(values) => {
                          setValues((prev) => ({
                            ...prev,
                            allowances: values,
                          }));
                        }}
                      />
                    ) : (
                      <div className="max-w-md">
                        <span className="font-medium text-md flex text-right">
                          {values.allowances?.length
                            ? values.allowances
                                .map(getAllowanceTypeLabel)
                                .join(", ")
                            : EMPTY_STRING}
                        </span>
                      </div>
                    )}
                  </div>
                </div> */}
                <ShiftInfoForm values={values} setValues={setValues} />

                <div className="py-4 px-3 rounded-lg mt-2 bg-content1">
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
                <div className="py-4 px-3 rounded-lg mt-2 bg-content1">
                  <div className="flex items-center gap-2">
                    <UserIcon size={20} color={"blue"} />
                    <span className="font-medium text-md">Carer</span>
                  </div>
                  <div className="h-2"></div>
                  <Divider />
                  <div className="h-4"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Choose carer</span>
                    {isEdit ? (
                      <Autocomplete
                        size="sm"
                        className="max-w-xs"
                        onSelectionChange={(value) => {
                          setValues((prev) => {
                            const updatedStaffSchedules = [
                              ...prev.staffSchedules,
                            ];

                            if (updatedStaffSchedules.length > 0) {
                              updatedStaffSchedules[0] = {
                                ...updatedStaffSchedules[0],
                                staff: value as string,
                              };
                            } else {
                              updatedStaffSchedules.push({
                                staff: value as string,
                                timeFrom: null,
                                timeTo: null,
                                paymentMethod: PayMethodOptions[0].key,
                              });
                            }

                            return {
                              ...prev,
                              staffSchedules: updatedStaffSchedules,
                            };
                          });
                        }}
                        placeholder="Type to search carer by name"
                      >
                        {carers.map((client: User) => {
                          const _name = getDisplayName({
                            firstName: client.firstName,
                            lastName: client.lastName,
                            preferredName: client.preferredName,
                            salutation: client.salutation,
                            middleName: client.middleName,
                          });
                          return (
                            <AutocompleteItem key={client.id}>
                              {_name}
                            </AutocompleteItem>
                          );
                        })}
                      </Autocomplete>
                    ) : (
                      <span className="font-medium text-md">
                        {"Staff Here"}
                      </span>
                    )}
                  </div>
                  <div className="h-4"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Choose pay group</span>
                    {isEdit ? (
                      <Autocomplete
                        size="sm"
                        className="max-w-xs"
                        placeholder="Select"
                        defaultSelectedKey={`${PayMethodOptions[0].key}`}
                        onValueChange={(value) => {
                          setValues((prev) => {
                            const updatedStaffSchedules = [
                              ...prev.staffSchedules,
                            ];

                            if (updatedStaffSchedules.length > 0) {
                              updatedStaffSchedules[0] = {
                                ...updatedStaffSchedules[0],
                                paymentMethod: value as string,
                              };
                            } else {
                              updatedStaffSchedules.push({
                                staff: null,
                                timeFrom: null,
                                timeTo: null,
                                paymentMethod: PayMethodOptions[0].key,
                              });
                            }

                            return {
                              ...prev,
                              staffSchedules: updatedStaffSchedules,
                            };
                          });
                        }}
                      >
                        {PayMethodOptions.map((payGroupItem) => (
                          <AutocompleteItem key={payGroupItem.key}>
                            {payGroupItem.label}
                          </AutocompleteItem>
                        ))}
                      </Autocomplete>
                    ) : (
                      <span className="font-medium text-md">
                        {"Payment method here"}
                      </span>
                    )}
                  </div>
                </div>
                <div className="py-4 px-3 rounded-lg mt-2 bg-content1">
                  <div className="flex items-center gap-2">
                    <ClipboardList size={20} color={"pink"} />
                    <span className="font-medium text-md">Tasks</span>
                  </div>
                  <div className="h-2"></div>
                  <Divider />
                  <div className="h-4"></div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Input
                        label=""
                        type="text"
                        className="w-80"
                        value={task.name}
                        onValueChange={(value) => {
                          setTask((prev) => ({ ...prev, name: value }));
                        }}
                      />
                      <Checkbox
                        isSelected={task.isMandatory}
                        onValueChange={(value) =>
                          setTask((prev) => ({ ...prev, isMandatory: value }))
                        }
                      >
                        Mandatory
                      </Checkbox>
                    </div>
                    <Button
                      color="primary"
                      isDisabled={!task.name}
                      size="sm"
                      onPress={() => {
                        setValues((prev) => ({
                          ...prev,
                          tasks: [...prev.tasks, task],
                        }));
                        setTask({
                          name: "",
                          isMandatory: false,
                        });
                      }}
                    >
                      <p className={`text-bold text-md capitalize`}>Add</p>
                    </Button>
                  </div>
                  <div className="h-2"></div>
                  {values.tasks.length === 0 ? (
                    <></>
                  ) : (
                    values.tasks.map((_task, index) => (
                      <div
                        key={`${_task.name}-${index}`}
                        className="flex items-center justify-between py-2"
                      >
                        <span className="flex-1">{_task.name}</span>
                        <div className="flex items-center gap-8">
                          <span className="justify-start">
                            <span className="font-semibold">Mandatory: </span>
                            {_task.isMandatory ? "Yes" : "No"}
                          </span>
                          <Button
                            color="danger"
                            size="sm"
                            onPress={() => {
                              setValues((prev) => ({
                                ...prev,
                                tasks: prev.tasks.filter((_, i) => i !== index),
                              }));
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="py-4 px-3 rounded-lg mt-2 bg-content1">
                  <div className="flex items-center gap-2">
                    <Milestone size={20} color={"green"} />
                    <span className="font-medium text-md">Mileage</span>
                  </div>
                  <div className="h-2"></div>
                  <Divider />
                  <div className="h-4"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Mileage cap</span>
                    {isEdit ? (
                      <Input
                        label=""
                        type="number"
                        name="mileageCap"
                        className="w-80"
                        defaultValue="0"
                        value={values.mileageCap}
                        onValueChange={(value) => {
                          setValues((prev) => ({ ...prev, mileageCap: value }));
                        }}
                      />
                    ) : (
                      <span className="font-medium text-md">
                        {values.mileageCap}Km
                      </span>
                    )}
                  </div>
                  <div className="h-4"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Mileage</span>
                    {isEdit ? (
                      <Input
                        label=""
                        type="number"
                        name="mileage"
                        className="w-80"
                        defaultValue="0"
                        value={values.mileage}
                        onValueChange={(value) => {
                          setValues((prev) => ({ ...prev, mileage: value }));
                        }}
                      />
                    ) : (
                      <span className="font-medium text-md">
                        {values.mileage}Km
                      </span>
                    )}
                  </div>
                  <div className="h-4"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Company Vehicle</span>
                    {isEdit ? (
                      <Switch
                        isSelected={values.isCompanyVehicle}
                        onValueChange={(value) =>
                          setValues((prev) => ({
                            ...prev,
                            isCompanyVehicle: value,
                          }))
                        }
                      />
                    ) : (
                      <span className="font-medium text-md">
                        {values.isCompanyVehicle ? "Yes" : "No"}
                      </span>
                    )}
                  </div>
                  <div className="h-2"></div>
                </div>
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

export default CreateShiftDrawer;
