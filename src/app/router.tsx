import { Navigate, createBrowserRouter } from "react-router-dom";
import { App } from "./App";
import { TasksPage } from "pages/tasks";
import { RegisterPage } from "pages/register";
import { SubscribePage } from "pages/subscribe";
import { RefsPage } from "pages/refs";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/tasks" replace /> },
      { path: "tasks", element: <TasksPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "subscribe", element: <SubscribePage /> },
      { path: "refs", element: <RefsPage /> },
      { path: "*", element: <Navigate to="/tasks" replace /> },
    ],
  },
]);
