import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
