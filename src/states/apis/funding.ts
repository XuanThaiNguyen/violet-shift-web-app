import api from "@/services/api/http";
import { useQuery } from "@tanstack/react-query";

export interface IFunding {
  id: string;
  userId: string;
  name: string;
  startDate: string;
  expireDate: string;
  amount: string;
  balance: string;
  isDefault: boolean;
}

export interface IAddFunding {
  userId: string;
  name: string;
  startDate?: string;
  expireDate?: string;
  amount?: string;
  isDefault?: boolean;
}

export const useGetFundingsByUser = ({ userId }: { userId: string }) => {
  const reponse = useQuery<IFunding[]>({
    queryKey: ["fundings", userId],
    queryFn: () => api.get(`/api/v1/fundings/${userId}`),
    enabled: !!localStorage.getItem("auth_token"),
  });

  return reponse;
};

export const usePostFunding = async (values: IAddFunding) => {
  const reponse = await api.post("/api/v1/fundings", values);

  return reponse;
};

export const useUpdateFunding = async ({
  id,
  values,
}: {
  id: string;
  values: IAddFunding;
}) => {
  const reponse = await api.put(`/api/v1/fundings/${id}`, values);

  return reponse;
};

export const useDeleteFunding = async (fundingId: string) => {
  const reponse = await api.delete(`/api/v1/fundings/${fundingId}`);

  return reponse;
};
