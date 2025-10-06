import {
  maritalStatusOptions,
  salutationTypeOptions,
} from "@/constants/clientOptions";
import { genderOptions } from "@/constants/userOptions";
import api from "@/services/api/http";
import type { ClientSubmitValues, IClient } from "@/types/client";
import { addToast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isValid } from "date-fns";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router";
import * as Yup from "yup";
import ClientInfo from "./components/ClientInfo";
import { useClientDetail } from "@/states/apis/client";
import { ArrowLeft } from "lucide-react";

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

const updateClient = async ({
  id,
  values,
}: {
  id: string;
  values: IClient;
}) => {
  const res = await api.put(`/api/v1/clients/${id}`, values);
  return res;
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
    mutationFn: updateClient,
    onSuccess: (updatedClient: IClient) => {
      addToast({
        title: "Update client successful",
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

  const clientFormik = useFormik<IClient>({
    initialValues: initClient,
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

      mutate({ id: clientId!, values: newValues });
    },
  });

  const birthdate =
    clientFormik.values.birthdate &&
    isValid(new Date(clientFormik.values.birthdate))
      ? new Date(clientFormik.values.birthdate)
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
        clientFormik={clientFormik}
        birthdate={birthdate}
        isPending={isPending}
        mode={"update"}
      />
    </div>
  );
};

export default UpdateClient;
