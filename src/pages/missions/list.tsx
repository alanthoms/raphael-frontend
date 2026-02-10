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
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { useCustom, useGetIdentity, useList } from "@refinedev/core";
import { BACKEND_BASE_URL } from "@/constants";

const MissionsList = () => {
  const { data: user, isLoading: identityLoading } = useGetIdentity<{
    id: string;
    role: "commander" | "operator";
  }>();

  if (identityLoading) return <div>Loading Command Data...</div>;
  if (!user) return <div>Access Denied. Please log in.</div>;

  return <MissionsListContent user={user} />;
};

const MissionsListContent = ({ user }: { user: any }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCommander, setSelectedCommander] = useState("all");

  const [commanders, setCommanders] = useState<any[]>([]);

  React.useEffect(() => {
    fetch("http://localhost:8000/api/users/commanders")
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Fetched commanders:", data.data);
        setCommanders(data.data);
      })
      .catch((err) => console.error("❌ Error:", err));
  }, []);

  const missionTable = useTable<Mission>({
    columns: useMemo<ColumnDef<Mission>[]>(
      () => [
        {
          id: "name",
          accessorKey: "name",
          header: "Name",
          cell: ({ getValue }) => (
            <span className="text-foreground">{getValue<string>()}</span>
          ),
        },
        {
          id: "status",
          accessorKey: "status",
          header: "Status",
          cell: ({ getValue }) => (
            <Badge variant="secondary">{getValue<string>()}</Badge>
          ),
        },
        {
          id: "commander",
          accessorKey: "commander.name",
          header: "Commander",
        },
        {
          id: "operator",
          header: "Assigned Operator",
          accessorKey: "operator.name",
          cell: ({ getValue }) => getValue() || "Unassigned",
        },
        {
          id: "details",
          header: "Details",
          cell: ({ row }) => (
            <ShowButton
              resource="missions"
              recordItemId={row.original.id}
              variant="outline"
              size="sm"
            >
              View
            </ShowButton>
          ),
        },
      ],
      [],
    ),
    refineCoreProps: {
      resource: "missions",
      pagination: { pageSize: 10, mode: "server" },
      queryOptions: {
        queryKey: [
          "missions",
          user?.id,
          user?.role,
          searchQuery,
          selectedCommander,
        ],
      },
      meta: {
        operatorId: user?.role === "operator" ? user.id : undefined,
        search: searchQuery || undefined,
        commander: selectedCommander !== "all" ? selectedCommander : undefined,
      },
      sorters: {
        initial: [{ field: "id", order: "desc" }],
      },
      syncWithLocation: true,
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="text-3xl font-bold text-foreground tracking-tight">
        Missions
      </h1>
      <div className="flex flex-col gap-5 lg:flex-row justify-between">
        <p>Quick access to Missions and related information</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-2 w-full">
          <div className="relative w-full max-h-9 md:max-w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <Input
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
                <SelectValue placeholder="Filter by Commander" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Commanders</SelectItem>
                {/* CHANGE THIS LINE - use commanders instead of COMMANDER_OPTIONS */}
                {commanders.map((commander: any) => (
                  <SelectItem key={commander.id} value={commander.id}>
                    {commander.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {user?.role === "commander" && <CreateButton />}
          </div>
        </div>
      </div>
      <DataTable table={missionTable} />
    </ListView>
  );
};

export default MissionsList;
