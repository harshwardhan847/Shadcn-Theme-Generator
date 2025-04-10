import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Activity,
  Settings,
  Bell,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function DashboardPreview() {
  // Dummy data for charts and tables
  const salesData = [
    { month: "Jan", desktop: 186, mobile: 80 },
    { month: "Feb", desktop: 305, mobile: 200 },
    { month: "Mar", desktop: 237, mobile: 120 },
    { month: "Apr", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "Jun", desktop: 214, mobile: 140 },
  ];

  const activityData = [
    {
      time: "10m ago",
      user: "Alex",
      action: "Updated profile",
      status: "Completed",
    },
    {
      time: "1h ago",
      user: "Jane",
      action: "Added new task",
      status: "Pending",
    },
    {
      time: "2h ago",
      user: "Sam",
      action: "Commented on post",
      status: "Completed",
    },
    {
      time: "1d ago",
      user: "Chris",
      action: "Uploaded file",
      status: "Failed",
    },
  ];

  const chartConfig = {
    desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
    mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
  };

  return (
    <div className="flex min-h-[400px] w-full bg-muted/40 rounded-md border">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background p-4 md:flex">
        <div className="mb-6 flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold">My Dashboard</h2>
        </div>
        <nav className="flex flex-col gap-1">
          <Button
            variant="ghost"
            className="justify-start gap-2 text-primary bg-primary/10"
          >
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </Button>
          <Button
            variant="ghost"
            className="justify-start gap-2 text-muted-foreground hover:text-foreground"
          >
            <Users className="h-4 w-4" />
            Customers
          </Button>
          <Button
            variant="ghost"
            className="justify-start gap-2 text-muted-foreground hover:text-foreground"
          >
            <DollarSign className="h-4 w-4" />
            Sales
          </Button>
          <Button
            variant="ghost"
            className="justify-start gap-2 text-muted-foreground hover:text-foreground"
          >
            <Activity className="h-4 w-4" />
            Activity
          </Button>
        </nav>
        <div className="mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-muted pl-8 md:w-[200px] lg:w-[300px]"
            />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Content Grid */}
        <main className="flex-1 space-y-6 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2,350</div>
                <p className="text-xs text-muted-foreground">
                  +180.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Now
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">
                  +201 since last hour
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Recent Activity */}
          <div className="grid grid-cols-1 gap-6">
            {/* Sales Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={chartConfig}
                  className="h-[250px] w-full"
                >
                  <BarChart
                    accessibilityLayer
                    data={salesData}
                    margin={{ left: 12, right: 12 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dashed" />}
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar
                      dataKey="desktop"
                      fill="var(--color-desktop)"
                      radius={4}
                    />
                    <Bar
                      dataKey="mobile"
                      fill="var(--color-mobile)"
                      radius={4}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Recent Activity Table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest actions performed by users.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityData.map((activity, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {activity.user}
                        </TableCell>
                        <TableCell>{activity.action}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {activity.time}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={
                              activity.status === "Completed"
                                ? "default"
                                : activity.status === "Pending"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {activity.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
