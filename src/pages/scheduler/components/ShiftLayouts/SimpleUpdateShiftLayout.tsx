import ClientForm from "../ShiftForms/ClientForm";
import ShiftInfoForm from "../ShiftForms/ShiftInfoForm";
import TimeNLocationForm from "../ShiftForms/TimeNLocationForm";
import CarerForm from "../ShiftForms/CarerForm";
import TaskForm from "../ShiftForms/TaskForm";
import MilleageForm from "../ShiftForms/MilleageForm";

import type { SetStateAction } from "react";
import type { IShiftValues } from "@/types/shift";
import type { FormikErrors } from "formik";

interface SimpleUpdateShiftLayoutProps {
  values: IShiftValues;
  setValues: (
    values: SetStateAction<IShiftValues>,
    shouldValidate?: boolean
  ) => Promise<FormikErrors<IShiftValues>> | Promise<void>;
}

const SimpleUpdateShiftLayout = ({ values, setValues }: SimpleUpdateShiftLayoutProps) => {

  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
      <ClientForm values={values} setValues={setValues} />

      <ShiftInfoForm values={values} setValues={setValues} />

      <TimeNLocationForm values={values} setValues={setValues} />

      <CarerForm values={values} setValues={setValues} />

      <TaskForm values={values} setValues={setValues} />

      <MilleageForm values={values} setValues={setValues} />
    </form>
  );
};

export default SimpleUpdateShiftLayout;
