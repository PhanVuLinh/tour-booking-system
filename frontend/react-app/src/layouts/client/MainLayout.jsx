import { Outlet } from "react-router-dom";
import "../../assets/Client/css/style.css";

import Header from "../../components/client/Header";
import Footer from "../../components/client/Footer";
import BoxContact from "../../components/client/BoxContact";

function MainLayout() {
  return (
    <>
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />

      <BoxContact />
    </>
  );
}

export default MainLayout;
