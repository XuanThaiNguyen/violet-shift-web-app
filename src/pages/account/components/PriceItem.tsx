import {
  archivePriceBook,
  updatePriceBook,
  type IPriceBookRule,
  type IPrices,
} from "@/states/apis/prices";
import {
  addToast,
  Autocomplete,
  AutocompleteItem,
  Button,
  DatePicker,
  Divider,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@heroui/react";
import { Copy, PenIcon, Trash } from "lucide-react";
import {
  PriceErrorMessages,
  TABLE_HEADERS_WITH_EDIT,
  TABLE_HEADERS_WITHOUT_EDIT,
  TIME_RANGE,
  weekdaysOptions,
} from "../constant";
import { useCallback, useMemo, useState } from "react";
import { format, isValid } from "date-fns";
import PriceHeaderInfoModal from "./PriceHeaderInfoModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarDate } from "@internationalized/date";
import ArchiveWarningModal from "./ArchiveWarningModal";
import { generateId } from "@/utils/strings";
import { AxiosError } from "axios";

interface PriceItemProps {
  dataPrice: IPrices;
  handleDuplicatePriceBook: (id: string) => void;
}

const PriceItem = ({ dataPrice, handleDuplicatePriceBook }: PriceItemProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isArchiveOpen,
    onOpen: onArchiveOpen,
    onClose: onArchiveClose,
  } = useDisclosure();
  const [isEdit, setIsEdit] = useState(false);

  const [editingRules, setEditingRules] = useState<IPriceBookRule[]>(
    dataPrice.rules || []
  );

  const [errors, setErrors] = useState<Record<string, Record<string, string>>>(
    {}
  );

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updatePriceBook,
    onSuccess: () => {
      console.log("123123");

      addToast({
        title: "Update price book successfully",
        color: "success",
        timeout: 2000,
        isClosing: true,
      });
      queryClient.invalidateQueries({ queryKey: ["prices"] });
      if (isOpen) {
        onClose();
      }
      setIsEdit(false);
      setErrors({});
    },
    onError: (error) => {
      console.log("456456");
      if (error instanceof AxiosError) {
        const errorCode = error.response?.data?.code;
        const msg = PriceErrorMessages[errorCode] ?? "Something went wrong";
        addToast({
          title: msg,
          color: "danger",
          timeout: 2000,
          isClosing: true,
        });
      } else {
        addToast({
          title: "Update price book failed",
          color: "danger",
          timeout: 2000,
          isClosing: true,
        });
      }
    },
  });

  const { mutate: archiveMutate } = useMutation({
    mutationFn: archivePriceBook,
    onSuccess: () => {
      addToast({
        title: "Archive price book successfully",
        color: "success",
        timeout: 2000,
        isClosing: true,
      });
      queryClient.invalidateQueries({ queryKey: ["prices"] });
      if (isOpen) {
        onClose();
      }
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const errorCode = error.response?.data?.code;
        const msg = PriceErrorMessages[errorCode] ?? "Something went wrong";
        addToast({
          title: msg,
          color: "danger",
          timeout: 2000,
          isClosing: true,
        });
      } else {
        addToast({
          title: "Archive price book failed",
          color: "danger",
          timeout: 2000,
          isClosing: true,
        });
      }
    },
  });

  const handleFieldChange = (
    ruleId: string,
    field: keyof IPriceBookRule,
    value: any
  ) => {
    setEditingRules((prev) =>
      prev.map((rule) =>
        rule._id === ruleId ? { ...rule, [field]: value } : rule
      )
    );
  };

  const handleDuplicateRule = (ruleId: string) => {
    const ruleIndex = editingRules.findIndex((rule) => rule._id === ruleId);
    if (ruleIndex !== -1) {
      const { _id, ...ruleToDuplicate } = editingRules[ruleIndex];
      setEditingRules((prev) => [
        ...prev,
        { ...ruleToDuplicate, _id: generateId() },
      ]);
    }
  };

  // const handleDuplicatePriceBook = (priceBookId: string) => {
  //   setPriceBooks((prev) => {
  //     const priceBookIndex = prev.findIndex((pb) => pb.id === priceBookId);
  //     if (priceBookIndex !== -1) {
  //       const priceBookToDuplicate = prev[priceBookIndex];
  //       const duplicatedPriceBook = {
  //         ...priceBookToDuplicate,
  //         id: generateId(),
  //         priceBookTitle: `${priceBookToDuplicate.priceBookTitle} (Copy)`,
  //         rules: priceBookToDuplicate.rules.map((rule) => ({
  //           ...rule,
  //           _id: generateId(),
  //         })),
  //       };
  //       return [
  //         ...prev.slice(0, priceBookIndex + 1),
  //         duplicatedPriceBook,
  //         ...prev.slice(priceBookIndex + 1),
  //       ];
  //     }
  //     return prev;
  //   });
  // };

  const handleDeleteRule = (ruleId: string) => {
    setEditingRules((prev) => prev.filter((rule) => rule._id !== ruleId));
  };

  const handleAddNewPriceBookRule = () => {
    const newRule: IPriceBookRule = {
      _id: generateId(),
      dayOfWeek: "weekdays",
      timeFrom: 0,
      timeTo: 1380,
      perHour: 0,
      referenceNumberHour: 0,
      perKm: 0,
      referenceNumberKm: 0,
      effectiveDate: new Date().toISOString(),
    };

    setEditingRules((prev) => [...prev, newRule]);
  };

  const validateRules = () => {
    const newErrors: Record<string, Record<string, string>> = {};
    let isValid = true;

    editingRules.forEach((rule) => {
      const ruleErrors: Record<string, string> = {};

      if (!rule.dayOfWeek) {
        ruleErrors.dayOfWeek = "Day of week is required";
        isValid = false;
      }
      if (rule.timeFrom === undefined || rule.timeFrom === null) {
        ruleErrors.timeFrom = "Time from is required";
        isValid = false;
      }
      if (rule.timeTo === undefined || rule.timeTo === null) {
        ruleErrors.timeTo = "Time to is required";
        isValid = false;
      }
      if (!rule.perHour && rule.perHour !== 0) {
        ruleErrors.perHour = "Per hour is required";
        isValid = false;
      }
      if (!rule.referenceNumberHour && rule.referenceNumberHour !== 0) {
        ruleErrors.referenceNumberHour = "Reference number hour is required";
        isValid = false;
      }
      if (!rule.perKm && rule.perKm !== 0) {
        ruleErrors.perKm = "Per km is required";
        isValid = false;
      }
      if (!rule.referenceNumberKm && rule.referenceNumberKm !== 0) {
        ruleErrors.referenceNumberKm = "Reference number km is required";
        isValid = false;
      }

      if (Object.keys(ruleErrors).length > 0) {
        newErrors[rule._id] = ruleErrors;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (validateRules()) {
      mutate({
        id: dataPrice.id,
        values: { rules: editingRules },
      });
    } else {
      addToast({
        title: "Please fix validation errors",
        color: "danger",
        timeout: 2000,
        isClosing: true,
      });
    }
  };

  const handleCancel = () => {
    setEditingRules(dataPrice.rules || []);
    setErrors({});
    setIsEdit(false);
  };

  const renderCell = useCallback(
    (ruleItem: IPriceBookRule, columnKey: string) => {
      const label =
        weekdaysOptions.find((item) => item.key === ruleItem.dayOfWeek)
          ?.label || "";
      const timeFromLabel =
        TIME_RANGE.find((item) => item.key === ruleItem.timeFrom.toString())
          ?.label || "";
      const timeToLabel =
        TIME_RANGE.find((item) => item.key === ruleItem.timeTo.toString())
          ?.label || "";

      const ruleErrors = errors[ruleItem._id] || {};

      const ruleDate = isValid(new Date(ruleItem.effectiveDate))
        ? new Date(ruleItem.effectiveDate)
        : new Date();

      switch (columnKey) {
        case "dayOfWeek":
          return (
            <div className="w-72">
              {isEdit ? (
                <Autocomplete
                  selectedKey={ruleItem.dayOfWeek}
                  onSelectionChange={(value) =>
                    handleFieldChange(ruleItem._id, "dayOfWeek", value)
                  }
                  isClearable={false}
                  defaultItems={weekdaysOptions}
                  isInvalid={!!ruleErrors.dayOfWeek}
                  errorMessage={ruleErrors.dayOfWeek}
                >
                  {(dayOfWeekItem) => (
                    <AutocompleteItem key={dayOfWeekItem.key}>
                      {dayOfWeekItem.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              ) : (
                <span>{label}</span>
              )}
            </div>
          );
        case "time":
          return (
            <div className="flex items-center gap-2">
              {isEdit ? (
                <>
                  <Select
                    className="w-32"
                    selectedKeys={[ruleItem.timeFrom.toString()]}
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0];
                      handleFieldChange(
                        ruleItem._id,
                        "timeFrom",
                        Number(value)
                      );
                    }}
                  >
                    {TIME_RANGE.map((timeRangeItem) => (
                      <SelectItem key={timeRangeItem.key}>
                        {timeRangeItem.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <span>-</span>
                  <Select
                    className="w-32"
                    selectedKeys={[ruleItem.timeTo.toString()]}
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0];
                      handleFieldChange(ruleItem._id, "timeTo", Number(value));
                    }}
                  >
                    {TIME_RANGE.map((timeRangeItem) => (
                      <SelectItem key={timeRangeItem.key}>
                        {timeRangeItem.label}
                      </SelectItem>
                    ))}
                  </Select>
                </>
              ) : (
                <span>{`${timeFromLabel} - ${timeToLabel}`}</span>
              )}
            </div>
          );
        case "perHour":
          return (
            <div>
              {isEdit ? (
                <Input
                  type="number"
                  value={ruleItem.perHour.toString()}
                  onValueChange={(value) =>
                    handleFieldChange(ruleItem._id, "perHour", Number(value))
                  }
                  isInvalid={!!ruleErrors.perHour}
                  errorMessage={ruleErrors.perHour}
                />
              ) : (
                <span>{ruleItem.perHour}</span>
              )}
            </div>
          );
        case "referenceNumberHour":
          return (
            <div>
              {isEdit ? (
                <Input
                  type="number"
                  value={ruleItem.referenceNumberHour.toString()}
                  onValueChange={(value) =>
                    handleFieldChange(
                      ruleItem._id,
                      "referenceNumberHour",
                      Number(value)
                    )
                  }
                  isInvalid={!!ruleErrors.referenceNumberHour}
                  errorMessage={ruleErrors.referenceNumberHour}
                />
              ) : (
                <span>{ruleItem.referenceNumberHour}</span>
              )}
            </div>
          );
        case "perKm":
          return (
            <div>
              {isEdit ? (
                <Input
                  type="number"
                  value={ruleItem.perKm.toString()}
                  startContent={<p className="text-sm">$</p>}
                  onValueChange={(value) =>
                    handleFieldChange(ruleItem._id, "perKm", Number(value))
                  }
                  isInvalid={!!ruleErrors.perKm}
                  errorMessage={ruleErrors.perKm}
                />
              ) : (
                <span>{ruleItem.perKm}</span>
              )}
            </div>
          );
        case "referenceNumberKm":
          return (
            <div>
              {isEdit ? (
                <Input
                  type="number"
                  value={ruleItem.referenceNumberKm.toString()}
                  onValueChange={(value) =>
                    handleFieldChange(
                      ruleItem._id,
                      "referenceNumberKm",
                      Number(value)
                    )
                  }
                  isInvalid={!!ruleErrors.referenceNumberKm}
                  errorMessage={ruleErrors.referenceNumberKm}
                />
              ) : (
                <span>{ruleItem.referenceNumberKm}</span>
              )}
            </div>
          );
        case "effectiveDate":
          return (
            <div>
              {isEdit ? (
                <DatePicker
                  showMonthAndYearPickers
                  value={
                    new CalendarDate(
                      ruleDate.getFullYear(),
                      ruleDate.getMonth() + 1,
                      ruleDate.getDate()
                    )
                  }
                  onChange={(value) => {
                    if (value) {
                      const dateStr = `${value.year}-${String(
                        value.month
                      ).padStart(2, "0")}-${String(value.day).padStart(
                        2,
                        "0"
                      )}`;
                      handleFieldChange(
                        ruleItem._id,
                        "effectiveDate",
                        new Date(dateStr).toISOString()
                      );
                    }
                  }}
                />
              ) : (
                <span>{format(ruleItem.effectiveDate, "dd-MM-yyyy")}</span>
              )}
            </div>
          );
        case "duplicate":
          return (
            <Button
              onPress={() => handleDuplicateRule(ruleItem._id)}
              variant="flat"
              size="sm"
            >
              <Copy size={16} color={"blue"} />
            </Button>
          );
        case "delete":
          return (
            <Button
              variant="flat"
              size="sm"
              onPress={() => handleDeleteRule(ruleItem._id)}
            >
              <Trash size={16} color="red" />
            </Button>
          );
        default:
          return <span>NO DATA</span>;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isEdit, errors]
  );

  const bottomContent = useMemo(() => {
    return isEdit ? (
      <div className="flex flex-col">
        <Divider />
        <div className="h-2"></div>
        <div className="flex justify-end">
          <Button
            size="sm"
            color="default"
            variant="flat"
            className="self-end mx-2 mb-2"
            onPress={handleCancel}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            color="primary"
            variant="flat"
            className="self-end mx-2 mb-2"
            onPress={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    ) : (
      <></>
    );
  }, [isEdit, editingRules]);

  const onChangeTitle = ({
    title,
    externalId,
  }: {
    title: string;
    externalId: string;
  }) => {
    mutate({
      id: dataPrice.id,
      values: { priceBookTitle: title, priceBookId: externalId },
    });
  };

  const handleEditMode = () => {
    setEditingRules(dataPrice.rules || []);
    setIsEdit(true);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div
          onClick={onOpen}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div>{dataPrice.priceBookTitle}</div>
          <PenIcon size={16} />
        </div>
        {isEdit ? (
          <Button size="sm" variant="flat" onPress={handleAddNewPriceBookRule}>
            New Price
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="flat"
              onPress={() => handleDuplicatePriceBook(dataPrice.id)}
            >
              Duplicate
            </Button>
            <Button
              size="sm"
              variant="flat"
              color={"danger"}
              onPress={onArchiveOpen}
            >
              Archive
            </Button>
            <Button
              size="sm"
              color={"primary"}
              variant="flat"
              onPress={handleEditMode}
            >
              Edit
            </Button>
          </div>
        )}
      </div>
      <div className="h-2"></div>
      <Table
        key={isEdit ? "edit" : "view"}
        bottomContent={bottomContent}
        removeWrapper
        className="bg-content1"
        aria-label="Example static collection table"
      >
        <TableHeader
          columns={
            isEdit ? TABLE_HEADERS_WITH_EDIT : TABLE_HEADERS_WITHOUT_EDIT
          }
        >
          {(header) => (
            <TableColumn key={header.uid}>{header.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={editingRules} emptyContent={"No rows to display."}>
          {(item: IPriceBookRule) => (
            <TableRow className="bg-content1" key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey as string)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <PriceHeaderInfoModal
        isOpen={isOpen}
        onClose={onClose}
        priceBookTitle={dataPrice.priceBookTitle}
        priceBookId={dataPrice.priceBookId}
        onConfirm={({ title, externalId }) =>
          onChangeTitle({ title, externalId })
        }
        mode={"edit"}
      />

      <ArchiveWarningModal
        isOpen={isArchiveOpen}
        onClose={onArchiveClose}
        onConfirm={() => {
          archiveMutate({ id: dataPrice.id, isArchived: true });
        }}
      />
    </div>
  );
};

export default PriceItem;
