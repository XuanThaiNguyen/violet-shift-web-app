import { EMPTY_ARRAY, EMPTY_STRING } from "@/constants/empty";
import { ROLE_IDS, ROLE_NAMES } from "@/constants/roles";
import { useStaffs, type StaffFilter } from "@/states/apis/staff";
import { useGetWorklogSummary } from "@/states/apis/worklogs";
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
import {
  addWeeks,
  endOfWeek,
  format,
  startOfDay,
  startOfWeek,
  subWeeks,
} from "date-fns";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import type { User as UserType } from "@/types/user";
import { getFullName } from "@/utils/strings";
import type { FC } from "react";

type StaffRow = UserType & {
  _id?: string;
  totalWorklogHours?: number;
};

const columns = [
  {
    name: "Name",
    uid: "name",
    sortable: false,
    width: 240,
    className: "min-w-[160px]",
  },
  {
    name: "Total worklog hours",
    uid: "totalWorklogHours",
    sortable: false,
    width: 180,
    className: "min-w-[180px]",
  },
];

const minFrom = startOfDay(new Date("2025-10-01"));
const weekStartsOn = 1;

const roleOptions = [
  { name: ROLE_NAMES.CARER, value: ROLE_IDS.CARER },
  { name: ROLE_NAMES.ADMIN, value: ROLE_IDS.ADMIN },
  { name: ROLE_NAMES.COORDINATOR, value: ROLE_IDS.COORDINATOR },
  { name: ROLE_NAMES.OFFICE_SUPPORT, value: ROLE_IDS.OFFICE_SUPPORT },
];

const Worklogs: FC = () => {
  const navigate = useNavigate();

  const currentBlockFrom = startOfWeek(new Date(), { weekStartsOn });
  const maxFrom = currentBlockFrom;
  const [from, setFrom] = useState<Date>(currentBlockFrom);
  const to = endOfWeek(addWeeks(from, 1), { weekStartsOn });

  const [filterValue, setFilterValue] = useState("");
  const [roleFilter, setRoleFilter] = useState<Set<string> | "all">(
    new Set([]),
  );
  const [filter, setFilter] = useState<StaffFilter>({
    query: "",
    roles: [],
    page: 1,
    limit: 10,
    sort: "createdAt",
    order: "desc",
    archived: false,
  });

  const { data: staffData, isLoading } = useStaffs(filter);
  const { data: summaryData } = useGetWorklogSummary({
    from: from.getTime(),
    to: to.getTime(),
  });
  const staffs = staffData?.data || EMPTY_ARRAY;
  const pagination = staffData?.pagination;

  const summaryMap = useMemo(() => {
    return (summaryData ?? []).reduce(
      (acc, item) => {
        acc[item.staffId] = item;
        return acc;
      },
      {} as Record<string, { totalHours: number; segments: number }>,
    );
  }, [summaryData]);

  const staffList = useMemo(() => {
    return staffs.map((staff) => ({
      ...staff,
      totalWorklogHours: summaryMap[staff.id ?? EMPTY_STRING]?.totalHours ?? 0,
    }));
  }, [staffs, summaryMap]);

  const pages = Math.ceil((pagination?.total ?? 1) / (filter.limit ?? 10));

  const hasSearchFilter = Boolean(filter.query);

  const renderCell = useCallback((user: StaffRow, columnKey: string) => {
    const fullName = getFullName({
      firstName: user?.firstName,
      middleName: user?.middleName,
      lastName: user?.lastName,
    });

    switch (columnKey) {
      case "name":
        return (
          <div className="cursor-pointer">
            <User
              avatarProps={{
                radius: "full",
                size: "sm",
                src: user.avatar,
                classNames: {
                  base: "flex-shrink-0",
                },
              }}
              classNames={{
                description: "text-default-500",
              }}
              description={user?.email || ""}
              name={fullName || ""}
            />
          </div>
        );
      case "totalWorklogHours": {
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {user?.totalWorklogHours?.toFixed(2)} hrs
            </p>
          </div>
        );
      }
      default:
        return null;
    }
  }, []);

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
    [],
  );

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
              items={roleOptions}
              label="Roles"
              size="sm"
              placeholder="Select Roles"
              selectionMode="multiple"
              selectedKeys={roleFilter}
              labelPlacement="outside"
              onSelectionChange={
                setRoleFilter as (keys: SharedSelection) => void
              }
              className="w-40"
              classNames={{
                trigger: "cursor-pointer",
              }}
            >
              {roleOptions.map((role) => (
                <SelectItem key={role.value}>{role.name}</SelectItem>
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

                  if (roleFilter !== "all") {
                    newFilter.roles = Array.from(roleFilter);
                  } else {
                    delete newFilter.roles;
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
        </div>
      </div>
    );
  }, [filterValue, roleFilter, pagination?.total]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-end items-center gap-2">
        <label className="flex items-center text-default-400 text-small">
          Rows per page:
          <select
            className="bg-transparent outline-solid outline-transparent text-default-400 text-small"
            onChange={onRowsPerPageChange}
            value={filter.limit ?? 10}
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
  }, [onRowsPerPageChange, filter.limit, filter.page, hasSearchFilter, pages]);

  return (
    <div className="container mx-auto pt-4">
      <div className="bg-content1 shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Staffs' Worklogs</h1>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              isIconOnly
              color="default"
              variant="light"
              isDisabled={
                from.getTime() <=
                startOfWeek(minFrom, { weekStartsOn }).getTime()
              }
              disabled={
                from.getTime() <=
                startOfWeek(minFrom, { weekStartsOn }).getTime()
              }
              onPress={() => setFrom(subWeeks(from, 2))}
            >
              <ChevronLeft size={16} />
            </Button>
            <span className="text-sm md:text-base whitespace-nowrap">
              {format(from, "dd MMM yyyy")} - {format(to, "dd MMM yyyy")}
            </span>
            <Button
              size="sm"
              isIconOnly
              color="default"
              variant="light"
              isDisabled={from.getTime() >= maxFrom.getTime()}
              disabled={from.getTime() >= maxFrom.getTime()}
              onPress={() => setFrom(addWeeks(from, 2))}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
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
          sortDescriptor={{
            column: filter.sort ?? "joinedAt",
            direction: filter.order === "asc" ? "ascending" : "descending",
          }}
          topContent={topContent}
          topContentPlacement="outside"
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
            emptyContent={"No worklogs found"}
            items={staffList}
          >
            {(item) => (
              <TableRow
                key={(item as StaffRow).id ?? (item as StaffRow)._id}
                onClick={() =>
                  navigate(
                    `/staffs/${(item as StaffRow).id ?? (item as StaffRow)._id}?tab=worklogs&from=worklogs`,
                  )
                }
                className="cursor-pointer"
              >
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

export default Worklogs;
