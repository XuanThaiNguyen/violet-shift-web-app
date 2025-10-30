import { ClipboardList } from "lucide-react";
import { Divider } from "@heroui/react";

// types
import type { FC } from "react";
import type { IFullShiftDetail } from "@/types/shift";

type TaskSectionProps = {
  values: IFullShiftDetail;

};

const TaskSection: FC<TaskSectionProps> = ({ values }) => {
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskSection;
