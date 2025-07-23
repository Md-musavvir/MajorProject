import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      {/* Ensures Login/Signup don't shrink */}
      <div className="w-full max-w-md">
        <Outlet /> {/* Renders Login or Signup */}
      </div>
    </div>
  );
}

export default AuthLayout;
