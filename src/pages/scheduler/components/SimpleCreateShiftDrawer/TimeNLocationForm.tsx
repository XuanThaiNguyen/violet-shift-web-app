import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Chip, DatePicker, Divider, Input, Switch, TimeInput } from "@heroui/react";

// utils
import { parseAbsoluteToLocal, ZonedDateTime } from "@internationalized/date";
import { getFormattedTz } from "@/utils/datetime";

// types
import type { FC, SetStateAction } from "react";
import type { IShiftValues } from "@/types/shift";
import type { FormikErrors } from "formik";

type TimeNLocationFormProps = {
  values: IShiftValues;
  setValues: (
    values: SetStateAction<IShiftValues>,
    shouldValidate?: boolean
  ) => Promise<FormikErrors<IShiftValues>> | Promise<void>;
};

const parseTimeInput = (time: number): ZonedDateTime => {
  return parseAbsoluteToLocal(new Date(time).toISOString());
};

const formattedTz = getFormattedTz();

const TimeNLocationForm: FC<TimeNLocationFormProps> = ({
  values,
  setValues,
}) => {
  const [isBonus, setIsBonus] = useState(false);
  const timefromInput = values.timeFrom ? parseTimeInput(values.timeFrom) : null;
  const timeToInput = values.timeTo ? parseTimeInput(values.timeTo) : null;

  return (
    <div className="py-4 px-3 rounded-lg bg-content1">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon size={20} color={"red"} />
          <span className="font-medium text-md">Time & Location</span>
        </div>
        <Chip className="rounded-sm" color="default" variant="flat">
          {formattedTz}
        </Chip>
      </div>
      <div className="h-2"></div>
      <Divider />
      <div className="h-4"></div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Date</span>
        <DatePicker
          className="w-80"
          showMonthAndYearPickers
          granularity="day"
          label=""
          name="birthdate"
          hideTimeZone
          value={timefromInput}
          onChange={(date: ZonedDateTime | null) => {
            if (!date) return;
            const hour = date.hour;
            const minute = date.minute;
            const second = date.second;
            const day = date.day;
            const month = date.month;
            const year = date.year;
            const newTimeFrom = new Date(year, month - 1, day, hour, minute, second).getTime();
            setValues((prev) => {
              const hourTo = timeToInput ? timeToInput.hour : (hour + 1) % 24;
              const minuteTo = timeToInput ? timeToInput.minute : 0;
              const secondTo = timeToInput ? timeToInput.second : 0;
              const newTimeTo = new Date(year, month - 1, day, hourTo, minuteTo, secondTo).getTime();
              return {
                ...prev,
                timeFrom: newTimeFrom,
                timeTo: newTimeTo,
              };
            });
          }}
        />
      </div>
      <div className="h-4"></div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Time</span>
        <div className="flex items-center gap-2 w-80">
          <TimeInput
            className="w-full"
            label=""
            name="birthdate"
            hideTimeZone
            value={timefromInput}
            granularity="minute"
            hourCycle={24}
            onChange={(time) => {
              if (!time) return;
              const hour = time.hour;
              const minute = time.minute;
              const day = time.day;
              const month = time.month;
              const year = time.year;
              const newTimeFrom = new Date(year, month - 1, day, hour, minute, 0).getTime();
              setValues((prev) => {
                return {
                  ...prev,
                  timeFrom: newTimeFrom,
                };
              });
            }}
          />
          -
          <TimeInput
            className="w-full"
            label=""
            name="birthdate"
            hideTimeZone
            value={timeToInput}
            granularity="minute"
            hourCycle={24}
            onChange={(time) => {
              if (!time) return;
              const hour = time.hour;
              const minute = time.minute;
              const day = time.day;
              const month = time.month;
              const year = time.year;
              const newTimeTo = new Date(year, month - 1, day, hour, minute, 0).getTime();
              setValues((prev) => {
                return {
                  ...prev,
                  timeTo: newTimeTo,
                };
              });
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
          onChange={() => {
            setIsBonus(!isBonus);
            setValues((prev) => ({ ...prev, bonus: 0 }));
          }}
        />
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
