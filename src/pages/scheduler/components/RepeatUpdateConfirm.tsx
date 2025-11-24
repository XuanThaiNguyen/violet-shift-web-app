import {
  Button,
  DatePicker,
  DateRangePicker,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  type RangeValue,
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { parseAbsoluteToLocal, ZonedDateTime } from "@internationalized/date";

import type { IBulkUpdateShift, IShiftRepeat, IUpdateShift } from "@/types/shift";

interface RepeatUpdateConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  handleUpdateShift: (shift: IUpdateShift) => unknown;
  handleBulkUpdateShift: (shift: IBulkUpdateShift) => unknown;
  updatePayload: IUpdateShift;
  isLoading: boolean;
  repeat: IShiftRepeat & { from: number };
}

const UpdateOptions = {
  THIS_SHIFT: "this_shift",
  FUTURE_SHIFTS: "future_shifts",
  RANGES_OF_SHIFTS: "ranges_of_shifts",
} as const;

const RepeatUpdateConfirm = ({
  isOpen,
  onClose,
  handleUpdateShift,
  handleBulkUpdateShift,
  updatePayload,
  repeat,
  isLoading,
}: RepeatUpdateConfirmProps) => {
  const [internalOpen, setInternalOpen] = useState(isOpen);
  const [option, setOption] = useState<string>(UpdateOptions.THIS_SHIFT);
  const [dates, setDates] = useState<{
    start: ZonedDateTime;
    end: ZonedDateTime;
  }>({
    start: parseAbsoluteToLocal(new Date(repeat.from).toISOString()),
    end: parseAbsoluteToLocal(new Date(repeat.endDate!).toISOString()),
  });

  const minDate = useMemo(
    () => parseAbsoluteToLocal(new Date(repeat.from).toISOString()),
    [repeat.from]
  );
  
  useEffect(() => {
    setInternalOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    if (isLoading) return;
    setInternalOpen(false);
    setTimeout(onClose, 200);
  };
  
  const onConfirm = () => {
    if (option === UpdateOptions.THIS_SHIFT) {
      handleUpdateShift(updatePayload);
    } else if (option === UpdateOptions.FUTURE_SHIFTS) {
      handleBulkUpdateShift({
        payload: updatePayload,
        repeatId: repeat._id!,
        from: repeat.from,
        to: dates.end.toDate().getTime(),
      });
    } else if (option === UpdateOptions.RANGES_OF_SHIFTS) {
      handleBulkUpdateShift({
        payload: updatePayload,
        repeatId: repeat._id!,
        from: dates.start.toDate().getTime(),
        to: dates.end.toDate().getTime(),
      });
    }
  }

  return (
    <Modal isOpen={internalOpen} onClose={handleClose} size="2xl" placement="top">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-lg font-semibold">
              Update Confirmation
            </ModalHeader>
            <Divider />
            <ModalBody>
              <RadioGroup
                label="Select the type of update you want to perform"
                value={option}
                onValueChange={setOption}
              >
                <Radio value={UpdateOptions.THIS_SHIFT}>This shift</Radio>
                <Radio value={UpdateOptions.FUTURE_SHIFTS}>
                  Future shifts from this day onwards
                </Radio>
                <Radio value={UpdateOptions.RANGES_OF_SHIFTS}>
                  Ranges of shifts
                </Radio>
              </RadioGroup>
              {option === UpdateOptions.FUTURE_SHIFTS && (
                <div className="mt-4">
                  <DatePicker
                    label="Select end dates to start updating"
                    minValue={minDate}
                    value={dates.end}
                    onChange={(date) => {
                      if (!date) return;
                      setDates({ ...dates, end: date });
                    }}
                  />
                </div>
              )}
              {option === UpdateOptions.RANGES_OF_SHIFTS && (
                <div className="mt-4">
                  <DateRangePicker
                    label="Select the range of shifts to update"
                    value={dates}
                    onChange={
                      setDates as unknown as (
                        value: RangeValue<ZonedDateTime> | null
                      ) => void
                    }
                  />
                </div>
              )}

              {isLoading && (
                <div className="mt-4 text-sm text-warning">
                  Update is in progress, do not close this tab until the update is complete.
                </div>
              )}
            </ModalBody>
            <Divider />
            <ModalFooter>
              <Button variant="flat" onPress={onClose} isLoading={isLoading}>
                Cancel
              </Button>
              <Button color="primary" onPress={onConfirm} isLoading={isLoading} isDisabled={isLoading}>
                Update
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default RepeatUpdateConfirm;
