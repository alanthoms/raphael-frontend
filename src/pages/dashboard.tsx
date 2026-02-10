import React, { useMemo } from "react";
import { useList } from "@refinedev/core";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Target, Plane, Users, ShieldAlert, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mission, Acp, User } from "@/types";

const COLORS = ["#0ea5e9", "#f97316", "#22c55e", "#ef4444"];

const Dashboard = () => {
  //Fetch data
  const { query: missionsQuery } = useList<Mission>({ resource: "missions" });
  const { query: acpsQuery } = useList<Acp>({ resource: "acps" });
  const { query: usersQuery } = useList<User>({ resource: "users" });

  const missions = missionsQuery.data?.data ?? [];
  const acps = acpsQuery.data?.data ?? [];
  const users = usersQuery.data?.data ?? [];

  // 2. Data Transformation (Missions by Status)
  const statsByStatus = useMemo(() => {
    const counts = missions.reduce((acc: any, m) => {
      acc[m.status] = (acc[m.status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [missions]);

  const kpis = [
    {
      label: "Total Missions",
      value: missions.length,
      icon: Target,
      color: "text-blue-600",
    },
    {
      label: "Active ACPs",
      value: acps.length,
      icon: Plane,
      color: "text-orange-600",
    },
    {
      label: "Commanders",
      value: users.filter((u) => u.role === "commander").length,
      icon: Users,
      color: "text-emerald-600",
    },
    { label: "Alerts", value: 2, icon: ShieldAlert, color: "text-red-600" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mission Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statsByStatus}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statsByStatus.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Missions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {missions.slice(0, 5).map((mission) => (
                <div
                  key={mission.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium text-sm">{mission.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {mission.commander?.name}
                    </p>
                  </div>
                  <Badge
                    variant={
                      mission.status === "active" ? "default" : "secondary"
                    }
                  >
                    {mission.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
