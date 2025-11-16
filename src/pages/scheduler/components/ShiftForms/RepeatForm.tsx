import { useMemo, useRef } from "react";
import { EMPTY_ARRAY, EMPTY_STRING } from "@/constants/empty";
import { getDeviceTz, parseTimeInput } from "@/utils/datetime";
import { Button, DatePicker, Select, SelectItem, Switch } from "@heroui/react";
import { ZonedDateTime } from "@internationalized/date";
import { addDays } from "date-fns";
import { Frequency, RRule, rrulestr } from "rrule";

import type { SetStateAction } from "react";
import type { IShiftRepeat, IShiftValues } from "@/types/shift";
import type { ByWeekday } from "rrule";
import type { FormikErrors } from "formik";

const recurrenceOptions = [
  { label: "Daily", key: Frequency.DAILY },
  { label: "Weekly", key: Frequency.WEEKLY },
  { label: "Monthly", key: Frequency.MONTHLY },
];

const weekDayOptions = [
  { label: "Sun", key: RRule.SU },
  { label: "Mon", key: RRule.MO },
  { label: "Tue", key: RRule.TU },
  { label: "Wed", key: RRule.WE },
  { label: "Thu", key: RRule.TH },
  { label: "Fri", key: RRule.FR },
  { label: "Sat", key: RRule.SA },
];

const getUnit = (recurrence?: Frequency) => {
  if (!recurrence) return EMPTY_STRING;
  switch (recurrence) {
    case Frequency.DAILY:
      return "Day(s)";
    case Frequency.WEEKLY:
      return "Week(s)";
    case Frequency.MONTHLY:
      return "Month(s)";
    default:
      return EMPTY_STRING;
  }
};

const getMaxRepeat = (recurrence?: Frequency) => {
  if (!recurrence) return 1;
  switch (recurrence) {
    case Frequency.DAILY:
      return 15;
    case Frequency.WEEKLY:
      return 12;
    case Frequency.MONTHLY:
      return 3;
    default:
      return 1;
  }
};

const getRepeatGapOptions = (recurrence?: Frequency) => {
  if (!recurrence) return EMPTY_ARRAY;
  const unit = getUnit(recurrence);
  return [...Array(getMaxRepeat(recurrence))].map((_, i) => ({
    label: `${i + 1} ${unit}`,
    key: i + 1,
  }));
};

const getMaxDayInMonth = () => {
  return [...Array(31)].map((_, i) => ({
    label: `${i + 1}`,
    key: i + 1,
  }));
};

type RepeatFormProps = {
  values: IShiftValues;
  setValues: (
    values: SetStateAction<IShiftValues>,
    shouldValidate?: boolean
  ) => Promise<FormikErrors<IShiftValues>> | Promise<void>;
};

type DefaultRRuleOptions = {
  startsAt: number;
  tz?: string;
  interval: number;
};

const getDefaultDailyRRule = (options: DefaultRRuleOptions): string => {
  const _tz = options.tz || getDeviceTz();
  const startDate = new Date(options.startsAt);
  // TODO: Handle time zone
  const hour = startDate.getHours();
  const minute = startDate.getMinutes();
  return new RRule({
    freq: RRule.DAILY,
    interval: options.interval,
    dtstart: startDate,
    byhour: [hour],
    byminute: [minute],
    tzid: _tz,
  }).toString();
};

const getDefaultWeeklyRRule = (options: DefaultRRuleOptions): string => {
  const _tz = options.tz || getDeviceTz();
  const startDate = new Date(options.startsAt);
  // TODO: Handle time zone
  const hour = startDate.getHours();
  const minute = startDate.getMinutes();
  return new RRule({
    freq: RRule.WEEKLY,
    interval: options.interval,
    byweekday: [RRule.MO],
    dtstart: startDate,
    byhour: [hour],
    byminute: [minute],
    tzid: _tz,
  }).toString();
};

const getDefaultMonthlyRRule = (options: DefaultRRuleOptions): string => {
  const _tz = options.tz || getDeviceTz();
  const startDate = new Date(options.startsAt);
  // TODO: Handle time zone
  const hour = startDate.getHours();
  const minute = startDate.getMinutes();
  return new RRule({
    freq: RRule.MONTHLY,
    interval: options.interval,
    bymonthday: [1],
    dtstart: startDate,
    byhour: [hour],
    byminute: [minute],
    tzid: _tz,
  }).toString();
};
const RepeatForm = ({ values, setValues }: RepeatFormProps) => {
  const repeat = values.repeat as IShiftRepeat | undefined;
  const hasRepeat = !!repeat;
  const lastRepeat = useRef<IShiftRepeat | undefined>(repeat);

  const rrule = repeat ? rrulestr(repeat.pattern) : null;
  console.log("🚀 ~ rrule:", rrule);

  const rawWeekDays = rrule?.origOptions.byweekday;
  const weekDays = Array.isArray(rawWeekDays)
    ? rawWeekDays
    : rawWeekDays ? [rawWeekDays] : EMPTY_ARRAY;

  const toggleDay = (day: ByWeekday) => {
    const isSelected = weekDays.some(d => d === day);
    if (isSelected) {
      const newRrule = rrule!.clone();
      const newWeekDays = weekDays.filter((d) => d !== day);
      newRrule.origOptions.byweekday = newWeekDays;
      setValues((prev) => {
        const oldRepeat = prev.repeat as IShiftRepeat;
        return {
          ...prev,
          repeat: {
            ...oldRepeat,
            pattern: newRrule.toString(),
          },
        };
      });
    } else {
      const newRrule = rrule!.clone();
      newRrule.origOptions.byweekday = [...weekDays, day];
      setValues((prev) => {
        const oldRepeat = prev.repeat as IShiftRepeat;
        return {
          ...prev,
          repeat: {
            ...oldRepeat,
            pattern: newRrule.toString(),
          },
        };
      });
    }
  };

  const recurrence = rrule?.origOptions.freq;

  const getSummaryText = () => {
    rrule!.origOptions.until = new Date(repeat!.endDate!);
    const occurrences = rrule!.count();
    return `${rrule!.toText()}, ${occurrences} occurrence${
      occurrences !== 1 ? "s" : ""
    }`;
  };

  const endDate = useMemo(
    () => (repeat?.endDate ? parseTimeInput(repeat?.endDate) : null),
    [repeat?.endDate]
  );

  const repeatGapOptions = getRepeatGapOptions(recurrence);
  const maxDayInMonth = getMaxDayInMonth();

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Repeat</span>
        <Switch
          isSelected={hasRepeat}
          onValueChange={(value) => {
            if (value) {
              let cachedRepeat = lastRepeat.current;
              if (!cachedRepeat) {
                const endsAt = addDays(new Date(values.timeFrom!), 7).getTime();
                cachedRepeat = {
                  endDate: endsAt,
                  pattern: getDefaultWeeklyRRule({
                    startsAt: values.timeFrom!,
                    interval: 1,
                    tz: getDeviceTz(),
                  }),
                  tz: getDeviceTz(),
                };
              }
              setValues((prev) => {
                return { ...prev, repeat: cachedRepeat };
              });
            } else {
              lastRepeat.current = repeat;
              setValues((prev) => ({ ...prev, repeat: undefined }));
            }
          }}
        />
      </div>
      {hasRepeat ? (
        <div>
          <div className="h-4"></div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Recurrence</span>
            <Select
              className="max-w-xs"
              selectedKeys={recurrence ? [recurrence.toString()] : undefined}
              onSelectionChange={([value]) => {
                if (typeof value !== "string") {
                  return;
                }
                if (+value === recurrence) {
                  return;
                }
                switch (+value) {
                  case Frequency.DAILY: {
                    setValues((prev) => ({
                      ...prev,
                      repeat: {
                        ...repeat,
                        pattern: getDefaultDailyRRule({
                          startsAt: values.timeFrom!,
                          interval: 1,
                          tz: getDeviceTz(),
                        }),
                      },
                    }));
                    break;
                  }
                  case Frequency.WEEKLY: {
                    setValues((prev) => ({
                      ...prev,
                      repeat: {
                        ...repeat,
                        pattern: getDefaultWeeklyRRule({
                          startsAt: values.timeFrom!,
                          interval: 1,
                          tz: getDeviceTz(),
                        }),
                      },
                    }));
                    break;
                  }
                  case Frequency.MONTHLY: {
                    setValues((prev) => ({
                      ...prev,
                      repeat: {
                        ...repeat,
                        pattern: getDefaultMonthlyRRule({
                          startsAt: values.timeFrom!,
                          interval: 1,
                          tz: getDeviceTz(),
                        }),
                      },
                    }));
                    break;
                  }
                }
              }}
            >
              {recurrenceOptions.map((recurrence) => (
                <SelectItem key={recurrence.key.toString()}>{recurrence.label}</SelectItem>
              ))}
            </Select>
          </div>
          <div className="h-4"></div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-sm">Repeat Every</span>
            <Select
              className="max-w-xs"
              selectedKeys={
                new Set([rrule?.options?.interval?.toString() || "1"])
              }
              onSelectionChange={([value]) => {
                if (typeof value !== "string") {
                  return;
                }
                const newInterval = +value;
                const newRrule = rrule!.clone();
                newRrule.origOptions.interval = newInterval;
                setValues((prev) => ({
                  ...prev,
                  repeat: {
                    ...repeat,
                    pattern: newRrule.toString(),
                  },
                }));
              }}
            >
              {repeatGapOptions.map((option) => (
                <SelectItem key={option.key}>{option.label}</SelectItem>
              ))}
            </Select>
          </div>
          {recurrence === Frequency.WEEKLY ? (
            <div>
              <div className="h-4"></div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Occurs On</span>
                <div className="flex items-center justify-between max-w-xs w-full">
                  {weekDayOptions.map((day) => {
                    const isSelected = weekDays.some(d => d === day.key);
                    return (
                      <Button
                        size="sm"
                        variant="bordered"
                        key={day.key as unknown as string}
                        onPress={() => toggleDay(day.key)}
                        className="relative min-w-0 w-10"
                        color={isSelected ? "primary" : "default"}
                      >
                        {day.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
          {recurrence === Frequency.MONTHLY ? (
            <>
              <div className="h-4"></div>
              <div className="flex flex-1 items-center justify-between">
                <span className="text-sm">Occurs On</span>
                <div className="flex items-center gap-2 justify-between">
                  <span className="text-gray-700 mr-4 text-lg">Day</span>
                  <Select
                    className="w-20"
                    selectedKeys={new Set([rrule?.options?.bymonthday?.toString() || "1"])}
                    onSelectionChange={([value]) => {
                      if (typeof value !== "string") {
                        return;
                      }
                      const newRrule = rrule!.clone();
                      newRrule.origOptions.bymonthday = [+value];
                      setValues((prev) => ({
                        ...prev,
                        repeat: { ...repeat, pattern: newRrule.toString() },
                      }));
                    }}
                  >
                    {maxDayInMonth.map((day) => (
                      <SelectItem key={day.key}>{day.label}</SelectItem>
                    ))}
                  </Select>
                  <span className="text-gray-700 mr-4 text-lg">
                    of the month
                  </span>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}

          <div className="h-4"></div>
          <div className="flex items-center justify-between">
            <span className="text-sm">End Date</span>
            <DatePicker
              className="w-80"
              showMonthAndYearPickers
              granularity="day"
              label=""
              name="birthdate"
              hideTimeZone
              value={endDate}
              onChange={(date: ZonedDateTime | null) => {
                if (!date) return;
                const day = date.day;
                const month = date.month;
                const year = date.year;
                const newEndDate = new Date(
                  year,
                  month - 1,
                  day,
                  23,
                  59,
                  59
                );
                const newUnixEndDate = newEndDate.getTime();
                const newRrule = rrule!.clone();
                newRrule.origOptions.until = newEndDate;
                setValues((prev) => ({
                  ...prev,
                  repeat: { ...repeat, pattern: newRrule.toString(), endDate: newUnixEndDate },
                }));
              }}
            />
          </div>
          <div className="h-4"></div>
          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-400 max-w-xs capitalize">{getSummaryText()}</span>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default RepeatForm;
