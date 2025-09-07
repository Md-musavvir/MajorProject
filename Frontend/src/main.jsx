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
import BookAdminDashboard from "./components/BookAdminDashboard.jsx";
import BookDetails from "./components/BookDetails.jsx"; // ← Import BookDetails
import Cart from "./components/Cart.jsx";
import Checkout from "./components/Checkout.jsx";
import Fantasy from "./components/Fantasy.jsx";
import Fiction from "./components/Fiction.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import NonFiction from "./components/NonFiction.jsx";
import Orders from "./components/Orders.jsx";
import Profile from "./components/Profile.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Science from "./components/Science.jsx";
import Signup from "./components/Signup.jsx";
import { store } from "./Store/store";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Routes with Navbar/Footer */}
      <Route path="/" element={<App />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="fiction"
          element={
            <ProtectedRoute>
              <Fiction />
            </ProtectedRoute>
          }
        />
        <Route
          path="non-fiction"
          element={
            <ProtectedRoute>
              <NonFiction />
            </ProtectedRoute>
          }
        />
        <Route
          path="science"
          element={
            <ProtectedRoute>
              <Science />
            </ProtectedRoute>
          }
        />
        <Route
          path="fantasy"
          element={
            <ProtectedRoute>
              <Fantasy />
            </ProtectedRoute>
          }
        />
        <Route
          path="cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        {/* BookDetails route */}
        <Route
          path="book/:id"
          element={
            <ProtectedRoute>
              <BookDetails />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>

      {/* Admin dashboard */}
      <Route
        path="admin-dashboard"
        element={
          <ProtectedRoute role="admin">
            <BookAdminDashboard />
          </ProtectedRoute>
        }
      />
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
