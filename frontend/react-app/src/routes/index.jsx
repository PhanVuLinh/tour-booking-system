import { useRoutes } from "react-router-dom";

import { clientRoutes } from "../client/routes/routes";
import { adminRoutes } from "../admin/routes/routes";

function AllRoutes() {
  const elements = useRoutes([...clientRoutes, ...adminRoutes]);

  return elements;
}

export default AllRoutes;
