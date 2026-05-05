import React from "react";
import { RouterProvider } from "react-router";
import { router } from "./AppRoutes";
import { RootLabProvider } from "./context/RootLabContext";

export default function App() {
  return (
    <RootLabProvider>
      <RouterProvider router={router} />
    </RootLabProvider>
  );
}
