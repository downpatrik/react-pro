import { Navigate, createBrowserRouter } from "react-router-dom";
import { App } from "./App";
import { TasksPage } from "pages/tasks";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/tasks" replace /> },
      { path: "tasks", element: <TasksPage /> },
      { path: "*", element: <Navigate to="/tasks" replace /> },
    ],
  },
]);
