import { parseTimeInput } from "@/utils/datetime";
import {
  Button,
  DatePicker,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
} from "@heroui/react";
import {
  getLocalTimeZone,
  today,
  type ZonedDateTime,
} from "@internationalized/date";
import { useMemo, useState } from "react";

interface DeleteRepeatConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (deleteType: string, endDate: number) => void;
}

const DeleteRepeatConfirm = ({
  isOpen,
  onClose,
  onConfirm,
}: DeleteRepeatConfirmProps) => {
  const [deleteType, setDeleteType] = useState("only");
  const [endDate, setEndDate] = useState<number | null>(Date.now());

  const timeFromEndDate = useMemo(
    () => (endDate ? parseTimeInput(endDate) : null),
    [endDate]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" placement="top">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-lg font-semibold">
              Delete Shift
            </ModalHeader>
            <Divider />
            <ModalBody>
              <div className="h-1"></div>
              <RadioGroup
                label=""
                value={deleteType}
                onValueChange={setDeleteType}
              >
                <Radio value={"only"}>Only this shift</Radio>
                <Radio value={"future"}>Future shifts</Radio>
                {deleteType === "future" ? (
                  <>
                    <DatePicker
                      className="w-80"
                      isDateUnavailable={(date) => {
                        const todayDate = today(getLocalTimeZone());
                        return date.compare(todayDate) < 0; // disable any date before today
                      }}
                      showMonthAndYearPickers
                      granularity="day"
                      label=""
                      name="birthdate"
                      hideTimeZone
                      value={timeFromEndDate}
                      onChange={(date: ZonedDateTime | null) => {
                        if (!date) return;
                        const hour = date.hour;
                        const minute = date.minute;
                        const second = date.second;
                        const day = date.day;
                        const month = date.month;
                        const year = date.year;
                        const newEndDate = new Date(
                          year,
                          month - 1,
                          day,
                          hour,
                          minute,
                          second
                        ).getTime();
                        setEndDate(newEndDate);
                      }}
                    />
                    <span className="text-sm text-gray-400">
                      Shifts till the seletecd date will be deleted
                    </span>
                  </>
                ) : (
                  <></>
                )}
                <Radio value={"all"}>All</Radio>
              </RadioGroup>
              <div className="h-1"></div>
            </ModalBody>
            <Divider />
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={() => onConfirm(deleteType, endDate!)}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DeleteRepeatConfirm;
