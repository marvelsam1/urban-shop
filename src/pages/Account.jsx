import React from "react";
import { useAuth } from "../AuthContext";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Shield,
  CreditCard,
  MapPin,
  User as UserIcon,
  LogOut,
} from "lucide-react";

const Account = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const accountOptions = [
    {
      title: "Your Orders",
      desc: "Track, return, or buy things again",
      icon: <Package size={32} className="text-gray-700" />,
      path: "/account/orders",
      hideForAdmin: true,
    },
    {
      title: "Login & security",
      desc: "Edit login, name, and mobile number",
      icon: <Shield size={32} className="text-gray-700" />,
    },
    {
      title: "Your Addresses",
      desc: "Edit addresses for orders and gifts",
      icon: <MapPin size={32} className="text-gray-700" />,
    },
    {
      title: "Payment options",
      desc: "Edit or add payment methods",
      icon: <CreditCard size={32} className="text-gray-700" />,
    },
    {
      title: "Your Profile",
      desc: "Manage your public profile",
      icon: <UserIcon size={32} className="text-gray-700" />,
    },
  ].filter((option) => !(isAdmin && option.hideForAdmin));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-end mb-6">
        <h1 className="text-3xl font-normal text-gray-900">Your Account</h1>
        <button
          onClick={handleLogout}
          className="flex items-center text-sm font-semibold text-gray-600 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} className="mr-1" /> Sign Out
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-1">
            Hello, {user?.email.split("@")[0]}
          </h2>
          <p className="text-gray-600 text-sm">Email: {user?.email}</p>
          <p className="text-gray-600 text-sm capitalize">
            Account Type: {isAdmin ? "Seller (Admin)" : "Buyer (User)"}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => navigate("/admin")}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-6 rounded-lg shadow-sm border border-yellow-500 transition-colors"
          >
            Go to Admin Dashboard
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accountOptions.map((option, idx) => (
          <div
            key={idx}
            onClick={() => (option.path ? navigate(option.path) : null)}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-start space-x-4 cursor-pointer hover:bg-gray-50 transition-colors group"
          >
            <div className="mt-1">{option.icon}</div>
            <div>
              <h3 className="text-lg font-normal text-gray-900 group-hover:underline group-hover:text-orange-600">
                {option.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{option.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Account;
