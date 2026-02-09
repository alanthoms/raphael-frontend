import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Input } from "@/components/ui/input";

import { useTable } from "@refinedev/react-table";
import { Search } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Mission } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import {
  SelectContent,
  SelectItem,
  Select,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COMMANDER_OPTIONS } from "@/constants";

const MissionsList = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCommander, setSelectedCommander] = useState("all");

  const commanderFilters =
    selectedCommander === "all"
      ? []
      : [
          {
            field: "commander",
            operator: "eq" as const,
            value: selectedCommander,
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
  const missionTable = useTable<Mission>({
    columns: useMemo<ColumnDef<Mission>[]>( // define columns for the table, useMemo to optimize performance by memoizing the column definitions
      //memoize the column definitions to prevent unnecessary re-renders, only recompute when dependencies change
      () => [
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
          id: "status",
          accessorKey: "status",
          size: 150,
          header: () => (
            <p className="flex items-center gap-1 font-bold ml-2">Status</p>
          ),
          cell: ({ getValue }) => (
            <Badge variant="secondary">{getValue<string>()}</Badge>
          ),
        },
        {
          id: "commander",
          accessorKey: "commander.name",
          size: 300,
          header: () => (
            <p className="flex items-center gap-1 font-bold ml-2">Commander</p>
          ),
          cell: ({ getValue }) => (
            <span className="truncate line-clamp-2">{getValue<string>()}</span>
          ),
        },
      ],
      [],
    ),
    refineCoreProps: {
      resource: "missions",
      pagination: { pageSize: 10, mode: "server" },
      filters: {
        permanent: [...commanderFilters, ...searchFilters],
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
        Missions
      </h1>
      <div className="flex flex-col gap-5 lg:flex-row justify-between">
        <p> Quick access to Missions and related information</p>
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
              value={selectedCommander}
              onValueChange={setSelectedCommander}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Squadron" />
              </SelectTrigger>
            </Select>
            <CreateButton />
          </div>
        </div>
      </div>
      <DataTable table={missionTable} />
    </ListView>
  );
};

export default MissionsList;
