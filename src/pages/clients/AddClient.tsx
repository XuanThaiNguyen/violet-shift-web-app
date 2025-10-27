import {
  maritalStatusOptions,
  salutationTypeOptions,
} from "@/constants/clientOptions";
import { genderOptions } from "@/constants/userOptions";
import { useCreateNewClient } from "@/states/apis/client";
import type { ClientSubmitValues, IClient } from "@/types/client";
import { addToast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isValid } from "date-fns";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import ClientInfo from "./components/ClientInfo";

const clientSchema = Yup.object({
  salutation: Yup.string()
    .oneOf(salutationTypeOptions.map((option) => option.label))
    .optional(),
  firstName: Yup.string().required("First name is required"),
  middleName: Yup.string(),
  lastName: Yup.string().required("First name is required"),
  preferredName: Yup.string(),
  gender: Yup.string().oneOf(genderOptions.map((option) => option.value)),
  maritalStatus: Yup.string().oneOf(
    maritalStatusOptions.map((option) => option.value)
  ),
  birthdate: Yup.date(),
  phoneNumber: Yup.string(),
  mobileNumber: Yup.string(),
  email: Yup.string().email("Invalid email").required("Email is required"),
  apartmentNumber: Yup.string(),
  religion: Yup.string(),
  status: Yup.string().oneOf(["prospect", "active", "inactive"]),
});

const initialClientValues: IClient = {
  email: "",
  status: "active",
  firstName: "",
  lastName: "",
};

const AddClient = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: useCreateNewClient,
    onSuccess: (newClient: IClient) => {
      addToast({
        title: "Create client successfully",
        color: "success",
        timeout: 2000,
        isClosing: true,
      });
      navigate(`/clients/${newClient?.id}`);
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] === "clients",
      });
    },
    onError: () => {
      addToast({
        title: "Create client failed",
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
  } = useFormik<IClient>({
    initialValues: initialClientValues,
    validationSchema: clientSchema,
    onSubmit: async (values) => {
      const { firstName, lastName, status, ...others } = values;

      const filteredValues = Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(others).filter(([_, v]) => v !== "")
      ) as Partial<IClient>;

      const newValues: ClientSubmitValues = {
        ...filteredValues,
        firstName,
        lastName,
        status,
      };

      mutate(newValues);
    },
  });

  const birthdate =
    values.birthdate && isValid(new Date(values.birthdate))
      ? new Date(values.birthdate)
      : null;

  return (
    <div className="container mx-auto pt-4">
      <ClientInfo
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

export default AddClient;
