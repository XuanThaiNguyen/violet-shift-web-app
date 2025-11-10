import type { IFullShiftDetail } from "@/types/shift";
import { Divider } from "@heroui/react";
import { FileWarning } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

type InstructionSectionProps = {
  values: IFullShiftDetail;
};

const InstructionSection = ({ values }: InstructionSectionProps) => {
  return (
    <div className="py-4 px-3 rounded-lg bg-content1">
      <div className="flex items-center gap-2">
        <FileWarning size={20} color={"red"} />
        <span className="font-medium text-md">Instructions</span>
      </div>
      <div className="h-2"></div>
      <Divider />
      <div className="h-4"></div>
      <ReactQuill theme="snow" readOnly={true} value={values.instruction} />
    </div>
  );
};

export default InstructionSection;
