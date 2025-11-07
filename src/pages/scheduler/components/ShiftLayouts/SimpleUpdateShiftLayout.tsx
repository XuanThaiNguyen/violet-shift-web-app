import CarerForm from "../ShiftForms/CarerForm";
import ClientForm from "../ShiftForms/ClientForm";
import InstructionForm from "../ShiftForms/InstructionForm";
import MilleageForm from "../ShiftForms/MilleageForm";
import ShiftInfoForm from "../ShiftForms/ShiftInfoForm";
import SignatureForm from "../ShiftForms/SignatureForm";
import TaskForm from "../ShiftForms/TaskForm";
import TimeNLocationForm from "../ShiftForms/TimeNLocationForm";

import type { IShiftValues } from "@/types/shift";
import type { FormikErrors } from "formik";
import type { SetStateAction } from "react";

interface SimpleUpdateShiftLayoutProps {
  values: IShiftValues;
  setValues: (
    values: SetStateAction<IShiftValues>,
    shouldValidate?: boolean
  ) => Promise<FormikErrors<IShiftValues>> | Promise<void>;
}

const SimpleUpdateShiftLayout = ({
  values,
  setValues,
}: SimpleUpdateShiftLayoutProps) => {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
      <ClientForm values={values} setValues={setValues} />

      <ShiftInfoForm values={values} setValues={setValues} />

      <TimeNLocationForm values={values} setValues={setValues} />

      <CarerForm values={values} setValues={setValues} />

      <TaskForm values={values} setValues={setValues} />

      <InstructionForm values={values} setValues={setValues} />

      <MilleageForm values={values} setValues={setValues} />

      <SignatureForm values={values} setValues={setValues} />
    </form>
  );
};

export default SimpleUpdateShiftLayout;
