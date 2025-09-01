import "./index.css";

import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import App from "./App";
import AuthLayout from "./components/AuthLayout";
import Fantasy from "./components/Fantasy.jsx";
import Fiction from "./components/Fiction.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import NonFiction from "./components/NonFiction.jsx";
import Science from "./components/Science.jsx";
import Signup from "./components/Signup.jsx";
import { store } from "./Store/store";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Routes with Navbar and Footer */}
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="fiction" element={<Fiction />} />
        <Route path="non-fiction" element={<NonFiction />} />
        <Route path="science" element={<Science />} />
        <Route path="fantasy" element={<Fantasy />} />
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
