import { useMemo } from "react";
import { Users } from "lucide-react";
import { Divider } from "@heroui/react";

// apis
import { useGetClients } from "@/states/apis/client";
import { useGetPrices} from "@/states/apis/prices";
import { useGetFundingsByUser, type IFunding } from "@/states/apis/funding";

// constants
import { EMPTY_ARRAY, EMPTY_OBJECT, EMPTY_STRING } from "@/constants/empty";

// utils
import { getDisplayName } from "@/utils/strings";

// types
import type { FC } from "react";
import type { IClient } from "@/types/client";
import type { IShiftValues } from "@/types/shift";
import type { IPrices } from "@/states/apis/prices";

type ClientFormProps = {
  values: IShiftValues;
};

const ClientForm: FC<ClientFormProps> = ({ values }) => {
  const { data: allClientsData } = useGetClients({
    query: "",
    page: 1,
    limit: 100,
  });

  const { data: dataPriceBooks = EMPTY_ARRAY } = useGetPrices();
  const { data: dataFunds = EMPTY_ARRAY } = useGetFundingsByUser({
    userId: values?.clientSchedules[0]?.client || "",
  });
  const allClientsMap: Record<string, IClient> = allClientsData?.map || EMPTY_OBJECT;
  const allPriceBooksMap = useMemo(() => {
    const map: Record<string, IPrices> = {};
    dataPriceBooks.forEach((priceBook) => {
      map[priceBook.id!] = priceBook;
    });
    return map;
  }, [dataPriceBooks]);
  const allFundsMap = useMemo(() => {
    const map: Record<string, IFunding> = {};
    dataFunds.forEach((fund) => {
      map[fund.id!] = fund;
    });
    return map;
  }, [dataFunds]);

  return (
    <div className="py-4 px-3 rounded-lg bg-content1">
      <div className="flex items-center gap-2">
        <Users size={20} color={"green"} />
        <span className="font-medium text-md">Client Info</span>
      </div>
      <div className="h-2"></div>
      <Divider />
      <div className="h-2"></div>
      <div className="flex flex-col gap-3">
        {values.clientSchedules.map((clientSchedule) => (
          <div className="flex flex-col gap-2" key={clientSchedule.id!}>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Client:</span>
              <span className="text-sm">
                { allClientsMap?.[clientSchedule.client!] ? getDisplayName({
                  firstName: allClientsMap[clientSchedule.client!].firstName,
                  lastName: allClientsMap[clientSchedule.client!].lastName,
                  preferredName:
                    allClientsMap[clientSchedule.client!].preferredName,
                }) : EMPTY_STRING}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Price Book:</span>
              <span className="text-sm">
                {allPriceBooksMap?.[clientSchedule.priceBook!] ? allPriceBooksMap[clientSchedule.priceBook!].priceBookTitle : EMPTY_STRING}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Fund:</span>
              <span className="text-sm">
                {allFundsMap?.[clientSchedule.fund!] ? allFundsMap[clientSchedule.fund!].name : EMPTY_STRING}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientForm;
