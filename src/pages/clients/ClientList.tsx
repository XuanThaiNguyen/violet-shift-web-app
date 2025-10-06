import { EMPTY_ARRAY, EMPTY_STRING } from "@/constants/empty";
import { useClients, type ClientFilter } from "@/states/apis/client";
import {
  Button,
  Input,
  Pagination,
  Select,
  SelectItem,
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
import { PlusIcon, Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import type { IClient as ClientType } from "@/types/client";
import {
  ageTypeOptions,
  genderOptions,
  statusTypeOptions,
} from "@/constants/userOptions";
import { differenceInYears, isValid } from "date-fns";

const columns = [
  { name: "Name", uid: "name", width: 160, className: "min-w-[160px]" },
  { name: "", uid: "status", width: 120, className: "min-w-[120px]" },
  { name: "Gender", uid: "gender" },
  { name: "Age", uid: "age" },
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
];

const genderMap = genderOptions.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {} as Record<string, string>);

const ClientList = () => {
  const navigate = useNavigate();

  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string> | "all">(
    new Set([])
  );
  const [filter, setFilter] = useState<ClientFilter>({
    query: "",
    statusTypes: [],
    page: 1,
    limit: 10,
    sort: "createdAt",
    order: "asc",
  });
  const [statusTypeFilter, setStatusTypeFilter] = useState<Set<string> | "all">(
    new Set([])
  );
  const [ageTypeFilter, setAgeTypeFilter] = useState<Set<string> | "all">(
    new Set([])
  );

  const { data: clientData, isLoading } = useClients(filter);
  const clients = clientData?.data || EMPTY_ARRAY;
  const pagination = clientData?.pagination;

  const pages = Math.ceil((pagination?.total ?? 1) / (filter.limit ?? 10));

  const hasSearchFilter = Boolean(filter.query);

  const renderCell = useCallback(
    (client: ClientType, columnKey: string) => {
      const cellValue = client[columnKey as keyof ClientType];
      const fullName = client.firstName
        ? `${client.firstName} ${
            client.middleName ? `${client.middleName} ` : ""
          }${client.lastName}`
        : "";

      let _age = EMPTY_STRING;
      if (client.birthdate && isValid(new Date(client.birthdate))) {
        _age = differenceInYears(
          new Date(),
          new Date(client.birthdate)
        ).toString();
      }

      switch (columnKey) {
        case "name":
          return (
            <div
              className="cursor-pointer"
              onClick={() => navigate(`/clients/${client.id}`)}
            >
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
                description={client.displayName ? fullName : ""}
                name={client.displayName || fullName || ""}
              >
                {client.displayName || fullName || ""}
              </User>
            </div>
          );
        case "status":
          return (
            <div
              className={`flex flex-col rounded-md border-[1px] ${
                client?.status === "active"
                  ? "bg-green-50"
                  : client?.status === "inactive"
                  ? "bg-red-50"
                  : "bg-blue-30"
              } items-center ${
                client?.status === "active"
                  ? "border-green-500"
                  : client?.status === "inactive"
                  ? "border-red-500"
                  : "border-blue-300"
              }`}
            >
              <p
                className={`text-bold text-md capitalize ${
                  client?.status === "active"
                    ? "text-green-500"
                    : client?.status === "inactive"
                    ? "text-red-500"
                    : "text-blue-500"
                }`}
              >
                {client?.status}
              </p>
            </div>
          );
        case "gender":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {client?.gender ? genderMap[client?.gender] : EMPTY_STRING}
              </p>
            </div>
          );
        case "age":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{_age}</p>
            </div>
          );
        case "mobile":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {client?.mobileNumber ? client.mobileNumber : EMPTY_STRING}
              </p>
            </div>
          );
        case "phone":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {client?.phoneNumber ? client.phoneNumber : EMPTY_STRING}
              </p>
            </div>
          );
        case "email":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {client?.email ? client.email : EMPTY_STRING}
              </p>
            </div>
          );
        case "address":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {client?.address ? client.address : EMPTY_STRING}
              </p>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [navigate]
  );

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
          <div className="flex items-end gap-2">
            <Select
              items={statusTypeOptions}
              label="Status"
              size="sm"
              placeholder="All"
              selectionMode="multiple"
              selectedKeys={statusTypeFilter}
              labelPlacement="outside"
              onSelectionChange={
                setStatusTypeFilter as (keys: SharedSelection) => void
              }
              className="w-40"
              classNames={{ trigger: "cursor-pointer" }}
            >
              {statusTypeOptions.map((statusType) => (
                <SelectItem key={statusType.value}>
                  {statusType.label}
                </SelectItem>
              ))}
            </Select>
            <Select
              items={ageTypeOptions}
              label="Age"
              size="sm"
              placeholder="All"
              selectionMode="multiple"
              selectedKeys={ageTypeFilter}
              labelPlacement="outside"
              onSelectionChange={
                setAgeTypeFilter as (keys: SharedSelection) => void
              }
              className="w-40"
              classNames={{ trigger: "cursor-pointer" }}
            >
              {ageTypeOptions.map((ageType) => (
                <SelectItem key={ageType.value}>{ageType.label}</SelectItem>
              ))}
            </Select>
            <Button
              size="sm"
              color="primary"
              className="w-auto min-w-0 px-4"
              onPress={() =>
                setFilter((oldFilter) => {
                  const newFilter = {
                    ...oldFilter,
                    page: 1,
                  };

                  if (filterValue) {
                    newFilter.query = filterValue;
                  } else {
                    delete newFilter.query;
                  }

                  if (statusTypeFilter !== "all") {
                    newFilter.statusTypes = Array.from(statusTypeFilter);
                  } else {
                    delete newFilter.statusTypes;
                  }

                  if (ageTypeFilter !== "all") {
                    newFilter.ageTypes = Array.from(ageTypeFilter);
                  } else {
                    delete newFilter.ageTypes;
                  }
                  return newFilter;
                })
              }
            >
              Filter
            </Button>
          </div>
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
  }, [
    filterValue,
    statusTypeFilter,
    ageTypeFilter,
    pagination?.total,
    selectedKeys,
  ]);

  return (
    <div className="container mx-auto">
      <div className="bg-content1 shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Clients</h1>
          <Button
            as={Link}
            to="/clients/new"
            color="primary"
            size="sm"
            endContent={<PlusIcon size={16} />}
          >
            Add New
          </Button>
        </div>
        <div className="h-4"></div>

        <Table
          isCompact
          // removeWrapper
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          checkboxesProps={{
            classNames: {
              wrapper:
                "after:bg-foreground after:text-background text-background",
            },
          }}
          classNames={{
            wrapper: "max-h-[382px] overflow-x-auto shadow-none thin-scrollbar",
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

export default ClientList;
