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
import type { PaginationResponse } from "@/types/common";
import { useEffect } from "react";

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
  languages: Yup.array().of(Yup.string()).optional(),
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
  languages: [],
  status: "active",
};

const UpdateClient = () => {
  const navigate = useNavigate();
  const { id: clientId } = useParams();
  const queryClient = useQueryClient();
  const { data: dataClient, isLoading } = useClientDetail(clientId || "");

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
      queryClient.setQueryData(["clients", clientId], (old: IClient) => ({
        ...old,
        ...updatedClient,
      }));
      // when lagged update is reported, just clear all the queries data related to client list
      queryClient.setQueriesData(
        {
          predicate: (query) =>
            query.queryKey[0] === "clients" &&
            typeof query.queryKey[1] === "object",
        },
        (old: PaginationResponse<IClient>) => {
          if (Array.isArray(old?.data)) {
            const newData = old.data.map((item) => {
              if (item.id === clientId) {
                return {
                  ...item,
                  ...updatedClient,
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

      navigate(`/clients/${updatedClient?.id}`);
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
    setValues,
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

  useEffect(() => {
    if (isLoading) return;
    if (dataClient) {
      setValues(initClient);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, dataClient]);

  if (!clientId) return <></>;

  return (
    <div className="container mx-auto mt-4">
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
