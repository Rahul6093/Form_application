import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Login from "./components/Login";
import App from "./App";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function Main() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  console.log("Current User:", user);
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login setUser={setUser} />,
    },
    {
      path: "/app",
      element: (
        <ProtectedRoute user={user}>
          <App user={user} />
        </ProtectedRoute>
      ),
    },
    {
      path: "*",
      element: <Navigate to="/" />,
    },
  ]);

  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
