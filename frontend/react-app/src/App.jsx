import AllRoutes from "./routes";
// import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "sonner";
import { AlertCircle, CheckCircle2, Info, Loader2, XCircle } from "lucide-react";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {isAdminRoute ? (
        <Toaster
          position="top-center"
          richColors
          closeButton
          toastOptions={{
            style: {
              padding: "16px 20px",
              fontSize: "15px",
              borderRadius: "12px",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              border: "none",
              fontWeight: "500",
            },
          }}
        />
      ) : (
        <Toaster
          className="client-toaster"
          position="top-right"
          closeButton
          duration={3200}
          visibleToasts={4}
          gap={12}
          offset={20}
          icons={{
            success: <CheckCircle2 size={20} strokeWidth={2.4} />,
            error: <XCircle size={20} strokeWidth={2.4} />,
            warning: <AlertCircle size={20} strokeWidth={2.4} />,
            info: <Info size={20} strokeWidth={2.4} />,
            loading: (
              <Loader2 size={20} strokeWidth={2.4} className="toast-spin" />
            ),
          }}
          toastOptions={{
            classNames: {
              toast: "app-toast",
              title: "app-toast-title",
              description: "app-toast-description",
              actionButton: "app-toast-action",
              cancelButton: "app-toast-cancel",
              closeButton: "app-toast-close",
            },
          }}
        />
      )}
      {/* <ScrollToTop /> */}
      <AllRoutes />
    </>
  );
}

export default App;
