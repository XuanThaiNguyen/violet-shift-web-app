import { statusTypeOptions } from "@/constants/userOptions";
import { useChangeStatusClient, useClientDetail } from "@/states/apis/client";
import type { ClientStatus, IClient } from "@/types/client";
import { getDisplayName } from "@/utils/strings";
import { addToast, Avatar, Select, SelectItem, Tab, Tabs } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import ClientDetail from "./components/ClientDetail";
import type { PaginationResponse } from "@/types/common";

const ClientProfile = () => {
  const navigate = useNavigate();
  const { id: clientId } = useParams();

  const { data: detailClient, isLoading } = useClientDetail(clientId || "");

  const queryClient = useQueryClient();

  const { mutate, isPending, variables } = useMutation({
    mutationFn: useChangeStatusClient,
    onSuccess: (_: unknown, { status }) => {
      addToast({
        title: "Update client successfully",
        color: "success",
        timeout: 2000,
        isClosing: true,
      });
      queryClient.setQueryData(["clients", clientId], (old: IClient) => ({
        ...old,
        status: status,
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
                  status: status,
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

  // this is the optimistic update
  // if pending, use the variables status, otherwise use the detailClient status
  const statusType = isPending ? variables?.status : detailClient?.status;

  const _clientName = getDisplayName({
    salutation: detailClient?.salutation,
    firstName: detailClient?.firstName,
    middleName: detailClient?.middleName,
    lastName: detailClient?.lastName,
    preferredName: detailClient?.preferredName,
  });

  if (!clientId) return <></>;

  return (
    <div className="px-4 mt-4">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/clients/list")}
      >
        <ArrowLeft />
        <span className="text-sm">Back to Client List</span>
      </div>
      <div className="h-8"></div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar
            className="w-8 h-8 rounded-full object-cover"
            color={"primary"}
          />
          <span className="text-2xl">{_clientName || ""}</span>
        </div>
        {!isLoading && (
          <Select
            size="sm"
            isLoading={isPending}
            disabled={isPending}
            color={
              statusType === "prospect"
                ? "primary"
                : statusType === "active"
                ? "success"
                : "default"
            }
            selectionMode="single"
            selectedKeys={statusType ? [statusType] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0];
              mutate({
                status: selected as ClientStatus,
                id: clientId,
              });
            }}
            className="w-48"
            classNames={{ trigger: "cursor-pointer" }}
          >
            {statusTypeOptions.map((status) => (
              <SelectItem key={status.value}>{status.label}</SelectItem>
            ))}
          </Select>
        )}
      </div>
      <div className="h-4"></div>
      <Tabs variant="underlined" color="primary">
        <Tab key="profile" title="Profile">
          <ClientDetail
            clientId={clientId || ""}
            detailClient={detailClient}
            clientName={_clientName}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default ClientProfile;
