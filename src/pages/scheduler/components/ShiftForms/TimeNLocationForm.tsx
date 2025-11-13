import {
  Chip,
  DatePicker,
  Divider,
  Input,
  Switch,
  TimeInput,
} from "@heroui/react";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

// utils
import { getFormattedTz, parseTimeInput } from "@/utils/datetime";
import { ZonedDateTime } from "@internationalized/date";
import { useMemo } from "react";

// utils
import { startOfDay } from "date-fns";

// types
import type { IShiftValues } from "@/types/shift";
import type { FormikErrors } from "formik";
import type { FC, SetStateAction } from "react";
import RepeatForm from "./RepeatForm";

type TimeNLocationFormProps = {
  values: IShiftValues;
  errors?: FormikErrors<IShiftValues>;
  setValues: (
    values: SetStateAction<IShiftValues>,
    shouldValidate?: boolean
  ) => Promise<FormikErrors<IShiftValues>> | Promise<void>;
};

const formattedTz = getFormattedTz();

const TimeNLocationForm: FC<TimeNLocationFormProps> = ({
  values,
  errors,
  setValues,
}) => {
  const [isBonus, setIsBonus] = useState(false);

  // const [isNightShift, setIsNightShift] = useState(false);
  const timefromInput = values.timeFrom
    ? parseTimeInput(values.timeFrom)
    : null;
  const timeToInput = values.timeTo ? parseTimeInput(values.timeTo) : null;

  const isOverNightShift = useMemo(() => {
    return (
      startOfDay(values.timeFrom!).getTime() <
      startOfDay(values.timeTo!).getTime()
    );
  }, [values.timeFrom, values.timeTo]);

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
            const newTimeFrom = new Date(
              year,
              month - 1,
              day,
              hour,
              minute,
              second
            ).getTime();
            const dateTimeTo = isOverNightShift ? date.add({ days: 1 }) : date;
            setValues((prev) => {
              const hourTo = timeToInput ? timeToInput.hour : (hour + 1) % 24;
              const minuteTo = timeToInput ? timeToInput.minute : 0;
              const secondTo = timeToInput ? timeToInput.second : 0;
              const newTimeTo = new Date(
                dateTimeTo.year,
                dateTimeTo.month - 1,
                dateTimeTo.day,
                hourTo,
                minuteTo,
                secondTo
              ).getTime();

              const oldClientSchedules = prev.clientSchedules;
              const newClientSchedules = oldClientSchedules?.map(
                (clientSchedule) => {
                  return {
                    ...clientSchedule,
                    timeFrom: newTimeFrom,
                    timeTo: newTimeTo,
                  };
                }
              );

              const oldStaffSchedules = prev.staffSchedules;
              const newStaffSchedules = oldStaffSchedules?.map(
                (staffSchedule) => {
                  return {
                    ...staffSchedule,
                    timeFrom: newTimeFrom,
                    timeTo: newTimeTo,
                  };
                }
              );
              return {
                ...prev,
                timeFrom: newTimeFrom,
                timeTo: newTimeTo,
                clientSchedules: newClientSchedules,
                staffSchedules: newStaffSchedules,
              };
            });
          }}
        />
      </div>
      <div className="h-4"></div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Overnight Shift</span>
        <Switch
          isSelected={isOverNightShift}
          onValueChange={(value) => {
            const baseTimeto = value
              ? timefromInput!.add({ days: 1 })
              : timefromInput!;
            const { hour, minute } = timeToInput!;
            const newTimeTo = new Date(
              baseTimeto.year,
              baseTimeto.month - 1,
              baseTimeto.day,
              hour,
              minute,
              0
            ).getTime();
            setValues((prev) => {
              const oldClientSchedules = prev.clientSchedules;
              const newClientSchedules = oldClientSchedules?.map(
                (clientSchedule) => {
                  return {
                    ...clientSchedule,
                    timeTo: newTimeTo,
                  };
                }
              );

              const oldStaffSchedules = prev.staffSchedules;
              const newStaffSchedules = oldStaffSchedules?.map(
                (staffSchedule) => {
                  return {
                    ...staffSchedule,
                    timeTo: newTimeTo,
                  };
                }
              );
              return {
                ...prev,
                timeTo: newTimeTo,
                clientSchedules: newClientSchedules,
                staffSchedules: newStaffSchedules,
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
              const newTimeFrom = new Date(
                year,
                month - 1,
                day,
                hour,
                minute,
                0
              ).getTime();
              setValues((prev) => {
                const oldClientSchedules = prev.clientSchedules;
                const newClientSchedules = oldClientSchedules.map(
                  (clientSchedule) => {
                    return {
                      ...clientSchedule,
                      timeFrom: newTimeFrom,
                    };
                  }
                );

                const oldStaffSchedules = prev.staffSchedules;
                const newStaffSchedules = oldStaffSchedules.map(
                  (staffSchedule) => {
                    return {
                      ...staffSchedule,
                      timeFrom: newTimeFrom,
                    };
                  }
                );

                return {
                  ...prev,
                  timeFrom: newTimeFrom,
                  clientSchedules: newClientSchedules,
                  staffSchedules: newStaffSchedules,
                };
              });
            }}
            isInvalid={!!errors?.timeTo} // Due
          />
          -
          <TimeInput
            isInvalid={!!errors?.timeTo}
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
              const newTimeTo = new Date(
                year,
                month - 1,
                day,
                hour,
                minute,
                0
              ).getTime();
              setValues((prev) => {
                const oldClientSchedules = prev.clientSchedules;
                const newClientSchedules = oldClientSchedules.map(
                  (clientSchedule) => {
                    return {
                      ...clientSchedule,
                      timeTo: newTimeTo,
                    };
                  }
                );

                const oldStaffSchedules = prev.staffSchedules;
                const newStaffSchedules = oldStaffSchedules.map(
                  (staffSchedule) => {
                    return {
                      ...staffSchedule,
                      timeTo: newTimeTo,
                    };
                  }
                );

                return {
                  ...prev,
                  timeTo: newTimeTo,
                  clientSchedules: newClientSchedules,
                  staffSchedules: newStaffSchedules,
                };
              });
            }}
          />
        </div>
      </div>
      {errors?.timeTo && (
        <div className="text-xs text-danger mt-2 text-right">
          {errors?.timeTo}
        </div>
      )}
      <div className="h-4"></div>
      <RepeatForm values={values} setValues={setValues} />
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
