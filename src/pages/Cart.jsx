import React from "react";
import { useCart } from "../CartContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Check,
} from "lucide-react";

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    cartCount,
    cartTotal,
    loading,
  } = useCart();
  const navigate = useNavigate();

  if (loading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mb-4"></div>
        <p className="text-lg font-medium">Loading your cart...</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8 items-start">
      {/* Left Column: Cart Items */}
      <div className="flex-1 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 w-full">
        <h1 className="text-3xl font-extrabold text-gray-900 border-b border-gray-100 pb-6 mb-6">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="py-16 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-300">
              <ShoppingBag size={48} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your UrbanShop Cart is empty.
            </h2>
            <p className="text-gray-500 mb-8 max-w-md">
              Looks like you haven't added anything to your cart yet. Discover
              amazing products on our home page.
            </p>
            <Link
              to="/"
              className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-6 py-6 border-b border-gray-100 last:border-0"
              >
                {/* Product Image */}
                <div className="w-full sm:w-36 h-36 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center p-3 relative overflow-hidden group">
                  {item.products.image_url ? (
                    <img
                      src={item.products.image_url}
                      alt={item.products.title}
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs font-medium">
                      No Image
                    </span>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors pr-4">
                        {item.products.title}
                      </h3>
                      <div className="text-xl font-bold text-gray-900 whitespace-nowrap">
                        ${item.products.price.toFixed(2)}
                      </div>
                    </div>
                    <p className="text-sm text-green-600 mt-2 flex items-center font-medium">
                      <Check size={16} className="mr-1" /> In Stock
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Eligible for FREE Shipping & Returns
                    </p>
                  </div>

                  {/* Actions (Quantity & Delete) */}
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center bg-gray-100 rounded-full p-1 border border-gray-200 shadow-inner">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-1.5 hover:bg-white rounded-full transition-all text-gray-600 hover:text-gray-900 hover:shadow-sm"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-semibold text-sm text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-1.5 hover:bg-white rounded-full transition-all text-gray-600 hover:text-gray-900 hover:shadow-sm"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="flex items-center text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-full transition-colors"
                    >
                      <Trash2 size={16} className="mr-1.5" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Checkout Box */}
      {cartItems.length > 0 && (
        <div className="w-full lg:w-[380px]">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 text-gray-600 text-sm mb-6 border-b border-gray-100 pb-6">
              <div className="flex justify-between">
                <span>Items ({cartCount}):</span>
                <span className="font-medium text-gray-900">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping & handling:</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated tax:</span>
                <span className="font-medium text-gray-900">$0.00</span>
              </div>
            </div>

            <div className="flex justify-between items-end text-xl font-bold text-gray-900 mb-6">
              <span>Order Total:</span>
              <span className="text-2xl">${cartTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-lg py-4 rounded-xl shadow-sm hover:shadow-md transition-all transform hover:scale-[1.02] mb-6"
            >
              Proceed to Checkout
            </button>

            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center text-sm text-gray-500 font-medium">
                <ShieldCheck size={18} className="mr-2 text-green-600" /> Secure
                checkout
              </div>
              <div className="flex items-center text-sm text-gray-500 font-medium">
                <Truck size={18} className="mr-2 text-blue-600" /> Ships from
                UrbanShop
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
