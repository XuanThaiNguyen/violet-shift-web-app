import { useRoleCheck } from "@/hooks/useRoleCheck";
import { Button, useDisclosure } from "@heroui/react";
import { Plus } from "lucide-react";
import { useState, type FC } from "react";
import SchedularPersonal from "./components/SchedularPersonal";
import SchedulerManagement from "./components/SchedulerManagement";
import SchedulerMode from "./components/SchedulerMode";
import CreateShiftDrawer from "./components/CreateShiftDrawer";
import ShiftDrawer from "./components/ShiftDrawer";
import type { DayDateInfo, ViewMode } from "./type";
import type { IAvailibility } from "@/types/availability";
import LeaveDetail from "./components/LeaveDetail";

const Scheduler: FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedShiftId, setSelectedShiftId] = useState<string | undefined>(
    undefined
  );
  const [selectedUnavailability, setSelectedUnavailability] = useState<IAvailibility | undefined>(
    undefined
  );
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [openShiftDrawer, setOpenShiftDrawer] = useState<boolean>(false);
  const [dates, setDates] = useState<DayDateInfo[]>([]);

  const { isAdmin } = useRoleCheck();

  const handleSetSelectedShiftId = (shiftId: string) => {
    setSelectedShiftId(shiftId);
    onOpen();
  };

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
          {isAdmin ? (
            <Button
              onPress={() => setOpenShiftDrawer(true)}
              color={"primary"}
              size="md"
              startContent={<Plus size={16} />}
            >
              Shift
            </Button>
          ) : (
            <></>
          )}
        </div>

        <div className="h-4"></div>
        {isAdmin ? (
          <SchedulerManagement viewMode={viewMode} dates={dates} setSelectedShiftId={handleSetSelectedShiftId} setSelectedUnavailability={setSelectedUnavailability} />
        ) : (
          <SchedularPersonal viewMode={viewMode} dates={dates} setSelectedShiftId={handleSetSelectedShiftId} />
        )}
      </div>

      {openShiftDrawer && (
        <CreateShiftDrawer
          isOpen={openShiftDrawer}
          onClose={() => setOpenShiftDrawer(false)}
        />
      )}

      {isOpen && selectedShiftId && (
        <ShiftDrawer
          isAdmin={isAdmin}
          onClose={onClose}
          isOpen={isOpen}
          selectedShiftId={selectedShiftId}
          readOnly={!isAdmin}
        />
      )}

      {selectedUnavailability && (
        <LeaveDetail
          isOpen={!!selectedUnavailability}
          onClose={() => setSelectedUnavailability(undefined)}
          unavailability={selectedUnavailability}
        />
      )}
    </>
  );
};

export default Scheduler;
