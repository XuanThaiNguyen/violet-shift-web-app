import { useState, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  User,
  Pagination,
  type SharedSelection,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import { PlusIcon, Search } from "lucide-react";
import { Link } from "react-router";
import { ROLE_IDS, ROLES } from "@/constants/roles";
import { useStaffs, type StaffFilter } from "@/states/apis/staff";
import { EMPTY_ARRAY, EMPTY_STRING } from "@/constants/empty";
import { employmentTypeOptions, genderOptions } from "@/constants/userOptions";
import { format, isValid } from "date-fns";

import type { FC } from "react";
import type { User as UserType } from "@/types/user";

const columns = [
  { name: "Name", uid: "name" },
  { name: "Gender", uid: "gender" },
  { name: "Role", uid: "role" },
  { name: "Email", uid: "email", sortable: true },
  { name: "Phone", uid: "phone" },
  { name: "Birthdate", uid: "birthdate", sortable: true },
  { name: "Employment Type", uid: "employmentType" },
  { name: "Joined At", uid: "joinedAt", sortable: true },
  // { name: "actions", uid: "actions" },
];

const roleOptions = [
  { name: "Carrier", value: ROLE_IDS.CARER },
  { name: "HR", value: ROLE_IDS.HR },
  { name: "Admin", value: ROLE_IDS.ADMIN },
  { name: "Coordinator", value: ROLE_IDS.COORDINATOR },
  { name: "Office Support", value: ROLE_IDS.OFFICE_SUPPORT },
];

const genderMap = genderOptions.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {} as Record<string, string>);

const employmentTypeMap = employmentTypeOptions.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {} as Record<string, string>);

const StaffList: FC = () => {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string> | "all">(
    new Set([])
  );
  const [roleFilter, setRoleFilter] = useState<Set<string> | "all">(
    new Set([])
  );
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState<
    Set<string> | "all"
  >(new Set([]));
  const [filter, setFilter] = useState<StaffFilter>({
    query: "",
    roles: [],
    employmentTypes: [],
    page: 1,
    limit: 10,
    sort: "createdAt",
    order: "asc",
  });

  const { data: staffData, isLoading } = useStaffs(filter);
  const staffs = staffData?.data || EMPTY_ARRAY;
  const pagination = staffData?.pagination;

  const pages = Math.ceil((pagination?.total ?? 1) / (filter.limit ?? 10));

  const hasSearchFilter = Boolean(filter.query);

  const renderCell = useCallback((user: UserType, columnKey: string) => {
    const cellValue = user[columnKey as keyof UserType];
    const fullName = user.firstName
      ? `${user.firstName} ${user.middleName ? `${user.middleName} ` : ""}${
          user.lastName
        }`
      : "";

    switch (columnKey) {
      case "name":
        return (
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
            description={user.preferredName ? fullName : ""}
            name={user.preferredName || fullName || ""}
          >
            {user.preferredName || fullName || ""}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {ROLES[user.role as keyof typeof ROLES]}
            </p>
          </div>
        );
      case "gender":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {genderMap[user.gender]}
            </p>
          </div>
        );
      case "birthdate":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {isValid(new Date(user.birthdate))
                ? format(user.birthdate, "dd-MM-yyyy")
                : user.birthdate}
            </p>
          </div>
        );
      case "employmentType":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {employmentTypeMap[user.employmentType] || EMPTY_STRING}
            </p>
          </div>
        );
      case "joinedAt":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {isValid(new Date(user.joinedAt))
                ? format(user.joinedAt, "dd-MM-yyyy")
                : user.joinedAt}
            </p>
          </div>
        );
      default:
        return cellValue;
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
    []
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
              items={employmentTypeOptions}
              label="Employment Types"
              size="sm"
              placeholder="Select Type"
              selectionMode="multiple"
              selectedKeys={employmentTypeFilter}
              labelPlacement="outside"
              onSelectionChange={
                setEmploymentTypeFilter as (keys: SharedSelection) => void
              }
              className="w-40"
              classNames={{ trigger: "cursor-pointer" }}
            >
              {employmentTypeOptions.map((employmentType) => (
                <SelectItem key={employmentType.value}>
                  {employmentType.label}
                </SelectItem>
              ))}
            </Select>
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

                  if (employmentTypeFilter !== "all") {
                    newFilter.employmentTypes =
                      Array.from(employmentTypeFilter);
                  } else {
                    delete newFilter.employmentTypes;
                  }

                  if (roleFilter) {
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
    employmentTypeFilter,
    roleFilter,
    pagination?.total,
    selectedKeys,
  ]);

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

  return (
    <div className="container mx-auto">
      <div className="bg-content1 shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Staffs</h1>
          <Button
            as={Link}
            to="/staff/new"
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
          removeWrapper
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          checkboxesProps={{
            classNames: {
              wrapper:
                "after:bg-foreground after:text-background text-background",
            },
          }}
          classNames={{
            wrapper: "max-h-[382px] max-w-3xl",
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
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            isLoading={isLoading}
            loadingContent={<Spinner label="Loading..." />}
            emptyContent={"No users found"}
            items={staffs}
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

export default StaffList;
