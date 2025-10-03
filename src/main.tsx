import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./constants/queryClient.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HeroUIProvider>
      <ToastProvider placement="top-right" />
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
    </HeroUIProvider>
  </StrictMode>
);
