import "./index.css";

import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

const BottomBar = lazy(() => import("./components/BottomBar"));

const router = createBrowserRouter([
  {
    index: true,
    element: <Navigate to="/create" />,
  },
  {
    path: "/create",
    lazy: () =>
      import("./pages/Create").then((mod) => ({
        Component: mod.default,
      })),
  },
  {
    path: "/player/:linkid/*",
    lazy: () =>
      import("./pages/Player").then((mod) => ({
        Component: mod.default,
      })),
  },
  {
    path: "/campaign/:linkid/*",
    lazy: () =>
      import("./pages/Campaign").then((mod) => ({
        Component: mod.default,
      })),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
      <BottomBar />
    </Suspense>
  </React.StrictMode>,
);
