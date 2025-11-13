import { useEffect, useMemo } from "react";
import { Users } from "lucide-react";
import { Button, Divider, User } from "@heroui/react";
import { Select } from "@/components/select/Select";

// apis
import { useGetClients } from "@/states/apis/client";
import { useGetPrices } from "@/states/apis/prices";
import { useGetFundingsByUser } from "@/states/apis/funding";

// constants
import { EMPTY_ARRAY } from "@/constants/empty";

// utils
import { getDisplayName } from "@/utils/strings";

// types
import type { FC, SetStateAction } from "react";
import type { IClient } from "@/types/client";
import type { IShiftValues } from "@/types/shift";
import type { FormikErrors } from "formik";
import type { SelectOption } from "@/components/select/Select";
import { useNavigate } from "react-router";

type ClientFormProps = {
  values: IShiftValues;
  setValues: (
    values: SetStateAction<IShiftValues>,
    shouldValidate?: boolean
  ) => Promise<FormikErrors<IShiftValues>> | Promise<void>;
};

const ClientForm: FC<ClientFormProps> = ({ values, setValues }) => {
  const navigate = useNavigate();

  const { data: allClientsData } = useGetClients({
    query: "",
    page: 1,
    limit: 100,
  });
  const allClients = allClientsData?.data || EMPTY_ARRAY;

  const { data: dataPriceBooks = EMPTY_ARRAY } = useGetPrices();
  const { data: dataFunds = EMPTY_ARRAY } = useGetFundingsByUser({
    client: values?.clientSchedules[0]?.client || "",
  });
  const allClientsTransform = useMemo(() => {
    const map: Record<string, IClient> = {};
    const options: SelectOption[] = [];
    allClients?.forEach((client) => {
      map[client.id!] = client;
      const name = getDisplayName(client);
      const actualName = `${client.firstName}+${client.lastName}`;
      const avatar =
        client.avatar || `https://ui-avatars.com/api/?name=${actualName}`;
      options.push({
        label: (
          <User
            avatarProps={{ src: avatar, size: "sm" }}
            name={name}
            description={client.email}
          />
        ),
        value: client.id!,
      });
    });
    return { map, options };
  }, [allClients]);
  const priceBookOptions = useMemo(() => {
    return dataPriceBooks.map((priceBook) => ({
      label: priceBook.name,
      value: priceBook.id!,
    }));
  }, [dataPriceBooks]);
  const fundOptions = useMemo(() => {
    return dataFunds.map((fund) => ({
      label: fund.name,
      value: fund.id!,
      isDefault: fund.isDefault,
    }));
  }, [dataFunds]);

  useEffect(() => {
    if (values.clientSchedules[0]?.client && fundOptions?.length > 0) {
      const fund =
        fundOptions.find((option) => option.isDefault) || fundOptions[0];

      setValues((prev) => ({
        ...prev,
        clientSchedules: [{ ...prev.clientSchedules[0], fund: fund.value }],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.clientSchedules[0]?.client, fundOptions]);

  const onAddFund = () => {
    navigate(`/clients/${values.clientSchedules[0]?.client}`);
  };

  return (
    <div className="py-4 px-3 rounded-lg bg-content1">
      <div className="flex items-center gap-2">
        <Users size={20} color={"green"} />
        <span className="font-medium text-md">Client</span>
      </div>
      <div className="h-2"></div>
      <Divider />
      <div className="h-4"></div>
      <div className="flex items-center justify-between">
        <span className="text-sm">
          Choose client <span className="text-red-500">*</span>
        </span>
        <Select
          className="max-w-xs"
          placeholder="Select client"
          classNames={{
            content: "w-screen max-w-xs",
          }}
          options={allClientsTransform.options}
          value={values.clientSchedules[0]?.client || undefined}
          onValueChange={(value) => {
            setValues((old) => {
              const oldClientSchedule = old.clientSchedules[0];
              return {
                ...old,
                clientSchedules: [
                  {
                    client: value as string,
                    timeFrom: old.timeFrom,
                    timeTo: old.timeTo,
                    priceBook: oldClientSchedule?.priceBook || "",
                    fund: "",
                  },
                ],
              };
            });
          }}
        />
      </div>
      <div className="h-4"></div>
      <div className="flex items-center justify-between">
        <span className="text-sm">
          Price book <span className="text-red-500">*</span>
        </span>
        <Select
          className="max-w-xs"
          classNames={{
            content: "w-screen max-w-xs",
          }}
          placeholder="Select price book"
          options={priceBookOptions}
          value={values.clientSchedules[0]?.priceBook || undefined}
          onValueChange={(value) => {
            setValues((old) => {
              const oldClientSchedule = old.clientSchedules[0];
              return {
                ...old,
                clientSchedules: [
                  {
                    ...oldClientSchedule,
                    client: oldClientSchedule?.client || "",
                    timeFrom: oldClientSchedule?.timeFrom || null,
                    timeTo: oldClientSchedule?.timeTo || null,
                    priceBook: value as string,
                    fund: oldClientSchedule?.fund || "",
                  },
                ],
              };
            });
          }}
        />
      </div>
      <div className="h-4"></div>
      <div className="flex items-center justify-between">
        <span className="text-sm">
          Funds <span className="text-red-500">*</span>
        </span>
        <Select
          emptyComponent={
            <div>
              <div className="text-center cursor-pointer">No fund!</div>
              <div className="h-2"></div>
              <Button onPress={onAddFund} size="sm" color={"primary"}>
                Add now
              </Button>
            </div>
          }
          isTriggerDisabled={!values.clientSchedules[0]?.client}
          className="max-w-xs"
          classNames={{
            content: "w-screen max-w-xs",
          }}
          placeholder={
            !values.clientSchedules[0]?.client
              ? "Select client first"
              : "Select fund"
          }
          options={fundOptions}
          value={values.clientSchedules[0]?.fund || undefined}
          onValueChange={(value) => {
            setValues((old) => {
              const oldClientSchedule = old.clientSchedules[0];
              return {
                ...old,
                clientSchedules: [
                  {
                    ...oldClientSchedule,
                    client: oldClientSchedule?.client || "",
                    timeFrom: oldClientSchedule?.timeFrom || null,
                    timeTo: oldClientSchedule?.timeTo || null,
                    priceBook: oldClientSchedule?.priceBook || "",
                    fund: value as string,
                  },
                ],
              };
            });
          }}
        />
      </div>
    </div>
  );
};

export default ClientForm;
