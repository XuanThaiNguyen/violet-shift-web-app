import useDebounce from "@/hooks/useDebounce";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import type { IShiftValues } from "@/types/shift";
import { Divider } from "@heroui/react";
import DOMPurify from "dompurify";
import type { FormikErrors } from "formik";
import { FileWarning } from "lucide-react";
import { useEffect, useState, type SetStateAction } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

type InstructionFormProps = {
  values: IShiftValues;
  setValues: (
    values: SetStateAction<IShiftValues>,
    shouldValidate?: boolean
  ) => Promise<FormikErrors<IShiftValues>> | Promise<void>;
};

const InstructionForm = ({ values, setValues }: InstructionFormProps) => {
  const { isAdmin } = useRoleCheck();

  const [text, setText] = useState(values.instruction || "");
  const debouncedText = useDebounce(text, 500);

  useEffect(() => {
    if (debouncedText !== values.instruction) {
      setValues((prev) => ({
        ...prev,
        instruction: DOMPurify.sanitize(debouncedText),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedText]);

  return (
    <div className="py-4 px-3 rounded-lg bg-content1">
      <div className="flex items-center gap-2">
        <FileWarning size={20} color="red" />
        <span className="font-medium text-md">Instructions</span>
      </div>

      <div className="h-2" />
      <Divider />
      <div className="h-4" />

      <ReactQuill
        theme="snow"
        readOnly={!isAdmin}
        value={text}
        onChange={setText}
      />
    </div>
  );
};

export default InstructionForm;
