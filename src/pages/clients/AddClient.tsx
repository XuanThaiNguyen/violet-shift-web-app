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
  useSalutation: Yup.boolean(),
  salutation: Yup.string().oneOf(
    salutationTypeOptions.map((option) => option.value)
  ),
  firstName: Yup.string(),
  middleName: Yup.string(),
  lastName: Yup.string(),
  displayName: Yup.string().required("Display name is required"),
  gender: Yup.string().oneOf(genderOptions.map((option) => option.value)),
  maritalStatus: Yup.string().oneOf(
    maritalStatusOptions.map((option) => option.value)
  ),
  birthdate: Yup.date(),
  phoneNumber: Yup.string(),
  mobileNumber: Yup.string(),
  email: Yup.string(),
  apartmentNumber: Yup.string(),
  religion: Yup.string(),
  status: Yup.string().oneOf(["prospect", "active", "inactive"]),
});

const initialClientValues: IClient = {
  useSalutation: false,
  salutation: "",
  firstName: "",
  middleName: "",
  lastName: "",
  displayName: "",
  address: "",
  birthdate: "",
  gender: "",
  maritalStatus: "",
  apartmentNumber: "",
  phoneNumber: "",
  mobileNumber: "",
  email: "",
  religion: "",
  nationality: "",
  status: "active",
};

const AddClient = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: useCreateNewClient,
    onSuccess: (newClient: IClient) => {
      addToast({
        title: "Create client successful",
        color: "success",
        timeout: 2000,
        isClosing: true,
      });
      navigate(`/clients/${newClient?.id}`);
      queryClient.invalidateQueries({ queryKey: ["clients"] });
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

  const clientFormik = useFormik<IClient>({
    initialValues: initialClientValues,
    validationSchema: clientSchema,
    onSubmit: async (values) => {
      const { salutation, useSalutation, displayName, status, ...others } =
        values;

      const filteredValues = Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(others).filter(([_, v]) => v !== "")
      ) as Partial<IClient>;

      const newValues: ClientSubmitValues = useSalutation
        ? {
            ...filteredValues,
            useSalutation,
            salutation,
            displayName,
            status,
          }
        : { ...filteredValues, useSalutation, displayName, status };

      mutate(newValues);
    },
  });

  const birthdate =
    clientFormik.values.birthdate &&
    isValid(new Date(clientFormik.values.birthdate))
      ? new Date(clientFormik.values.birthdate)
      : null;

  return (
    <div className="px-4 w-full">
      <ClientInfo
        clientFormik={clientFormik}
        birthdate={birthdate}
        isPending={isPending}
        mode="add"
      />
    </div>
  );
};

export default AddClient;
