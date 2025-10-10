import api from "@/services/api/http";
import { useQuery } from "@tanstack/react-query";

export interface IUpdatePriceBook {
  priceBookTitle?: string;
  priceBookId?: string;
  rules?: IPriceBookRule[];
  id?: string;
}

export interface IPriceBookRule {
  dayOfWeek: string;
  timeFrom: number;
  timeTo: number;
  perHour: number;
  referenceNumberHour: number;
  perKm: number;
  referenceNumberKm: number;
  effectiveDate: string;
  _id: string;
}

export interface IPrices {
  priceBookTitle: string;
  priceBookId: string;
  isArchived?: boolean;
  rules: IPriceBookRule[];
  id: string;
}

export interface IAddPriceBookRule {
  dayOfWeek: string;
  timeFrom: number;
  timeTo: number;
  perHour: number;
  referenceNumberHour: number;
  perKm: number;
  referenceNumberKm: number;
  effectiveDate: string;
}

export interface IAddPriceBook {
  priceBookTitle: string;
  priceBookId: string;
  rules: IAddPriceBookRule[];
}

export const useGetPrices = () => {
  const pricesResponse = useQuery<IPrices[]>({
    queryKey: ["prices"],
    queryFn: () => api.get("/api/v1/pricebook"),
    enabled: !!localStorage.getItem("auth_token"),
  });

  return pricesResponse;
};

export const updatePriceBook = async ({
  id,
  values,
}: {
  id: string;
  values: IUpdatePriceBook;
}) => {
  return await api.put(`/api/v1/pricebook/${id}`, values);
};

export const archivePriceBook = async ({
  id,
  isArchived,
}: {
  id: string;
  isArchived: boolean;
}) => {
  return await api.post("/api/v1/pricebook/archive", { id, isArchived });
};

export const addPriceBook = async (values: IAddPriceBook) => {
  return await api.post("/api/v1/pricebook", values);
};
