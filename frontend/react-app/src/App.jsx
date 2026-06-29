import AllRoutes from "./routes";
// import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster 
        position="top-center" 
        richColors 
        closeButton 
        toastOptions={{
          style: {
            padding: '16px 20px',
            fontSize: '15px',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: 'none',
            fontWeight: '500'
          }
        }}
      />
      {/* <ScrollToTop /> */}
      <AllRoutes />
    </>
  );
}

export default App;
