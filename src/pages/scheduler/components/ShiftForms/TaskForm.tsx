import { useState } from "react";
import { ClipboardList } from "lucide-react";
import {
  Button,
  Checkbox,
  Divider,
  Input,
} from "@heroui/react";

// types
import type { FC, SetStateAction } from "react";
import type {
  IShiftValues,
  ITask,
} from "@/types/shift";
import type { FormikErrors } from "formik";
import { generateId } from "@/utils/strings";

type TaskFormProps = {
  values: IShiftValues;
  setValues: (
    values: SetStateAction<IShiftValues>,
    shouldValidate?: boolean
  ) => Promise<FormikErrors<IShiftValues>> | Promise<void>;
};

const TaskForm: FC<TaskFormProps> = ({ values, setValues }) => {
  const [tempTask, setTempTask] = useState<ITask>({
    name: "",
    isMandatory: false,
  });
  return (
    <div className="py-4 px-3 rounded-lg bg-content1">
      <div className="flex items-center gap-2">
        <ClipboardList size={20} color={"pink"} />
        <span className="font-medium text-md">Tasks</span>
      </div>
      <div className="h-2"></div>
      <Divider />
      <div className="h-4"></div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Enter task title"
            className="w-80"
            value={tempTask.name}
            onValueChange={(value) => {
              setTempTask((prev) => ({ ...prev, name: value }));
            }}
          />
          <Checkbox
            isSelected={tempTask.isMandatory}
            onValueChange={(value) =>
              setTempTask((prev) => ({ ...prev, isMandatory: value }))
            }
          >
            Mandatory
          </Checkbox>
        </div>
        <Button
          color="primary"
          isDisabled={!tempTask.name}
          size="sm"
          onPress={() => {
            setValues((prev) => ({
              ...prev,
              tasks: [...prev.tasks, tempTask],
            }));
            setTempTask({
              name: "",
              repetitiveId: generateId(),
              isMandatory: false,
            });
          }}
        >
          <p className="text-bold text-md capitalize">Add</p>
        </Button>
      </div>
      <div className="h-2"></div>
      {values.tasks.map?.((task, index) => (
        <div
          key={task.repetitiveId}
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

export default TaskForm;
