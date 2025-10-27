import { useStaffDetail, useUpdateStaff } from "@/states/apis/staff";
import type { UpdateUser, User } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import type { PaginationResponse } from "@/types/common";
import { addToast } from "@heroui/react";
import { isValid } from "date-fns";
import * as Yup from "yup";
import { salutationTypeOptions } from "@/constants/clientOptions";
import { employmentTypeOptions, genderOptions } from "@/constants/userOptions";
import { ROLE_IDS } from "@/constants/roles";
import StaffInfo from "./components/StaffInfo";

const initialClientValues: UpdateUser = {
  employmentType: "full_time",
  role: "",
  firstName: "",
  lastName: "",
  email: "",
};

const staffSchema = Yup.object({
  salutation: Yup.string()
    .oneOf(salutationTypeOptions.map((option) => option.label))
    .optional(),
  firstName: Yup.string().required("First name is required"),
  middleName: Yup.string(),
  lastName: Yup.string().required("Last name is required"),
  preferredName: Yup.string(),
  gender: Yup.string()
    .oneOf(
      genderOptions.map((option) => option.value),
      "Unknown gender"
    )
    .optional(),
  birthdate: Yup.date(),
  phoneNumber: Yup.string(),
  mobileNumber: Yup.string(),
  email: Yup.string().email("Invalid email").required("Email is required"),
  role: Yup.string()
    .oneOf(Object.values(ROLE_IDS))
    .required("Role is required"),
  employmentType: Yup.string()
    .oneOf(
      employmentTypeOptions.map((option) => option.value),
      "Unknown employment type"
    )
    .required("Employment type is required"),
});

const UpdateStaff = () => {
  const navigate = useNavigate();
  const { id: staffId } = useParams();
  const queryClient = useQueryClient();

  const { data: dataClient } = useStaffDetail(staffId || "");

  const initClient = {
    ...initialClientValues,
    ...dataClient,
  };

  const { mutate, isPending } = useMutation({
    mutationFn: useUpdateStaff,
    onSuccess: (updatedStaff: User) => {
      addToast({
        title: "Update staff successfully",
        color: "success",
        timeout: 2000,
        isClosing: true,
      });
      queryClient.setQueryData(["staffs", staffId], (old: User) => ({
        ...old,
        ...updatedStaff,
      }));
      // when lagged update is reported, just clear all the queries data related to client list
      queryClient.setQueriesData(
        {
          predicate: (query) =>
            query.queryKey[0] === "clients" &&
            typeof query.queryKey[1] === "object",
        },
        (old: PaginationResponse<User>) => {
          if (Array.isArray(old?.data)) {
            const newData = old.data.map((item) => {
              if (item.id === staffId) {
                return {
                  ...item,
                  ...updatedStaff,
                };
              }
              return item;
            });
            return {
              ...old,
              data: newData,
            };
          }
          return old;
        }
      );

      navigate(`/staffs/${updatedStaff?.id}`);
    },
    onError: () => {
      addToast({
        title: "Update staff failed",
        color: "danger",
        timeout: 2000,
        isClosing: true,
      });
    },
  });

  const {
    values,
    setFieldValue,
    handleSubmit,
    errors,
    touched,
    setFieldTouched,
  } = useFormik<UpdateUser>({
    initialValues: initClient,
    validationSchema: staffSchema,
    onSubmit: async (values) => {
      mutate({ id: staffId!, values });
    },
  });

  const birthdate =
    values.birthdate && isValid(new Date(values.birthdate))
      ? new Date(values.birthdate)
      : null;

  return (
    <div className="container mx-auto mt-4">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate(`/staffs/${staffId}`)}
      >
        <ArrowLeft />
        <span>Back to Staff Profile</span>
      </div>
      <div className="h-4"></div>
      <StaffInfo
        staffId={staffId || ""}
        values={values}
        setFieldValue={setFieldValue}
        setFieldTouched={setFieldTouched}
        errors={errors}
        touched={touched}
        handleSubmit={handleSubmit}
        birthdate={birthdate}
        isPending={isPending}
        mode={"update"}
      />
    </div>
  );
};

export default UpdateStaff;
