import { statusTypeOptions } from "@/constants/userOptions";
import { useChangeStatusClient, useClientDetail } from "@/states/apis/client";
import type { ClientStatus, IClient } from "@/types/client";
import { addToast, Avatar, Select, SelectItem, Tab, Tabs } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import ClientDetail from "./components/ClientDetail";

const ClientProfile = () => {
  const navigate = useNavigate();
  const { id: clientId } = useParams();

  const { data: detailClient } = useClientDetail(clientId || "");

  const [statusType, setStatusType] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: useChangeStatusClient,
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

  if (!clientId) return <></>;

  return (
    <div className="px-4">
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
          <span className="text-2xl">{detailClient?.displayName || ""}</span>
        </div>
        <Select
          size="sm"
          isLoading={isPending}
          color={
            detailClient?.status === "active"
              ? "primary"
              : detailClient?.status === "prospect"
              ? "success"
              : "default"
          }
          selectionMode="single"
          selectedKeys={statusType ? [statusType] : []}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0];
            setStatusType(selected as string);
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
      </div>
      <div className="h-4"></div>
      <Tabs variant="underlined" color="primary">
        <Tab key="profile" title="Profile">
          <ClientDetail clientId={clientId || ""} detailClient={detailClient} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default ClientProfile;
