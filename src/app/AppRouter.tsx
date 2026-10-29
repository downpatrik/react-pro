import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "features/authRouting";
import { LoginPage } from "pages/login";
import { ProfilePage } from "pages/profile";
import { PublicPage } from "pages/public";
import { TasksPage } from "pages/tasks";
import { RegisterPage } from "pages/register";
import { SubscribePage } from "pages/subscribe";
import { RefsPage } from "pages/refs";
import { App } from "./App";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Navigate to="/tasks" replace />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="subscribe" element={<SubscribePage />} />
        <Route path="refs" element={<RefsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="public" element={<PublicPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/tasks" replace />} />
      </Route>
    </Routes>
  );
}
