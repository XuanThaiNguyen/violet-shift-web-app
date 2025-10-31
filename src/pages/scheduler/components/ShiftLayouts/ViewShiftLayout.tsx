import ClientSection from "../ShiftDetailSections/ClientSection";
import ShiftInfoSection from "../ShiftDetailSections/ShiftInfoSection";
import TimeNLocationSection from "../ShiftDetailSections/TimeNLocationSection";
import CarerSection from "../ShiftDetailSections/CarerSection";
import TaskSection from "../ShiftDetailSections/TaskSection";
import MilleageSection from "../ShiftDetailSections/MilleageSection";

import type { IFullShiftDetail } from "@/types/shift";


interface ViewShiftLayoutProps {
  values: IFullShiftDetail;
}

const ViewShiftLayout = ({ values }: ViewShiftLayoutProps) => {

  return (
    <div className="flex flex-col gap-4">
      <ClientSection values={values} />

      <ShiftInfoSection values={values} />

      <TimeNLocationSection values={values} />

      <CarerSection values={values} />

      <TaskSection values={values} />

      <MilleageSection values={values} />
    </div>
  );
};

export default ViewShiftLayout;
