import { Outlet } from "react-router-dom";

import "@/assets/Client/css/style.css";

import { Header, Footer, BoxContact } from "../shared";

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
