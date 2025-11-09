import { useCallback, useMemo, useState } from "react";
import { format } from "date-fns";
import {
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
} from "@heroui/react";
import { useGetWorklogs, type WorklogSegment } from "@/states/apis/worklogs";
import { TIME_RULES_DATA, timeRules } from "@/constants/timeRules";

import type { FC } from "react";
import { EMPTY_ARRAY } from "@/constants/empty";

export type WorkLogTableProps = {
  staffId: string;
  from: Date;
  to: Date;
};

const columns = [
  {
    name: "Shift",
    uid: "shift",
    width: 140,
    className: "min-w-[140px]",
  },
  {
    name: "Started At",
    uid: "startedAt",
    sortable: true,
    width: 240,
    className: "min-w-[240px]",
  },
  {
    name: "Ended At",
    uid: "endedAt",
    sortable: true,
    width: 240,
    className: "min-w-[240px]",
  },
  {
    name: "Duration",
    uid: "hours",
    sortable: true,
    width: 100,
    className: "min-w-[100px]",
  },
  {
    name: "Rule",
    uid: "rule",
    width: 140,
    className: "min-w-[140px]",
  },
];

const WorkLogTable: FC<WorkLogTableProps> = ({ staffId, from, to }) => {
  const [filter, setFilter] = useState({
    rules: [] as string[],
    sort: "startedAt",
    order: "desc",
    page: 1,
    limit: 10,
  });

  const { data: worklogs = EMPTY_ARRAY, isLoading } = useGetWorklogs({
    staffId,
    from: from.getTime(),
    to: to.getTime(),
  });

  const renderCell = useCallback(
    (worklog: WorklogSegment, columnKey: string) => {
      const cellValue = worklog[columnKey as keyof WorklogSegment];

      switch (columnKey) {
        case "rule":
          return TIME_RULES_DATA[worklog.rule].name;
        case "startedAt":
          return format(worklog.startedAt, "dd-MM-yyyy HH:mm");
        case "endedAt":
          return format(worklog.endedAt, "dd-MM-yyyy HH:mm");
        case "hours":
          return `${worklog.hours} hrs`;
        case "shift":
          return worklog.shift;
        default:
          return cellValue as React.ReactNode;
      }
    },
    []
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

  const filteredWorklogs = useMemo(() => {
    return worklogs.filter((worklog) => {
      if (filter.rules.length === 0) return true;
      return filter.rules.includes(worklog.rule);
    });
  }, [worklogs, filter.rules]);

  const sortedWorklogs = useMemo(() => {
    const column = filter.sort as keyof WorklogSegment;
    const direction = filter.order === "asc" ? 1 : -1;
    const sorted = [...filteredWorklogs].sort((a, b) => {
      return (Number(a[column]) - Number(b[column])) * direction;
    });
    return sorted;
  }, [filteredWorklogs, filter.sort, filter.order]);

  const paginatedWorklogs = useMemo(() => {
    return sortedWorklogs.slice(
      (filter.page - 1) * filter.limit,
      filter.page * filter.limit
    );
  }, [sortedWorklogs, filter.page, filter.limit]);

  const topContent = useMemo(() => {
    return (
      <div className="">
        
        {/* <div className="h-2"></div> */}
        <div className="flex justify-between gap-2 items-start">
        <h3 className="text-lg font-bold">Work Logs</h3>
          <div className="flex items-end gap-2">
            <Select
              label="Select Time Rules"
              size="sm"
              placeholder="Select rules"
              selectionMode="multiple"
              selectedKeys={filter.rules}
              labelPlacement="outside"
              onSelectionChange={(values) =>
                setFilter((oldFilter) => {
                  const newRules = Array.from(values) as string[];
                  return { ...oldFilter, rules: newRules, page: 1 };
                })
              }
              className="w-40"
              classNames={{ trigger: "cursor-pointer" }}
            >
              {timeRules.map((rule) => (
                <SelectItem key={rule._id}>{rule.name}</SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </div>
    );
  }, [filter.rules]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex flex-wrap justify-between items-center gap-2">
        <span className="text-default-400 text-small">
          Showing {filter.page * filter.limit - filter.limit + 1} to{" "}
          {Math.min(filter.page * filter.limit, worklogs?.length ?? 0)} of{" "}
          {worklogs?.length ?? 0} items
        </span>
        <div className="flex items-center gap-2">
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
            page={filter.page ?? 1}
            total={Math.ceil((worklogs?.length ?? 0) / (filter.limit ?? 10))}
            variant="light"
            onChange={(page) =>
              setFilter((oldFilter) => ({ ...oldFilter, page }))
            }
          />
        </div>
      </div>
    );
  }, [onRowsPerPageChange, filter.limit, filter.page, worklogs?.length]);

  return (
    <Table
      isCompact
      removeWrapper
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      checkboxesProps={{
        classNames: {
          wrapper: "after:bg-foreground after:text-background text-background p-0",
        },
      }}
      classNames={{
        wrapper: "max-h-[552px] overflow-x-auto shadow-none thin-scrollbar",
        th: "bg-transparent text-default-500 border-b border-divider",
        td: [
          "py-2.5",
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
        column: filter.sort ?? "startedAt",
        direction: filter.order === "asc" ? "ascending" : "descending",
      }}
      topContent={topContent}
      topContentPlacement="outside"
      onSortChange={(sortDescriptor) => {
        setFilter((oldFilter) => {
          return {
            ...oldFilter,
            sort: sortDescriptor.column as string,
            order: sortDescriptor.direction === "ascending" ? "asc" : "desc",
          };
        });
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
        emptyContent={"No work logged yet"}
        items={paginatedWorklogs}
      >
        {(item) => (
          <TableRow key={item._id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey as string)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default WorkLogTable;
