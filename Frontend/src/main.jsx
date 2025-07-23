import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./Store/store";

import App from "./App";
import AuthLayout from "./components/AuthLayout";
import Fiction from "./components/Fiction.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Home from "./components/Home.jsx";
import "./index.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Routes with Navbar and Footer */}
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="fiction" element={<Fiction />} />
        <Route path="non-fiction" element={<h1>Non-fiction Books</h1>} />
        <Route path="science" element={<h1>Science Books</h1>} />
        <Route path="fantasy" element={<h1>Fantasy Books</h1>} />
      </Route>

      {/* Routes without Navbar and Footer */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
