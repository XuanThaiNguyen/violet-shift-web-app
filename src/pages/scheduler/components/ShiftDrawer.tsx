import { EMPTY_ARRAY } from "@/constants/empty";
import {
  bulkDeleteShift,
  bulkUpdateShift,
  deleteShift,
  updateShift,
  useGetClientSchedulesByShift,
  useGetShiftDetail,
  useGetStaffSchedulesByShift,
  useGetTasksByShift,
} from "@/states/apis/shift";
import type {
  IArrayUpdate,
  IClientSchedule,
  IFullShiftDetail,
  IShiftDetail,
  IShiftTask,
  IShiftValues,
  IStaffSchedule,
  ITask,
  IUpdateShift,
} from "@/types/shift";
import {
  addToast,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { ArrowLeft, Edit, Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import { ErrorMessages, ShiftTypeKeys, ShiftTypeOptions } from "../constant";
import DeleteConfirm from "./DeleteConfirm";
import DeleteRepeatConfirm from "./DeleteRepeatConfirm";
import SimpleUpdateShiftLayout from "./ShiftLayouts/SimpleUpdateShiftLayout";
import ViewShiftLayout from "./ShiftLayouts/ViewShiftLayout";
import UpdateConfirm from "./UpdateConfirm";
import RepeatUpdateConfirm from "./RepeatUpdateConfirm";

const initialValues: IShiftValues = {
  clientSchedules: [],
  staffSchedules: [],
  shiftType: ShiftTypeOptions[0].key,
  additionalShiftTypes: [],
  allowances: [],
  timeFrom: 0,
  timeTo: 0,
  isCompanyVehicle: false,
  tasks: [],
};

const clientScheduleSchema = Yup.object().shape({
  client: Yup.string().required(),
  timeFrom: Yup.number().required(),
  timeTo: Yup.number().required(),
});

const staffScheduleSchema = Yup.object().shape({
  staff: Yup.string().required("Staff is required"),
  timeFrom: Yup.string().required("Staff Time From is required"),
  timeTo: Yup.string().required("Staff Time To is required"),
});

const shiftSchema = Yup.object().shape({
  clientSchedules: Yup.array().of(clientScheduleSchema).required(),
  staffSchedules: Yup.array().of(staffScheduleSchema).required(),
  shiftType: Yup.string()
    .oneOf(ShiftTypeKeys, "Invalid key")
    .required("Shift Type is required"),
  timeFrom: Yup.string().required("Time From is required"),
  timeTo: Yup.string().required("Time To is required"),
  address: Yup.string().optional(),
  isCompanyVehicle: Yup.boolean().optional(),
  mileage: Yup.string().optional(),
  mileageCap: Yup.string().optional(),
});

interface ShiftDrawerProps {
  isOpen: boolean;
  selectedShiftId: string;
  onClose: () => void;
  isAdmin: boolean;
  readOnly?: boolean;
}

const objectEqual = (obj1: object, obj2: object) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

const ConfirmationModals = {
  NONE: "none",
  DELETE_CONFIRM: "delete_confirm",
  DELETE_REPEAT_CONFIRM: "delete_repeat_confirm",
  UPDATE_CONFIRM: "update_confirm",
  UPDATE_REPEAT_CONFIRM: "update_repeat_confirm",
} as const;

const ShiftDrawer = ({
  isOpen,
  selectedShiftId,
  onClose,
  isAdmin,
  readOnly = false,
}: ShiftDrawerProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const [internalOpen, setInternalOpen] = useState(isOpen);
  const [confirmationModal, setConfirmationModal] = useState<string>(
    ConfirmationModals.NONE
  );
  const [updatePayload, setUpdatePayload] = useState<IUpdateShift | null>(null);

  const queryClient = useQueryClient();

  const {
    data: dataShiftDetail,
    isLoading,
    isSuccess,
  } = useGetShiftDetail(selectedShiftId);

  const {
    data: staffSchedules = EMPTY_ARRAY,
    isLoading: staffScheduleLoading,
  } = useGetStaffSchedulesByShift(selectedShiftId || "");

  const {
    data: clientSchedules = EMPTY_ARRAY,
    isLoading: clientScheduleLoading,
  } = useGetClientSchedulesByShift(selectedShiftId || "");

  const { data: tasks = EMPTY_ARRAY, isLoading: tasksLoading } =
    useGetTasksByShift(selectedShiftId || "");

  const fullShiftLoading =
    isLoading || staffScheduleLoading || clientScheduleLoading || tasksLoading;

  const fullShiftDetails: IFullShiftDetail = useMemo(() => {
    return {
      ...(initialValues as unknown as IShiftDetail),
      ...dataShiftDetail,
      clientSchedules: clientSchedules,
      tasks: tasks,
      staffSchedules: staffSchedules,
    };
  }, [dataShiftDetail, clientSchedules, tasks, staffSchedules]);

  const { mutate: mutateUpdateShift, isPending: isPendingUpdate } = useMutation(
    {
      mutationFn: updateShift,
      onSuccess: (_, payload) => {
        addToast({
          title: "Update shift successfully",
          color: "success",
          timeout: 2000,
          isClosing: true,
        });
        queryClient.removeQueries({
          predicate: (query) => {
            const firstKey = query.queryKey[0];
            const secondKey = query.queryKey[1];
            if (firstKey === "shiftDetail") {
              return secondKey === selectedShiftId;
            }
            if (firstKey === "staffSchedulesByShift") {
              return secondKey === selectedShiftId;
            }
            if (firstKey === "clientSchedulesByShift") {
              return secondKey === selectedShiftId;
            }
            if (firstKey === "tasksByShift") {
              return secondKey === selectedShiftId;
            }
            if (firstKey === "staffSchedules") {
              const staffNeedsUpdate: string[] = [];
              payload.staffSchedules.update.forEach((schedule) => {
                staffNeedsUpdate.push(schedule.staff!);
              });
              payload.staffSchedules.delete.forEach((staff) => {
                staffNeedsUpdate.push(staff);
              });
              payload.staffSchedules.add.forEach((schedule) => {
                staffNeedsUpdate.push(schedule.staff!);
              });
              staffSchedules?.forEach((schedule) => {
                staffNeedsUpdate.push(schedule.staff!);
              });
              if (staffNeedsUpdate?.includes(secondKey as string)) {
                return true;
              }
              return false;
            }
            return false;
          },
        });
        setConfirmationModal(ConfirmationModals.NONE);
        onClose();
      },
      onError: (error) => {
        setConfirmationModal(ConfirmationModals.NONE);
        if (error instanceof AxiosError) {
          const errorCode = error.response?.data?.code;
          const msg = ErrorMessages[errorCode] ?? "Something went wrong";
          addToast({
            title: msg,
            color: "danger",
            timeout: 2000,
            isClosing: true,
          });
        } else {
          addToast({
            title: "Update shift failed",
            color: "danger",
            timeout: 2000,
            isClosing: true,
          });
        }
      },
    }
  );

  const { mutate: mutateBulkUpdateShift, isPending: isPendingBulkUpdate } =
    useMutation({
      mutationFn: bulkUpdateShift,
      onSuccess: () => {
        addToast({
          title: "Update shifts successfully",
          color: "success",
          timeout: 2000,
          isClosing: true,
        });
        queryClient.removeQueries({
          predicate: (query) => {
            const keys = [
              "shiftDetail",
              "staffSchedulesByShift",
              "clientSchedulesByShift",
              "tasksByShift",
              "staffSchedules",
            ];
            return keys.includes(query.queryKey[0] as string);
          },
        });
        setConfirmationModal(ConfirmationModals.NONE);
        onClose();
      },
      onError: (error) => {
        setConfirmationModal(ConfirmationModals.NONE);
        if (error instanceof AxiosError) {
          const errorCode = error.response?.data?.code;
          const msg = ErrorMessages[errorCode] ?? "Something went wrong";
          addToast({
            title: msg,
            color: "danger",
            timeout: 2000,
            isClosing: true,
          });
        } else {
          addToast({
            title: "Update shift failed",
            color: "danger",
            timeout: 2000,
            isClosing: true,
          });
        }
      },
    });

  const { mutate: mutateDeleteShift, isPending: isPendingDelete } = useMutation(
    {
      mutationFn: deleteShift,
      onSuccess: () => {
        addToast({
          title: "Delete shift successfully",
          color: "success",
        });
        queryClient.removeQueries({
          predicate: (query) => {
            const firstKey = query.queryKey[0];
            const secondKey = query.queryKey[1];
            if (firstKey === "shiftDetail") {
              return secondKey === selectedShiftId;
            }
            if (firstKey === "staffSchedulesByShift") {
              return secondKey === selectedShiftId;
            }
            if (firstKey === "clientSchedulesByShift") {
              return secondKey === selectedShiftId;
            }
            if (firstKey === "tasksByShift") {
              return secondKey === selectedShiftId;
            }
            if (firstKey === "staffSchedules") {
              return (
                staffSchedules?.some(
                  (schedule) => schedule.staff === secondKey
                ) || false
              );
            }
            return false;
          },
        });
        setConfirmationModal(ConfirmationModals.NONE);
        onClose();
      },
      onError: (error) => {
        setConfirmationModal(ConfirmationModals.NONE);
        if (error instanceof AxiosError) {
          const errorCode = error.response?.data?.code;
          const msg = ErrorMessages[errorCode] ?? "Something went wrong";
          addToast({
            title: msg,
            color: "danger",
            timeout: 2000,
            isClosing: true,
          });
        }
      },
    }
  );

  const { mutate: mutateBulkDeleteShift, isPending: isPendingBulkDelete } =
    useMutation({
      mutationFn: bulkDeleteShift,
      onSuccess: () => {
        addToast({
          title: "Delete shift successfully",
          color: "success",
        });
        queryClient.removeQueries({
          predicate: (query) => {
            const selectedKeys = ["shiftDetail", "staffSchedulesByShift", "clientSchedulesByShift", "tasksByShift", "staffSchedules"];
            return selectedKeys.includes(query.queryKey[0] as string);
          },
        });
        setConfirmationModal(ConfirmationModals.NONE);
        onClose();
      },
      onError: (error) => {
        setConfirmationModal(ConfirmationModals.NONE);
        if (error instanceof AxiosError) {
          const errorCode = error.response?.data?.code;
          const msg = ErrorMessages[errorCode] ?? "Something went wrong";
          addToast({
            title: msg,
            color: "danger",
            timeout: 2000,
            isClosing: true,
          });
        }
      },
    });

  const isManipulating =
    isPendingUpdate ||
    isPendingBulkUpdate ||
    isPendingDelete ||
    isPendingBulkDelete;

  const { values, setValues, handleSubmit } = useFormik<IShiftValues>({
    initialValues: initialValues,
    validationSchema: shiftSchema,
    onSubmit: (values) => {
      const clientSchedule = values.clientSchedules?.[0];
      const oldClientSchedule = clientSchedules?.[0];
      const clientScheduleUpdate: IArrayUpdate<IClientSchedule> = {
        add: [],
        update: [],
        delete: [],
      };
      if (clientSchedule.repetitiveId !== oldClientSchedule?.repetitiveId) {
        clientScheduleUpdate.add.push({
          client: clientSchedule.client,
          timeFrom: clientSchedule.timeFrom,
          timeTo: clientSchedule.timeTo,
          priceBook: clientSchedule.priceBook,
          fund: clientSchedule.fund,
        });
        clientScheduleUpdate.delete.push(oldClientSchedule?.repetitiveId);
      } else {
        clientScheduleUpdate.update.push(clientSchedule);
      }

      const staffSchedule = values.staffSchedules?.[0];
      const oldStaffSchedule = staffSchedules?.[0];
      const staffScheduleUpdate: IArrayUpdate<IStaffSchedule> = {
        add: [],
        update: [],
        delete: [],
      };
      if (staffSchedule.staff !== oldStaffSchedule?.staff) {
        staffScheduleUpdate.add.push({
          staff: staffSchedule.staff,
          timeFrom: staffSchedule.timeFrom,
          timeTo: staffSchedule.timeTo,
          paymentMethod: staffSchedule.paymentMethod,
        });
        staffScheduleUpdate.delete.push(oldStaffSchedule.staff!);
      } else {
        if (
          !objectEqual(
            {
              timeFrom: staffSchedule.timeFrom,
              timeTo: staffSchedule.timeTo,
              paymentMethod: staffSchedule.paymentMethod,
            },
            {
              timeFrom: oldStaffSchedule.timeFrom,
              timeTo: oldStaffSchedule.timeTo,
              paymentMethod: oldStaffSchedule.paymentMethod,
            }
          )
        ) {
          staffScheduleUpdate.update.push(staffSchedule);
        }
      }

      const oldTaskMap = tasks?.reduce((acc, task) => {
        acc[task.repetitiveId!] = task;
        return acc;
      }, {} as Record<string, IShiftTask>);
      const newTaskMap: Record<string, true> = {};
      const taskUpdate: IArrayUpdate<ITask> = {
        add: [],
        update: [],
        delete: [],
      };

      for (const task of values.tasks) {
        const repetitiveId = task.repetitiveId;
        if (!repetitiveId || !oldTaskMap[repetitiveId]) {
          taskUpdate.add.push({
            id: task.id,
            name: task.name,
            isMandatory: task.isMandatory,
          });
        } else {
          newTaskMap[repetitiveId] = true;
          taskUpdate.update.push(task);
        }
      }
      for (const oldTask of tasks) {
        if (!newTaskMap[oldTask.repetitiveId!]) {
          taskUpdate.delete.push(oldTask.repetitiveId!);
        }
      }

      const updateShift: IUpdateShift = {
        ...values,
        _id: selectedShiftId,
        clientSchedules: clientScheduleUpdate,
        staffSchedules: staffScheduleUpdate,
        tasks: taskUpdate,
      };

      setUpdatePayload(updateShift);
      if (dataShiftDetail?.repeat) {
        setConfirmationModal(ConfirmationModals.UPDATE_REPEAT_CONFIRM);
      } else {
        setConfirmationModal(ConfirmationModals.UPDATE_CONFIRM);
      }
    },
  });

  const closeDrawer = () => {
    setConfirmationModal(ConfirmationModals.NONE);
    setInternalOpen(false);
    setTimeout(onClose, 200);
  };

  useEffect(() => {
    setInternalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (dataShiftDetail && !fullShiftLoading && isSuccess) {
      setValues((prev) => ({
        ...prev,
        ...(dataShiftDetail as unknown as IShiftValues),
        clientSchedules: clientSchedules?.map((schedule) => {
          return {
            repetitiveId: schedule.repetitiveId!,
            client: schedule.client._id!,
            timeFrom: schedule.timeFrom,
            timeTo: schedule.timeTo,
            priceBook: schedule.priceBook.id,
            fund: schedule.fund.id,
          };
        }),
        tasks: tasks,
        staffSchedules: staffSchedules as IStaffSchedule[],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataShiftDetail, isSuccess, fullShiftLoading]);

  const isEditable = useMemo(() => {
    if (isLoading || staffScheduleLoading) return false;
    const now = Date.now();
    if (dataShiftDetail!.timeFrom <= now) return false;
    if (staffSchedules?.some((schedule) => schedule.timeFrom! <= now))
      return false;
    return true;
  }, [dataShiftDetail, staffSchedules, isLoading, staffScheduleLoading]);

  const isDeletable = useMemo(() => {
    if (isLoading || staffScheduleLoading) return false;
    const now = Date.now();
    // check if the shift is happening
    if (dataShiftDetail!.timeFrom <= now && dataShiftDetail!.timeTo >= now) return false;
    // check if the staff is clocked in or shift is processed
    if (staffSchedules?.some((schedule) => {
      const isHappening = schedule.timeFrom! <= now && schedule.timeTo! >= now;
      const isClockedIn = schedule.clocksInAt! < now
      return !isHappening && !isClockedIn;
    }))
    return true;
  }, [dataShiftDetail, staffSchedules, isLoading, staffScheduleLoading]);

  const isPastShift = useMemo(() => {
    if (isLoading || staffScheduleLoading) return false;
    const now = Date.now();
    if (dataShiftDetail!.timeFrom <= now) return true;
    if (staffSchedules?.some((schedule) => schedule.timeFrom! <= now)) return true;
    return false;
  }, [dataShiftDetail, staffSchedules, isLoading, staffScheduleLoading]);

  return (
    <>
      <Drawer
        isOpen={internalOpen}
        closeButton={<div></div>}
        size="5xl"
        onClose={closeDrawer}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex items-center justify-between bg-conten1">
                <div className="flex items-center gap-2">
                  {isEdit ? (
                    <Button
                      size="md"
                      className="bg-content1 border-1 border-divider"
                      startContent={<ArrowLeft size={16} />}
                      onPress={() => setIsEdit(false)}
                      isLoading={isManipulating}
                      isDisabled={isManipulating}
                    >
                      Go Back
                    </Button>
                  ) : (
                    <></>
                  )}
                  <Button
                    size="md"
                    className="bg-content1 border-1 border-divider"
                    startContent={<X size={16} />}
                    onPress={() => {
                      onClose();
                    }}
                    isLoading={isManipulating}
                    isDisabled={isManipulating}
                  >
                    Close
                  </Button>
                </div>
                {readOnly ? (
                  <></>
                ) : isEdit ? (
                  <div className="flex items-center gap-2">
                    <Button
                      size="md"
                      color={"primary"}
                      onPress={() => handleSubmit()}
                      isLoading={isManipulating}
                      isDisabled={isManipulating}
                      startContent={<Save size={16} />}
                    >
                      Update
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      size="md"
                      color="danger"
                      onPress={() => {
                        if (dataShiftDetail?.repeat) {
                          setConfirmationModal(
                            ConfirmationModals.DELETE_REPEAT_CONFIRM
                          );
                        } else {
                          setConfirmationModal(
                            ConfirmationModals.DELETE_CONFIRM
                          );
                        }
                      }}
                      isLoading={isManipulating}
                      isDisabled={isManipulating || !isDeletable}
                    >
                      Delete
                    </Button>
                    <Button
                      size="md"
                      color={"default"}
                      onPress={() => setIsEdit(true)}
                      startContent={<Edit size={16} />}
                      isLoading={isManipulating}
                      isDisabled={isManipulating || !isEditable}
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </DrawerHeader>
              <DrawerBody className="bg-background px-3 py-2">
                {isEdit ? (
                  <SimpleUpdateShiftLayout
                    values={values}
                    setValues={setValues}
                  />
                ) : (
                  <ViewShiftLayout
                    isAdmin={isAdmin}
                    values={fullShiftDetails}
                  />
                )}
              </DrawerBody>
              <DrawerFooter className="bg-background">
                <div className="h-2"></div>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
      <DeleteConfirm
        isOpen={confirmationModal === ConfirmationModals.DELETE_CONFIRM}
        onClose={() => setConfirmationModal(ConfirmationModals.NONE)}
        onConfirm={async () => {
          await mutateDeleteShift(selectedShiftId || "");
        }}
      />
      {dataShiftDetail?.repeat && (
        <DeleteRepeatConfirm
          isOpen={
            confirmationModal === ConfirmationModals.DELETE_REPEAT_CONFIRM
          }
          onClose={() => setConfirmationModal(ConfirmationModals.NONE)}
          repeat={dataShiftDetail.repeat}
          isPastShift={isPastShift}
          onConfirm={(deleteType: string, endDate: number) => {
            if (deleteType === "only") {
              mutateDeleteShift(selectedShiftId || "");
            }
            if (deleteType === "future") {
              mutateBulkDeleteShift({
                repeatId: dataShiftDetail?.repeat?._id || "",
                from: dataShiftDetail?.timeFrom
                  ? dataShiftDetail?.timeFrom
                  : Date.now(),
                to: endDate,
              });
            }
            if (deleteType === "all") {
              mutateBulkDeleteShift({
                repeatId: dataShiftDetail?.repeat?._id || "",
                from: Date.now(),
                to: dataShiftDetail?.repeat?.endDate,
              });
            }
          }}
        />
      )}
      {confirmationModal === ConfirmationModals.UPDATE_CONFIRM &&
        updatePayload && (
          <UpdateConfirm
            isOpen={confirmationModal === ConfirmationModals.UPDATE_CONFIRM}
            onClose={() => {
              setUpdatePayload(null);
              setConfirmationModal(ConfirmationModals.NONE);
            }}
            isLoading={isManipulating}
            onConfirm={() => {
              mutateUpdateShift(updatePayload);
            }}
          />
        )}
      {confirmationModal === ConfirmationModals.UPDATE_REPEAT_CONFIRM &&
        updatePayload && (
          <RepeatUpdateConfirm
            isOpen={
              confirmationModal === ConfirmationModals.UPDATE_REPEAT_CONFIRM
            }
            onClose={() => {
              setUpdatePayload(null);
              setConfirmationModal(ConfirmationModals.NONE);
            }}
            handleUpdateShift={mutateUpdateShift}
            handleBulkUpdateShift={mutateBulkUpdateShift}
            updatePayload={updatePayload}
            repeat={{
              // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
              ...dataShiftDetail?.repeat!,
              from: dataShiftDetail?.timeFrom ?? Date.now(),
            }}
            isLoading={isManipulating}
          />
        )}
    </>
  );
};

export default ShiftDrawer;
