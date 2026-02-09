import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Input } from "@/components/ui/input";
import {
  SelectContent,
  SelectItem,
  Select,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SQUADRON_OPTIONS } from "@/constants";
import { useTable } from "@refinedev/react-table";
import { Search } from "lucide-react";
import React, { useMemo, useState } from "react";
import { ACP } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

const ACPsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSquadron, setSelectedSquadron] = useState("all");
  // Determine the squadron filter based on the selected squadron, if "all" is selected, use an empty array to indicate no filtering, otherwise use the selected squadron value
  const squadronFilters =
    selectedSquadron === "all"
      ? []
      : [
          {
            field: "squadron",
            operator: "eq" as const,
            value: selectedSquadron,
          },
        ];

  const searchFilters = searchQuery
    ? [
        {
          field: "name",
          operator: "contains" as const,
          value: searchQuery,
        },
      ]
    : [];

  //use table hook from refine on top of react-table to get the table instance, tan stack packaage
  const acpTable = useTable<ACP>({
    columns: useMemo<ColumnDef<ACP>[]>( // define columns for the table, useMemo to optimize performance by memoizing the column definitions
      //memoize the column definitions to prevent unnecessary re-renders, only recompute when dependencies change
      () => [
        {
          id: "serialNumber",
          accessorKey: "serialNumber",
          size: 100,
          header: () => (
            <p className="flex items-center gap-1 font-bold ml-2">
              Serial Number
            </p>
          ),
          cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
        },
        {
          id: "name",
          accessorKey: "name",
          size: 200,
          header: () => (
            <p className="flex items-center gap-1 font-bold ml-2">Name</p>
          ),
          cell: ({ getValue }) => (
            <span className="text-foreground">{getValue<string>()}</span>
          ),
          filterFn: "includesString",
        },
        {
          id: "squadron",
          accessorKey: "squadron.name",
          size: 150,
          header: () => (
            <p className="flex items-center gap-1 font-bold ml-2">Squadron</p>
          ),
          cell: ({ getValue }) => (
            <Badge variant="secondary">{getValue<string>()}</Badge>
          ),
        },
        {
          id: "description",
          accessorKey: "description",
          size: 300,
          header: () => (
            <p className="flex items-center gap-1 font-bold ml-2">
              Description
            </p>
          ),
          cell: ({ getValue }) => (
            <span className="truncate line-clamp-2">{getValue<string>()}</span>
          ),
        },
      ],
      [],
    ),
    refineCoreProps: {
      resource: "acps",
      pagination: { pageSize: 10, mode: "server" },
      filters: {
        permanent: [...squadronFilters, ...searchFilters],
      },
      sorters: {
        initial: [{ field: "id", order: "desc" }],
      },
    },
  });
  return (
    <ListView>
      <Breadcrumb />
      <h1 className="text-3xl font-bold text-foreground tracking-tight">
        APCs
      </h1>
      <div className="flex flex-col gap-5 lg:flex-row justify-between">
        <p> Quick access to APCs and related information</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-2 w-full">
          <div className="relative w-full max-h-9 md:max-w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <Input
              type="text"
              placeholder="Search by name"
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Select
              value={selectedSquadron}
              onValueChange={setSelectedSquadron}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Squadron" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Squadrons</SelectItem>
                {SQUADRON_OPTIONS.map((squadron) => (
                  <SelectItem key={squadron.value} value={squadron.value}>
                    {squadron.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <CreateButton />
          </div>
        </div>
      </div>
      <DataTable table={acpTable} />
    </ListView>
  );
};

export default ACPsList;
