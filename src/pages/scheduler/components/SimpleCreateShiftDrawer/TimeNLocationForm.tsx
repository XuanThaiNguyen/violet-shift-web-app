import { useMemo, useState } from "react";
import { Users } from "lucide-react";
import {
  DatePicker,
  Divider,
  Input,
  Switch,
  type DateValue,
} from "@heroui/react";
import { Select } from "@/components/select/Select";

// apis
import { useGetClients } from "@/states/apis/client";
import { useGetPrices } from "@/states/apis/prices";
import { useGetFundingsByUser } from "@/states/apis/funding";

// constants
import { EMPTY_ARRAY } from "@/constants/empty";

// utils
import { getDisplayName } from "@/utils/strings";

// types
import type { FC, SetStateAction } from "react";
import type { IClient } from "@/types/client";
import type { IShiftValues } from "@/types/shift";
import type { FormikErrors } from "formik";
import type { SelectOption } from "@/components/select/Select";

type TimeNLocationFormProps = {
  values: IShiftValues;
  setValues: (
    values: SetStateAction<IShiftValues>,
    shouldValidate?: boolean
  ) => Promise<FormikErrors<IShiftValues>> | Promise<void>;
};

const TimeNLocationForm: FC<TimeNLocationFormProps> = ({
  values,
  setValues,
}) => {
  const [isBonus, setIsBonus] = useState(false);

  return (
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
      </div>
      <div className="h-4"></div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Time</span>
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
        <Switch isSelected={isBonus} onChange={() => {
          setIsBonus(!isBonus);
          setValues((prev) => ({ ...prev, bonus: 0 }));
        }} />
      </div>
      {isBonus && (
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
              value={values.bonus?.toString()}
              onValueChange={(value) => {
                setValues((prev) => ({ ...prev, bonus: +value }));
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TimeNLocationForm;
