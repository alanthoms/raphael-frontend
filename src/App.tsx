import { Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import Dashboard from "./pages/dashboard.tsx";
import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { dataProvider } from "./providers/data";
import { Home, Plane, Target } from "lucide-react";
import { Layout } from "./components/refine-ui/layout/layout.tsx";
import ACPsList from "./pages/acps/list.tsx";
import ACPsCreate from "./pages/acps/create.tsx";
import MissionsList from "./pages/missions/list.tsx";
import MissionsCreate from "./pages/missions/create.tsx";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "qnsBO2-BQrujH-yNaLoL",
              }}
              resources={[
                {
                  name: "dashboard",
                  list: "/",
                  meta: { label: "Home", icon: <Home /> },
                },
                {
                  name: "acps",
                  list: "/acps",
                  create: "/acps/create",
                  meta: { label: "ACPs", icon: <Plane /> },
                },
                {
                  name: "missions",
                  list: "/missions",
                  create: "/missions/create",
                  meta: { label: "Missions", icon: <Target /> },
                },
              ]}
            >
              <Routes>
                <Route
                  element={
                    <Layout>
                      <Outlet />
                    </Layout>
                  }
                >
                  <Route path="/" element={<Dashboard />} />
                  <Route path="acps">
                    <Route index element={<ACPsList />} />
                    <Route path="create" element={<ACPsCreate />} />
                  </Route>
                  <Route path="missions">
                    <Route index element={<MissionsList />} />
                    <Route path="create" element={<MissionsCreate />} />
                  </Route>
                </Route>
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
