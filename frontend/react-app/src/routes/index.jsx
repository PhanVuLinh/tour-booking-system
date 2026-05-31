import { useRoutes } from "react-router-dom";

import { clientRoutes } from "./client/routes";
import { adminRoutes } from "./admin/routes";

function AllRoutes() {
  const elements = useRoutes([...clientRoutes, ...adminRoutes]);

  return elements;
}

export default AllRoutes;
