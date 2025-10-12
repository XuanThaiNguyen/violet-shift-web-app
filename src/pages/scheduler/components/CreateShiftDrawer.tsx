/* eslint-disable @typescript-eslint/no-explicit-any */
import { EMPTY_ARRAY } from "@/constants/empty";
import { useGetClients, type ClientFilter } from "@/states/apis/client";
import { useStaffs } from "@/states/apis/staff";
import type { IClient } from "@/types/client";
import type { User } from "@/types/user";
import { getDisplayName } from "@/utils/strings";
import {
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
import {
  Calendar,
  Milestone,
  Save,
  UserCheck,
  User as UserIcon,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

interface CreateShiftDrawerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

interface IShift {
  clientId: string | null;
  shiftTypeId: string | null;
  additionalShiftTypeIds: string[] | null;
}

const PRICE_BOOK_MOCKUP: any[] = [];
const FUNDS_MOCKUP: any[] = [];

const PAY_GROUP_MOCKUP = [
  {
    label: "Use staff member's default paygroup",
    key: "1",
  },
  {
    label: "Default Casual",
    key: "2",
  },
];

const ALLOWANCE_MOCKUP = [
  {
    label: "Expense",
    key: "1",
  },
  {
    label: "Mileage",
    key: "2",
  },
  {
    label: "Sleepover",
    key: "3",
  },
];

const SHIFT_TYPES_MOCKUP = [
  {
    label: "Personal Care",
    key: "1",
  },
  {
    label: "Board and Lodging",
    key: "2",
  },
  {
    label: "Domestic Assistance",
    key: "3",
  },
  {
    label: "Night Shift",
    key: "4",
  },
  {
    label: "On Call",
    key: "5",
  },
  {
    label: "Recall to work",
    key: "6",
  },
];

const CreateShiftDrawer = ({
  isOpen,
  onOpenChange,
}: CreateShiftDrawerProps) => {
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

  const [shift, setShift] = useState<IShift>({
    clientId: null,
    shiftTypeId: null,
    additionalShiftTypeIds: null,
  });
  console.log("shift", shift);

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
                    onSelectionChange={(value) =>
                      setShift((prev) => ({
                        ...prev,
                        clientId: value as string,
                      }))
                    }
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
                    defaultSelectedKey="1"
                  >
                    {SHIFT_TYPES_MOCKUP.map((shiftItem) => (
                      <AutocompleteItem key={shiftItem.key}>
                        {shiftItem.label}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
                <div className="h-4"></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Additional Shift Types</span>
                  <Autocomplete size="sm" className="max-w-xs">
                    {SHIFT_TYPES_MOCKUP.map((shiftItem) => (
                      <AutocompleteItem key={shiftItem.key}>
                        {shiftItem.label}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
                <div className="h-4"></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Allowance</span>
                  <Autocomplete
                    size="sm"
                    className="max-w-xs"
                    placeholder="Select"
                  >
                    {ALLOWANCE_MOCKUP.map((allowanceItem) => (
                      <AutocompleteItem key={allowanceItem.key}>
                        {allowanceItem.label}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
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
                  />
                </div>
                <div className="h-4"></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Time</span>
                  <div className="flex items-center gap-2">
                    <TimeInput className="w-40" label="" name="birthdate" />
                    -
                    <TimeInput className="w-40" label="" name="birthdate" />
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
                    // isInvalid={!!errors.firstName && touched.firstName}
                    // errorMessage={
                    //   errors.firstName && touched.firstName ? errors.firstName : ""
                    // }
                    // value={values.firstName}
                    // onValueChange={(value) => {
                    //   setFieldValue("firstName", value);
                    // }}
                    // onBlur={() => {
                    //   setFieldTouched("firstName", true);
                    // }}
                  />
                </div>
                <div className="h-4"></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Unit/Apartment Number</span>
                  <Input
                    label=""
                    type="text"
                    placeholder="Enter Unit/Apartment Number"
                    name="apartmentNumber"
                    className="w-80"
                    // isInvalid={!!errors.firstName && touched.firstName}
                    // errorMessage={
                    //   errors.firstName && touched.firstName ? errors.firstName : ""
                    // }
                    // value={values.firstName}
                    // onValueChange={(value) => {
                    //   setFieldValue("firstName", value);
                    // }}
                    // onBlur={() => {
                    //   setFieldTouched("firstName", true);
                    // }}
                  />
                </div>
                <div className="h-4"></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Shift Bonus</span>
                  <Switch />
                </div>
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
                    onSelectionChange={(value) =>
                      setShift((prev) => ({
                        ...prev,
                        clientId: value as string,
                      }))
                    }
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
                  >
                    {PAY_GROUP_MOCKUP.map((payGroupItem) => (
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
                    type="text"
                    name="mileageCap"
                    className="w-80"
                    defaultValue={"0"}
                    // isInvalid={!!errors.firstName && touched.firstName}
                    // errorMessage={
                    //   errors.firstName && touched.firstName ? errors.firstName : ""
                    // }
                    // value={values.firstName}
                    // onValueChange={(value) => {
                    //   setFieldValue("firstName", value);
                    // }}
                    // onBlur={() => {
                    //   setFieldTouched("firstName", true);
                    // }}
                  />
                </div>
                <div className="h-4"></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mileage</span>
                  <Input
                    label=""
                    type="text"
                    name="mileage"
                    className="w-80"
                    defaultValue={"0"}
                    // isInvalid={!!errors.firstName && touched.firstName}
                    // errorMessage={
                    //   errors.firstName && touched.firstName ? errors.firstName : ""
                    // }
                    // value={values.firstName}
                    // onValueChange={(value) => {
                    //   setFieldValue("firstName", value);
                    // }}
                    // onBlur={() => {
                    //   setFieldTouched("firstName", true);
                    // }}
                  />
                </div>
                <div className="h-4"></div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Company Vehicle</span>
                  <Switch />
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
