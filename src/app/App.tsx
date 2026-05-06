import React from "react";
import { RouterProvider } from "react-router";
import { router } from "./AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { RootLabProvider } from "./context/RootLabContext";

export default function App() {
  return (
    <AuthProvider>
      <RootLabProvider>
        <RouterProvider router={router} />
      </RootLabProvider>
    </AuthProvider>
  );
}
