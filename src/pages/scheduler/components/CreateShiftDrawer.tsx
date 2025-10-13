/* eslint-disable @typescript-eslint/no-explicit-any */
import { EMPTY_ARRAY } from "@/constants/empty";
import { useGetClients, type ClientFilter } from "@/states/apis/client";
import { useStaffs } from "@/states/apis/staff";
import type { IClient } from "@/types/client";
import type { User } from "@/types/user";
import { getDisplayName } from "@/utils/strings";
import {
  addToast,
  Autocomplete,
  AutocompleteItem,
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
import { useFormik } from "formik";
import {
  Calendar,
  Milestone,
  Save,
  UserCheck,
  User as UserIcon,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import MultiSelectAutocomplete from "./MultiSelectAutocomplete";
import { set } from "date-fns";
import {
  AllowanceOptions,
  ErrorMessages,
  PayMethodOptions,
  ShiftTypeKeys,
  ShiftTypeOptions,
} from "../constant";
import type {
  CreateShiftDrawerProps,
  DateValue,
  IShiftValues,
  TimeValue,
} from "@/types/shift";
import { useMutation } from "@tanstack/react-query";
import { createNewShift } from "@/states/apis/shift";
import { AxiosError } from "axios";

const PRICE_BOOK_MOCKUP: any[] = [];
const FUNDS_MOCKUP: any[] = [];

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

const CreateShiftDrawer = ({
  isOpen,
  onOpenChange,
}: CreateShiftDrawerProps) => {
  const { mutate: mutateAddShift } = useMutation({
    mutationFn: createNewShift,
    onSuccess: (data) => {
      console.log("data", data);
      addToast({
        title: "Add shift successfully",
        color: "success",
        timeout: 2000,
        isClosing: true,
      });
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

  const [filter] = useState<ClientFilter>({
    query: "",
    page: 1,
    limit: 10,
    sort: "createdAt",
    order: "asc",
  });

  const { data: dataClients } = useGetClients(filter);
  const { data: dataCarers } = useStaffs(filter);

  const clients = dataClients?.data || EMPTY_ARRAY;
  const carers = dataCarers?.data || EMPTY_ARRAY;

  const { values, setValues, handleSubmit, errors } = useFormik<IShiftValues>({
    initialValues: initialValues,
    validationSchema: shiftSchema,
    onSubmit: (values) => {
      mutateAddShift(values);
    },
  });

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
    return combined.getTime(); // returns timestamp in ms
  };

  console.log("errors", errors);
  console.log("values", values);

  return (
    <Drawer
      isOpen={isOpen}
      closeButton={<></>}
      size="5xl"
      onOpenChange={onOpenChange}
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="flex items-center justify-between bg-conten1">
              <div>
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
                  onPress={() => handleSubmit()}
                  startContent={<Save size={16} />}
                >
                  Save
                </Button>
              </div>
            </DrawerHeader>
            <DrawerBody className="bg-background px-3">
              <div className="py-4 px-3 rounded-lg mt-2 bg-content1">
                <div className="flex items-center gap-2">
                  <Users size={20} color={"green"} />
                  <span className="font-medium text-md">Client</span>
                </div>
                <div className="h-2"></div>
                <Divider />
                <div className="h-4"></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Choose client</span>
                  <Autocomplete
                    size="sm"
                    className="max-w-xs"
                    onSelectionChange={(value) => {
                      setValues((prev) => {
                        const updatedClientSchedules = [
                          ...prev.clientSchedules,
                        ];

                        if (updatedClientSchedules.length > 0) {
                          // Update only the first item
                          updatedClientSchedules[0] = {
                            ...updatedClientSchedules[0],
                            client: value as string,
                            // Keep existing timeFrom and timeTo intact
                          };
                        } else {
                          // If no schedules yet, create one
                          updatedClientSchedules.push({
                            client: value as string,
                            timeFrom: null,
                            timeTo: null,
                          });
                        }

                        return {
                          ...prev,
                          clientSchedules: updatedClientSchedules,
                        };
                      });
                    }}
                    placeholder="Type to search client by name"
                  >
                    {clients.map((client: IClient) => {
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
                </div>
                <div className="h-4"></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Price book</span>
                  <Autocomplete
                    size="sm"
                    className="max-w-xs"
                    placeholder="Select"
                  >
                    {PRICE_BOOK_MOCKUP.map((pricebookItem) => (
                      <AutocompleteItem key={pricebookItem.key}>
                        {pricebookItem.label}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
                <div className="h-4"></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Funds</span>
                  <Autocomplete
                    size="sm"
                    className="max-w-xs"
                    placeholder="Select"
                  >
                    {FUNDS_MOCKUP.map((fundItem) => (
                      <AutocompleteItem key={fundItem.key}>
                        {fundItem.label}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
              </div>
              <div className="py-4 px-3 rounded-lg mt-2 bg-content1">
                <div className="flex items-center gap-2">
                  <UserCheck size={20} color={"green"} />
                  <span className="font-medium text-md">Shift</span>
                </div>
                <div className="h-2"></div>
                <Divider />
                <div className="h-4"></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Shift Type</span>
                  <Autocomplete
                    size="sm"
                    className="max-w-xs"
                    isClearable={false}
                    defaultSelectedKey={`${ShiftTypeOptions[0].key}`}
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
                </div>
                <div className="h-4"></div>
                <div className="flex justify-between">
                  <span className="text-sm">Additional Shift Types</span>
                  <MultiSelectAutocomplete
                    options={ShiftTypeOptions}
                    onChangeOptions={(values) => {
                      setValues((prev) => ({
                        ...prev,
                        additionalShiftTypes: values,
                      }));
                    }}
                  />
                </div>
                <div className="h-4"></div>
                <div className="flex justify-between">
                  <span className="text-sm">Allowance</span>
                  <MultiSelectAutocomplete
                    options={AllowanceOptions}
                    onChangeOptions={(values) => {
                      setValues((prev) => ({
                        ...prev,
                        allowances: values,
                      }));
                    }}
                  />
                </div>
              </div>
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
                  <DatePicker
                    className="w-80"
                    showMonthAndYearPickers
                    label=""
                    name="birthdate"
                    onChange={(date: DateValue | null) => {
                      if (date && date.year && date.month && date.day) {
                        setDate(date);
                      }
                    }}
                  />
                </div>
                <div className="h-4"></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Time</span>
                  <div className="flex items-center gap-2">
                    <TimeInput
                      className="w-40"
                      label=""
                      name="birthdate"
                      onChange={(time) => {
                        console.log("timeeee", time);
                        setStartTime(time);
                      }}
                    />
                    -
                    <TimeInput
                      className="w-40"
                      label=""
                      name="birthdate"
                      onChange={(time) => {
                        console.log("timeeee", time);
                        setEndTime(time);
                      }}
                    />
                  </div>
                </div>
                <div className="h-4"></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Address</span>
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
                </div>
                <div className="h-4"></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Unit/Apartment Number</span>
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
                </div>
                <div className="h-4"></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Shift Bonus</span>
                  <Switch
                    isSelected={isBonus}
                    onChange={() => setIsBonus(!isBonus)}
                  />
                </div>
                {isBonus ? (
                  <>
                    <div className="h-4"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Bonus Amount</span>
                      <Input
                        label=""
                        type="number"
                        placeholder="Enter Bonus Amount"
                        startContent={
                          <span className="text-default-400 text-small">$</span>
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
                  <Autocomplete
                    size="sm"
                    className="max-w-xs"
                    onSelectionChange={(value) => {
                      setValues((prev) => {
                        const updatedStaffSchedules = [...prev.staffSchedules];

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
                </div>
                <div className="h-4"></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Choose pay group</span>
                  <Autocomplete
                    size="sm"
                    className="max-w-xs"
                    placeholder="Select"
                    defaultSelectedKey={`${PayMethodOptions[0].key}`}
                    onValueChange={(value) => {
                      setValues((prev) => {
                        const updatedStaffSchedules = [...prev.staffSchedules];

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
                </div>
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
                </div>
                <div className="h-4"></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mileage</span>
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
                </div>
                <div className="h-4"></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Company Vehicle</span>
                  <Switch
                    isSelected={values.isCompanyVehicle}
                    onValueChange={(value) =>
                      setValues((prev) => ({
                        ...prev,
                        isCompanyVehicle: value,
                      }))
                    }
                  />
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
  );
};

export default CreateShiftDrawer;
