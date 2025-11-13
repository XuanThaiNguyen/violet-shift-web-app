import CarerSection from "../ShiftDetailSections/CarerSection";
import ClientSection from "../ShiftDetailSections/ClientSection";
import MilleageSection from "../ShiftDetailSections/MilleageSection";
import PersonalSection from "../ShiftDetailSections/PersonalSection";
import ShiftInfoSection from "../ShiftDetailSections/ShiftInfoSection";
import TaskSection from "../ShiftDetailSections/TaskSection";
import TimeNLocationSection from "../ShiftDetailSections/TimeNLocationSection";

import type { IFullShiftDetail } from "@/types/shift";

interface ViewShiftLayoutProps {
  values: IFullShiftDetail;
  isAdmin: boolean;
}

const ViewShiftLayout = ({ values, isAdmin }: ViewShiftLayoutProps) => {
  return (
    <div className="flex flex-col gap-4">
      <ClientSection values={values} />

      <ShiftInfoSection values={values} />

      <TimeNLocationSection values={values} />

      {isAdmin ? <CarerSection values={values} /> : <PersonalSection />}

      {isAdmin ? <TaskSection values={values} /> : <></>}

      {/* <InstructionSection values={values} /> */}

      <MilleageSection values={values} />

      {/* <SignatureSection values={values} /> */}
    </div>
  );
};

export default ViewShiftLayout;
