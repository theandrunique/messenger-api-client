import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/tokens.css";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AuthProvider from "./components/AuthProvider.tsx";
import { TooltipProvider } from "./components/Tooltip.tsx";
import { switchTheme } from "./utils/index.ts";

const queryClient = new QueryClient();

switchTheme("default");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <TooltipProvider delayDuration={0}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
        <ReactQueryDevtools
          initialIsOpen={true}
          buttonPosition="bottom-right"
        />
      </QueryClientProvider>
      <ToastContainer />
    </TooltipProvider>
  </>
);
