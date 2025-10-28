import { ClipboardList } from "lucide-react";
import { Button, Divider } from "@heroui/react";

// types
import type { FC, SetStateAction } from "react";
import type { IShiftValues } from "@/types/shift";
import type { FormikErrors } from "formik";

type TaskSectionProps = {
  values: IShiftValues;
  setValues: (
    values: SetStateAction<IShiftValues>,
    shouldValidate?: boolean
  ) => Promise<FormikErrors<IShiftValues>> | Promise<void>;
};

const TaskSection: FC<TaskSectionProps> = ({ values, setValues }) => {
  return (
    <div className="py-4 px-3 rounded-lg bg-content1">
      <div className="flex items-center gap-2">
        <ClipboardList size={20} color={"pink"} />
        <span className="font-medium text-md">Tasks</span>
      </div>
      <div className="h-2"></div>
      <Divider />
      <div className="h-2"></div>
      {values.tasks.map?.((task, index) => (
        <div
          key={`${task.name}-${index}`}
          className="flex items-center justify-between py-2"
        >
          <span className="flex-1">{task.name}</span>
          <div className="flex items-center gap-8">
            <span className="justify-start">
              <span className="font-semibold">Mandatory: </span>
              {task.isMandatory ? "Yes" : "No"}
            </span>
            <Button
              color="danger"
              size="sm"
              onPress={() => {
                setValues((prev) => ({
                  ...prev,
                  tasks: prev.tasks.filter((_, i) => i !== index),
                }));
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskSection;
