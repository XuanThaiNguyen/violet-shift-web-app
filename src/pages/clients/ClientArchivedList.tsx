import { EMPTY_ARRAY, EMPTY_STRING } from "@/constants/empty";
import {
  useGetArchivedClients,
  usePostArchiveClient,
  type ClientFilter,
} from "@/states/apis/client";
import {
  addToast,
  Button,
  Input,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
  type SharedSelection,
} from "@heroui/react";
import { Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import type { IClient as ClientType, IClient } from "@/types/client";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import queryClient from "@/constants/queryClient";

const columns = [
  { name: "Name", uid: "name", width: 160, className: "min-w-[160px]" },
  { name: "Mobile", uid: "mobile", width: 120, className: "min-w-[120px]" },
  { name: "Phone", uid: "phone", width: 120, className: "min-w-[120px]" },
  {
    name: "Email",
    uid: "email",
    sortable: true,
    width: 240,
    className: "min-w-[240px]",
  },
  { name: "Address", uid: "address", width: 240, className: "min-w-[240]" },
  { name: "", uid: "unarchived", width: 120, className: "min-w-[120px]" },
];

const ClientArchivedList = () => {
  const navigate = useNavigate();

  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string> | "all">(
    new Set([])
  );
  const [filter, setFilter] = useState<ClientFilter>({
    query: "",
    page: 1,
    limit: 10,
    sort: "createdAt",
    order: "asc",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: usePostArchiveClient,
    onSuccess: (updatedClient: IClient) => {
      addToast({
        title: "Update client successfully",
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

  const { data: clientData, isLoading } = useGetArchivedClients(filter);
  const clients = clientData?.data || EMPTY_ARRAY;
  const pagination = clientData?.pagination;

  const pages = Math.ceil((pagination?.total ?? 1) / (filter.limit ?? 10));

  const hasSearchFilter = Boolean(filter.query);

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFilter((oldFilter) => {
        return {
          ...oldFilter,
          limit: Number(e.target.value),
          page: 1,
        };
      });
    },
    []
  );

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-end items-center gap-2">
        <label className="flex items-center text-default-400 text-small">
          Rows per page:
          <select
            className="bg-transparent outline-solid outline-transparent text-default-400 text-small"
            onChange={onRowsPerPageChange}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </label>
        <Pagination
          showControls
          size="sm"
          color="primary"
          classNames={{
            item: "cursor-pointer",
            next: "cursor-pointer",
            prev: "cursor-pointer",
          }}
          isDisabled={hasSearchFilter}
          page={filter.page ?? 1}
          total={pages}
          variant="light"
          onChange={(page) =>
            setFilter((oldFilter) => ({ ...oldFilter, page }))
          }
        />
      </div>
    );
  }, [onRowsPerPageChange, hasSearchFilter, filter.page, pages]);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-2 items-end">
          <Input
            isClearable
            size="sm"
            label="Search"
            classNames={{
              inputWrapper: "border-1",
            }}
            placeholder="Search by email..."
            labelPlacement="outside"
            startContent={<Search size={16} className="text-default-400" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={setFilterValue}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {pagination?.total ?? EMPTY_STRING}{" "}
            {pagination?.total === 1 ? "user" : "users"}
          </span>
          <span className="text-small text-default-400">
            {selectedKeys === "all"
              ? "All items selected"
              : `${selectedKeys.size} of ${
                  pagination?.total ?? EMPTY_STRING
                } selected`}
          </span>
        </div>
      </div>
    );
  }, [filterValue, pagination?.total, selectedKeys]);

  const renderCell = useCallback(
    (client: ClientType, columnKey: string) => {
      const cellValue = client[columnKey as keyof ClientType];
      const fullName = client.firstName
        ? `${client.firstName} ${
            client.middleName ? `${client.middleName} ` : ""
          }${client.lastName}`
        : "";

      switch (columnKey) {
        case "name":
          return (
            <User
              avatarProps={{
                radius: "full",
                size: "sm",
                src: client.avatar,
                classNames: {
                  base: "flex-shrink-0",
                },
              }}
              classNames={{
                description: "text-default-500",
              }}
              description={client.preferredName ? fullName : ""}
              name={client.preferredName || fullName || ""}
            >
              {client.preferredName || fullName || ""}
            </User>
          );
        case "mobile":
          return (
            <p className="text-bold text-small capitalize">
              {client?.mobileNumber ? client.mobileNumber : EMPTY_STRING}
            </p>
          );
        case "phone":
          return (
            <p className="text-bold text-small capitalize">
              {client?.phoneNumber ? client.phoneNumber : EMPTY_STRING}
            </p>
          );
        case "email":
          return (
            <p className="text-bold text-small capitalize">
              {client?.email ? client.email : EMPTY_STRING}
            </p>
          );
        case "address":
          return (
            <p className="text-bold text-small capitalize">
              {client?.address ? client.address : EMPTY_STRING}
            </p>
          );
        case "unarchived":
          return (
            <Button
              color="default"
              size="sm"
              isLoading={isPending}
              onPress={() => mutate({ id: client.id!, isArchived: false })}
            >
              <p className={`text-bold text-md capitalize`}>Unarchived</p>
            </Button>
          );
        default:
          return cellValue;
      }
    },
    [mutate, isPending]
  );

  return (
    <div className="container mx-auto pt-4">
      <div className="bg-content1 shadow-md rounded-lg p-4">
        <h1 className="text-2xl font-bold">Archived Clients</h1>
        <div className="h-4"></div>

        <Table
          isCompact
          // removeWrapper
          bottomContent={bottomContent} //TODO: add bottomContent
          bottomContentPlacement="outside"
          checkboxesProps={{
            classNames: {
              wrapper:
                "after:bg-foreground after:text-background text-background",
            },
          }}
          classNames={{
            wrapper: "max-h-[552px] overflow-x-auto shadow-none thin-scrollbar",
            th: "bg-transparent text-default-500 border-b border-divider",
            td: [
              // changing the rows border radius
              // first
              "first:group-data-[first=true]/tr:before:rounded-none",
              "last:group-data-[first=true]/tr:before:rounded-none",
              // middle
              "group-data-[middle=true]/tr:before:rounded-none",
              // last
              "first:group-data-[last=true]/tr:before:rounded-none",
              "last:group-data-[last=true]/tr:before:rounded-none",
            ],
          }}
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          sortDescriptor={{
            column: filter.sort ?? "joinedAt",
            direction: filter.order === "asc" ? "ascending" : "descending",
          }}
          topContent={topContent}
          topContentPlacement="outside"
          onSelectionChange={setSelectedKeys as (keys: SharedSelection) => void}
          onSortChange={(sortDescriptor) => {
            setFilter((oldFilter) => ({
              ...oldFilter,
              sort: sortDescriptor.column as string,
              order: sortDescriptor.direction === "ascending" ? "asc" : "desc",
            }));
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
                width={column.width}
                className={column.className}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            isLoading={isLoading}
            loadingContent={<Spinner label="Loading..." />}
            emptyContent={"No clients found"}
            items={clients}
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey as string)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientArchivedList;
