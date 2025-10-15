import {
  maritalStatusOptions,
  salutationTypeOptions,
} from "@/constants/clientOptions";
import { genderOptions } from "@/constants/userOptions";
import { useClientDetail, useUpdateClient } from "@/states/apis/client";
import type { ClientSubmitValues, IClient } from "@/types/client";
import { addToast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isValid } from "date-fns";
import { useFormik } from "formik";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import * as Yup from "yup";
import ClientInfo from "./components/ClientInfo";

const clientSchema = Yup.object({
  alutation: Yup.string()
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
  salutation: "",
  firstName: "",
  middleName: "",
  lastName: "",
  preferredName: "",
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

const UpdateClient = () => {
  const navigate = useNavigate();
  const { id: clientId } = useParams();
  const queryClient = useQueryClient();
  const { data: dataClient } = useClientDetail(clientId || "");

  const initClient = {
    ...initialClientValues,
    ...dataClient,
  };

  const { mutate, isPending } = useMutation({
    mutationFn: useUpdateClient,
    onSuccess: (updatedClient: IClient) => {
      addToast({
        title: "Update client successfully",
        color: "success",
        timeout: 2000,
        isClosing: true,
      });
      navigate(`/clients/${updatedClient?.id}`);
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: () => {
      addToast({
        title: "Update client failed",
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
    initialValues: initClient,
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

      mutate({ id: clientId!, values: newValues });
    },
  });

  const birthdate =
    values.birthdate && isValid(new Date(values.birthdate))
      ? new Date(values.birthdate)
      : null;

  if (!clientId) return <></>;

  return (
    <div className="px-4 w-full">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate(`/clients/${clientId}`)}
      >
        <ArrowLeft />
        <span>Back to Client Profile</span>
      </div>
      <div className="h-4"></div>
      <ClientInfo
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

export default UpdateClient;
