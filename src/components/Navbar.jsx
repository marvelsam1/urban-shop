import React from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, User, MapPin } from "lucide-react";
import { useAuth } from "../AuthContext";
import { useCart } from "../CartContext";
import { supabase } from "../supabaseClient";

const Navbar = () => {
  const { user, isAdmin } = useAuth();
  const { cartCount } = useCart();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-gray-900 text-white">
      {/* Top Nav */}
      <div className="flex items-center justify-between px-4 py-2 space-x-4">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-white rounded"
        >
          Urban<span className="text-yellow-400">Shop</span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 items-center bg-white rounded-md overflow-hidden h-10 mx-4">
          <select className="bg-gray-100 text-gray-700 h-full px-2 border-r outline-none text-sm cursor-pointer hover:bg-gray-200">
            <option>All</option>
          </select>
          <input
            type="text"
            placeholder="Search Urban Shop"
            className="flex-1 h-full px-3 text-black outline-none"
          />
          <button className="bg-yellow-400 hover:bg-yellow-500 h-full px-4 text-gray-900 transition-colors">
            <Search size={20} />
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-6 text-sm">
          <Link to="/account" className=" rounded flex flex-col justify-center">
            <span className="text-xs text-gray-300">
              Hello, {user ? user.email.split("@")[0] : "sign in"}
            </span>
            <span className="font-bold whitespace-nowrap">Account & Lists</span>
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="font-bold text-yellow-400 hover:underline hidden md:block"
            >
              Admin Panel
            </Link>
          )}

          {!isAdmin && (
            <Link to="/cart" className="flex items-end rounded relative">
              <ShoppingCart size={32} />
              <span className="absolute top-0 right-10 bg-yellow-400 text-gray-900 rounded-full h-5 w-5 flex items-center justify-center font-bold text-xs">
                {cartCount}
              </span>
              <span className="font-bold hidden md:inline ml-1">Cart</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
