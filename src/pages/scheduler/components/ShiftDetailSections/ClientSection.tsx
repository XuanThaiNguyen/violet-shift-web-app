import { Divider, User } from "@heroui/react";
import { Users } from "lucide-react";

// utils
import { getDisplayName } from "@/utils/strings";
import clsx from "clsx";

// types
import { EMPTY_STRING } from "@/constants/empty";
import type { IFullShiftDetail } from "@/types/shift";
import type { FC } from "react";

type ClientSectionProps = {
  values: IFullShiftDetail;
};

const ClientSection: FC<ClientSectionProps> = ({ values }) => {
  return (
    <div className="py-4 px-3 rounded-lg bg-content1">
      <div className="flex items-center gap-2">
        <Users size={20} color={"green"} />
        <span className="font-medium text-md">Client Info</span>
      </div>
      <div className="h-2"></div>
      <Divider />
      <div className="h-2"></div>
      <div className="flex flex-col">
        {values.clientSchedules.map((clientSchedule, index) => {
          const isLast = index === values.clientSchedules.length - 1;
          const client = clientSchedule.client;
          const priceBook = clientSchedule.priceBook;
          const fund = clientSchedule.fund;

          const name = client ? getDisplayName(client) : EMPTY_STRING;
          const actualName = client
            ? `${client.firstName}+${client.lastName}`
            : EMPTY_STRING;
          const avatar =
            client?.avatar || `https://ui-avatars.com/api/?name=${actualName}`;

          return (
            <div
              className={clsx(
                "flex flex-col gap-2",
                !isLast && "border-b border-divider mb-2"
              )}
              key={clientSchedule.id!}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">Client:</span>
                <User avatarProps={{ src: avatar, size: "sm" }} name={name} />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">Price Book:</span>
                <span className="text-sm">{priceBook.name}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">Fund:</span>
                <span className="text-sm">{fund.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientSection;
