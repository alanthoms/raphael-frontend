import React, { useMemo } from "react";
import { useList, useGetIdentity } from "@refinedev/core";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  Target,
  Plane,
  Users,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mission, Acp, User } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_COLORS = {
  planning: "#94a3b8",
  active: "#0ea5e9",
  completed: "#22c55e",
  cancelled: "#ef4444",
};

const Dashboard = () => {
  const { data: user } = useGetIdentity<{
    id: string;
    role: "commander" | "operator";
  }>();

  // Fetch data
  const { query: missionsQuery } = useList<Mission>({ resource: "missions" });
  const { query: acpsQuery } = useList<Acp>({ resource: "acps" });
  const { query: usersQuery } = useList<User>({ resource: "users" });

  const missions = missionsQuery.data?.data ?? [];
  const acps = acpsQuery.data?.data ?? [];
  const users = usersQuery.data?.data ?? [];

  // Filter missions based on user role
  const userMissions = useMemo(() => {
    if (user?.role === "operator") {
      return missions.filter((m) => m.operator?.id === user.id);
    }
    if (user?.role === "commander") {
      return missions.filter((m) => m.commander?.id === user.id);
    }
    return missions;
  }, [missions, user]);

  // Mission status distribution
  const missionsByStatus = useMemo(() => {
    const counts = userMissions.reduce((acc: any, m) => {
      acc[m.status] = (acc[m.status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: STATUS_COLORS[name as keyof typeof STATUS_COLORS],
    }));
  }, [userMissions]);

  // Missions by commander
  const missionsByCommander = useMemo(() => {
    const commanderStats = missions.reduce((acc: any, m) => {
      const commanderName = m.commander?.name || "Unassigned";
      if (!acc[commanderName]) {
        acc[commanderName] = { active: 0, completed: 0, total: 0 };
      }
      acc[commanderName].total += 1;
      if (m.status === "active") acc[commanderName].active += 1;
      if (m.status === "completed") acc[commanderName].completed += 1;
      return acc;
    }, {});

    return Object.entries(commanderStats)
      .map(([name, stats]: [string, any]) => ({
        name,
        active: stats.active,
        completed: stats.completed,
        total: stats.total,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [missions]);

  // Operator workload
  const operatorWorkload = useMemo(() => {
    const operators = users.filter((u) => u.role === "operator");
    return operators
      .map((op) => ({
        name: op.name,
        assigned: missions.filter((m) => m.operator?.id === op.id).length,
        active: missions.filter(
          (m) => m.operator?.id === op.id && m.status === "active",
        ).length,
      }))
      .sort((a, b) => b.assigned - a.assigned)
      .slice(0, 6);
  }, [missions, users]);

  // Calculate metrics
  const activeCount = userMissions.filter((m) => m.status === "active").length;
  const completedCount = userMissions.filter(
    (m) => m.status === "completed",
  ).length;
  const completionRate =
    userMissions.length > 0
      ? Math.round((completedCount / userMissions.length) * 100)
      : 0;
  const unassignedCount = missions.filter((m) => !m.operator).length;

  // KPI Cards
  const kpis = [
    {
      label: user?.role === "operator" ? "My Missions" : "Total Missions",
      value: userMissions.length,
      change: `${activeCount} active`,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "up",
    },
    {
      label: "Active ACPs",
      value: acps.length,
      change: `${acps.length} deployed`,
      icon: Plane,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      trend: "up",
    },
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      change: `${completedCount} completed`,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      trend: completionRate > 75 ? "up" : "neutral",
    },
    {
      label: "Needs Attention",
      value: unassignedCount,
      change: "Unassigned missions",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      trend: unassignedCount > 0 ? "down" : "neutral",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back{user?.role === "commander" ? ", Commander" : ""}
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your missions today
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
              <div className={cn("p-2 rounded-lg", kpi.bgColor)}>
                <kpi.icon className={cn("h-4 w-4", kpi.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                {kpi.trend === "up" && (
                  <TrendingUp className="h-3 w-3 text-emerald-600" />
                )}
                {kpi.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Mission Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Mission Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {missionsByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={missionsByStatus}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {missionsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No mission data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Missions by Commander */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Commanders
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {missionsByCommander.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={missionsByCommander}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="active" fill="#0ea5e9" name="Active" />
                  <Bar dataKey="completed" fill="#22c55e" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No commander data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Secondary Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Operator Workload */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Operator Workload
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {operatorWorkload.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={operatorWorkload} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="assigned"
                    fill="#94a3b8"
                    name="Total Assigned"
                  />
                  <Bar dataKey="active" fill="#0ea5e9" name="Active" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No operator data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userMissions.slice(0, 5).map((mission) => (
                <div
                  key={mission.id}
                  className="flex items-start justify-between border-l-2 pl-3 py-1"
                  style={{
                    borderColor:
                      STATUS_COLORS[
                        mission.status as keyof typeof STATUS_COLORS
                      ],
                  }}
                >
                  <div className="space-y-1 flex-1">
                    <p className="font-medium text-sm leading-none">
                      {mission.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {mission.commander?.name || "No commander"}
                    </p>
                    {mission.operator && (
                      <p className="text-xs text-muted-foreground">
                        Operator: {mission.operator.name}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={
                      mission.status === "active" ? "default" : "secondary"
                    }
                    className="ml-2"
                  >
                    {mission.status}
                  </Badge>
                </div>
              ))}
              {userMissions.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8">
                  No missions found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
