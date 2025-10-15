import { Button, useDisclosure } from "@heroui/react";
import { Plus } from "lucide-react";
import { useState, type FC } from "react";
import CreateShiftDrawer from "./components/CreateShiftDrawer";
import SchedulerManagement from "./components/SchedulerManagement";
import SchedulerMode from "./components/SchedulerMode";
import type { DayDateInfo, ViewMode } from "./type";

const Scheduler: FC = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [dates, setDates] = useState<DayDateInfo[]>([]);

  return (
    <>
      <div className="w-full">
        <div className="bg-content1 py-4 px-4 flex items-center justify-between">
          <SchedulerMode
            viewMode={viewMode}
            weekOffset={weekOffset}
            setDates={setDates}
            dates={dates}
            setViewMode={setViewMode}
            setWeekOffset={setWeekOffset}
          />
          <div>
            <Button
              onPress={onOpen}
              color={"primary"}
              size="md"
              startContent={<Plus size={16} />}
            >
              Shift
            </Button>
          </div>
        </div>

        <div className="h-4"></div>
        <SchedulerManagement viewMode={viewMode} dates={dates} />
      </div>

      <CreateShiftDrawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        mode="add"
        onClose={onClose}
        isFromCreate
      />
    </>
  );
};

export default Scheduler;
