import { Button, useDisclosure } from "@heroui/react";
import { Plus } from "lucide-react";
import type { FC } from "react";
import CreateShiftDrawer from "./components/CreateShiftDrawer";

const Scheduler: FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div className="w-full">
        <div className="py-2 px-4 flex items-center justify-between">
          <div>
            <span>October, 2025</span>
          </div>
          <div>
            <Button
              onPress={onOpen}
              color={"primary"}
              size="md"
              startContent={<Plus size={16} />}
            >
              Shift
            </Button>
          </div>
        </div>
        <div className="w-full h-full flex items-center justify-center bg-content1">
          <img
            src="/images/loading.gif"
            alt="loading"
            className="w-36 h-36 object-cover"
          />
        </div>
      </div>

      <CreateShiftDrawer isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
};

export default Scheduler;
