import { EMPTY_ARRAY, EMPTY_STRING } from "@/constants/empty";
import {
  useDeleteFunding,
  useGetFundingsByUser,
  type IFunding,
} from "@/states/apis/funding";
import {
  addToast,
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@heroui/react";
import { format, isValid } from "date-fns";
import { CheckIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { CLIENT_FUNDING_COLUMS, ClientFundingMessages } from "../Constants";
import FundingModal from "./FundingModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface ClientFundingProps {
  clientId: string;
}

const ClientFunding = ({ clientId }: ClientFundingProps) => {
  const [selectedFund, setSelectedFund] = useState<IFunding | null>(null);

  const { onOpen, onClose, isOpen } = useDisclosure();

  const queryClient = useQueryClient();

  const { data: dataFundings } = useGetFundingsByUser({ userId: clientId });

  const { mutate: mutateRemove, isPending: isPendingRemove } = useMutation({
    mutationFn: useDeleteFunding,
    onSuccess: () => {
      addToast({
        title: "Remove fund successfully",
        color: "success",
        timeout: 2000,
        isClosing: true,
      });
      queryClient.invalidateQueries({ queryKey: ["fundings"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.data?.code) {
          addToast({
            title: ClientFundingMessages[error.response.data.code],
            color: "danger",
            timeout: 2000,
            isClosing: true,
          });
        }
      } else {
        addToast({
          title: "Remove fund failed",
          color: "danger",
          timeout: 2000,
          isClosing: true,
        });
      }
    },
  });

  const onRemove = (fundingId: string) => {
    mutateRemove(fundingId);
  };

  const renderCell = useCallback((fundingItem: IFunding, columnKey: string) => {
    const _fundingStartDate =
      fundingItem.startDate && isValid(new Date(fundingItem.startDate))
        ? format(new Date(fundingItem.startDate), "dd-MM-yyyy")
        : EMPTY_STRING;
    const _fundingEndDate =
      fundingItem.expireDate && isValid(new Date(fundingItem.expireDate))
        ? format(new Date(fundingItem.expireDate), "dd-MM-yyyy")
        : EMPTY_STRING;

    switch (columnKey) {
      case "name":
        return (
          <div>
            <span>{fundingItem.name}</span>
          </div>
        );
      case "starts":
        return (
          <div>
            <span>{_fundingStartDate}</span>
          </div>
        );
      case "expires":
        return (
          <div>
            <span>{_fundingEndDate}</span>
          </div>
        );
      case "amount":
        return (
          <div>
            <span>{fundingItem.amount}</span>
          </div>
        );
      case "balance":
        return (
          <div>
            <span>{fundingItem.balance}</span>
          </div>
        );
      case "default":
        return (
          <div>
            {fundingItem.isDefault ? (
              <CheckIcon size={16} color={"blue"} />
            ) : (
              <></>
            )}
          </div>
        );
      case "actions":
        return (
          <div className="flex  items-center gap-2 justify-end">
            <Button
              variant="flat"
              onPress={() => {
                setSelectedFund(fundingItem);
                onOpen();
              }}
            >
              Edit
            </Button>
            <Button
              onPress={() => onRemove(fundingItem.id)}
              isLoading={isPendingRemove}
              color="danger"
            >
              Remove
            </Button>
          </div>
        );
      default:
        return <></>;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    if (selectedFund) {
      setSelectedFund(null);
    }

    onClose();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <span>Funds</span>
        <button className="cursor-pointer" onClick={onOpen}>
          <span className="text-primary ">ADD FUND</span>
        </button>
      </div>
      <div className="h-4"></div>
      <Table removeWrapper className="bg-content1">
        <TableHeader columns={CLIENT_FUNDING_COLUMS}>
          {(header) => (
            <TableColumn key={header.uid}>{header.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          className="bg-content1"
          items={dataFundings || EMPTY_ARRAY}
          emptyContent={"No rows to display."}
        >
          {(item: IFunding) => (
            <TableRow className="bg-content1" key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey as string)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {isOpen ? (
        <FundingModal
          isOpen={isOpen}
          onClose={handleClose}
          clientId={clientId}
          selectedFund={selectedFund}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default ClientFunding;
