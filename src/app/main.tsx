import { Provider } from "react-redux";
import { store } from "./store";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "features/authRouting";
import { AppRouter } from "./AppRouter";
import "./styles/global.scss";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element #root not found");
}

createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
