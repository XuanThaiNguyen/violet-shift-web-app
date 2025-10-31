import { useRoleCheck } from "@/hooks/useRoleCheck";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { useState, type FC } from "react";
import SchedularPersonal from "./components/SchedularPersonal";
import SchedulerManagement from "./components/SchedulerManagement";
import SchedulerMode from "./components/SchedulerMode";
import type { DayDateInfo, ViewMode } from "./type";
import CreateShiftDrawer from "./components/CreateShiftDrawer";

const Scheduler: FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [openShiftDrawer, setOpenShiftDrawer] = useState<boolean>(false);
  const [dates, setDates] = useState<DayDateInfo[]>([]);

  const { isAdmin } = useRoleCheck();

  return (
    <>
      <div className="w-full">
        <div className="bg-content1 py-4 px-4 flex items-center justify-between">
          <SchedulerMode
            viewMode={viewMode}
            weekOffset={weekOffset}
            setDates={setDates}
            dates={dates}
            isAdmin={isAdmin}
            setViewMode={setViewMode}
            setWeekOffset={setWeekOffset}
          />
          <div>
            <Button
              onPress={() => setOpenShiftDrawer(true)}
              color={"primary"}
              size="md"
              startContent={<Plus size={16} />}
            >
              Shift
            </Button>
          </div>
        </div>

        <div className="h-4"></div>
        {isAdmin ? (
          <SchedulerManagement viewMode={viewMode} dates={dates} />
        ) : (
          <SchedularPersonal viewMode={viewMode} dates={dates} />
        )}
      </div>

      {openShiftDrawer && (
        <CreateShiftDrawer
          isOpen={openShiftDrawer}
          onClose={() => setOpenShiftDrawer(false)}
        />
      )}
    </>
  );
};

export default Scheduler;
