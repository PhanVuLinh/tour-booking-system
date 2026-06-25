import AllRoutes from "./routes";
// import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster position="top-center" richColors closeButton />
      {/* <ScrollToTop /> */}
      <AllRoutes />
    </>
  );
}

export default App;
