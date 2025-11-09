import { useMemo, useState } from "react";
import { useParams } from "react-router";
import { addMonths, endOfMonth, format, startOfMonth } from "date-fns";
import { ArrowLeft, ArrowRight, InfoIcon } from "lucide-react";
import { Button, Tooltip } from "@heroui/react";
import { useGetWorklogs } from "@/states/apis/worklogs";
import { TIME_RULES_DATA, timeRules } from "@/constants/timeRules";
import WorkLogTable from "./WorkLogTable";

import type { FC } from "react";
import type { ITimeRule } from "@/constants/timeRules";

const minFrom = new Date("2025-10-01");
const maxFrom = startOfMonth(new Date());

const minutesToHours = (minutes: number) => {
  return `${Math.floor(minutes / 60).toString().padStart(2, "0")}:${Math.floor(minutes % 60).toString().padStart(2, "0")}`;
};

const timeRuleTooltip = (rule: ITimeRule) => {
  return (
    <div className="flex flex-col gap-1 p-1">
      <span className="text-sm md:text-base font-semibold">{rule.name}</span>
      <div className="flex items-center gap-2 text-xs md:text-sm capitalize">
        <span>Days:</span>
        <span>{rule.weekdays}</span>
      </div>
      <div className="flex items-center gap-2 text-xs md:text-sm">
        <span>Time Range:</span>
        <span>{minutesToHours(rule.fromTime)} - {minutesToHours(rule.toTime)}</span>
      </div>
    </div>
  );
};

const Worklogs: FC = () => {
  const { id: staffId } = useParams();
  const [from, setFrom] = useState<Date>(maxFrom);
  const to = endOfMonth(from);

  const { data: worklogs } = useGetWorklogs({
    staffId: staffId as string,
    from: from.getTime(),
    to: to.getTime(),
  });

  const workLogSummary = useMemo(() => {
    const summary = timeRules.reduce<Record<string, number>>(
      (acc, timeRule) => {
        acc[timeRule._id] = 0;
        return acc;
      },
      {}
    );

    worklogs?.forEach((worklog) => {
      const rule = worklog.rule;
      const prevRuleSum = summary[rule] ?? 0;
      summary[rule] = prevRuleSum + worklog.hours;
    });

    return summary;
  }, [worklogs]);

  return (
    <section className="bg-content1 mx-auto p-4 rounded-lg shadow-md">
      <div className="flex items-center gap-2">
        <h3 className="text-lg md:text-xl font-semibold">Worklogs in</h3>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            isIconOnly
            color="default"
            variant="light"
            isDisabled={from.getTime() <= minFrom.getTime()}
            disabled={from.getTime() <= minFrom.getTime()}
            onPress={() => setFrom(addMonths(from, -1))}
          >
            <ArrowLeft size={16} />
          </Button>
          <span className="text-sm md:text-base">
            {format(from, "MMMM yyyy")}
          </span>
          <Button
            size="sm"
            isIconOnly
            color="default"
            variant="light"
            isDisabled={from.getTime() >= maxFrom.getTime()}
            disabled={from.getTime() >= maxFrom.getTime()}
            onPress={() => setFrom(addMonths(from, 1))}
          >
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
      <div className="h-8"></div>
      <div className="bg-content1 rounded-lg py-2">
        <div className="flex items-center gap-2">
          <h4 className="text-lg font-semibold">Recap</h4>
        </div>
        <div className="h-3"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(workLogSummary).map(([rule, duration]) => (
            <div key={rule} className="flex flex-col gap-1 p-4 bg-content1 rounded-lg border border-divider shadow-sm">
              <Tooltip showArrow content={timeRuleTooltip(TIME_RULES_DATA[rule])}>
                <span className="flex items-center gap-1 text-sm md:text-base font-medium cursor-pointer w-fit">
                  <span>{TIME_RULES_DATA[rule].name}</span>
                  <InfoIcon
                    size={12}
                    className="text-primary-400 -translate-y-1/2"
                  />
                </span>
              </Tooltip>
              <span className="text-sm md:text-base">{duration} hrs</span>
            </div>
          ))}
        </div>
        <div className="h-8"></div>
        <WorkLogTable staffId={staffId as string} from={from} to={to} />
      </div>
    </section>
  );
};

export default Worklogs;
