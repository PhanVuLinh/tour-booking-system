import { Outlet } from "react-router-dom";

import "@/assets/Client/css/style.css";
import "@/assets/Client/css/phase1.css";

import { Header, Footer, BoxContact } from "../shared";

function MainLayout() {
  return (
    <>
      <div className="client-layout">
        <Header />

        <main>
          <Outlet />
        </main>

        <Footer />

        <BoxContact />
      </div>
    </>
  );
}

export default MainLayout;
