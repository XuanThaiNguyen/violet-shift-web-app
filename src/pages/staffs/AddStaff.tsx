import { salutationTypeOptions } from "@/constants/clientOptions";
import { addToast } from "@heroui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { employmentTypeOptions, genderOptions } from "@/constants/userOptions";
import { isValid } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import type { CreateUser } from "@/types/user";
import { ROLE_IDS } from "@/constants/roles";
import { createNewStaff } from "@/states/apis/staff";
import StaffInfo from "./components/StaffInfo";

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

const initialClientValues: CreateUser = {
  employmentType: "full_time",
  role: "",
  firstName: "",
  lastName: "",
  email: "",
};

const AddStaff = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createNewStaff,
    onSuccess: () => {
      addToast({
        title: "Create staff successfully",
        color: "success",
        timeout: 2000,
        isClosing: true,
      });
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] === "staffs",
      });
      navigate("/staffs/list");
    },
    onError: () => {
      addToast({
        title: "Create staff failed",
        color: "danger",
        timeout: 2000,
        isClosing: true,
      });
    },
  });

  const {
    values,
    setFieldValue,
    errors,
    touched,
    setFieldTouched,
    handleSubmit,
  } = useFormik<CreateUser>({
    initialValues: initialClientValues,
    validationSchema: staffSchema,
    onSubmit: async (values) => {
      mutate(values);
    },
  });

  const birthdate =
    values.birthdate && isValid(new Date(values.birthdate))
      ? new Date(values.birthdate)
      : null;

  return (
    <div className="container mx-auto mb-10 pt-4">
      <StaffInfo
        birthdate={birthdate}
        isPending={isPending}
        mode="add"
        values={values}
        setFieldValue={setFieldValue}
        setFieldTouched={setFieldTouched}
        errors={errors}
        touched={touched}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default AddStaff;
