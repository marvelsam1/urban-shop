import React, { useState } from "react";
import { useCart } from "../CartContext";
import { useAuth } from "../AuthContext";
import { supabase } from "../supabaseClient";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { ShieldCheck, CheckCircle, CreditCard, Lock } from "lucide-react";

const Checkout = () => {
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    city: "",
    zipCode: "",
    country: "United States",
  });

  // Redirect to cart if it's empty and they haven't just placed an order
  if (cartItems.length === 0 && !orderSuccess) {
    return <Navigate to="/cart" />;
  }

  const handleInputChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const addressStr = `${shipping.fullName}, ${shipping.address}, ${shipping.city}, ${shipping.zipCode}, ${shipping.country}`;

    try {
      // 1. Create the Order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user.id,
            total_amount: cartTotal,
            shipping_address: addressStr,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create the Order Items (Snapshotting current prices)
      const orderItems = cartItems.map((item) => ({
        order_id: orderData.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_time: item.products.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Clear the Cart
      await clearCart();

      // 4. Show Success Screen
      setOrderSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <CheckCircle className="text-green-500 w-20 h-20 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Placed!
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you for shopping with UrbanShop. Your order has been received
            and is currently being processed.
          </p>
          <button
            onClick={() => navigate("/account")}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-xl shadow-sm transition-colors"
          >
            View Your Orders
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-xl transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8 items-start">
      {/* Left Column: Checkout Form */}
      <div className="flex-1 w-full space-y-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Checkout</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200 font-medium">
            {error}
          </div>
        )}

        <form
          id="checkout-form"
          onSubmit={handlePlaceOrder}
          className="space-y-6"
        >
          {/* Shipping Address Box */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              1. Shipping address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Full name (First and Last name)
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={shipping.fullName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={shipping.address}
                  onChange={handleInputChange}
                  placeholder="Street address, P.O. box, etc."
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={shipping.city}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  required
                  value={shipping.zipCode}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Box */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              2. Payment method
            </h2>
            <div className="p-4 border border-blue-200 bg-blue-50 rounded-xl mb-4 flex items-center text-blue-800 text-sm">
              <Lock size={18} className="mr-2" /> This is a secure, encrypted
              demo payment gateway.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Card number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    maxLength="19"
                    required
                    className="w-full border border-gray-300 p-3 pl-10 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none font-mono"
                  />
                  <CreditCard
                    size={20}
                    className="absolute left-3 top-3.5 text-gray-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Expiration date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength="5"
                  required
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Security code (CVC)
                </label>
                <input
                  type="text"
                  placeholder="123"
                  maxLength="4"
                  required
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Right Column: Order Summary Box */}
      <div className="w-full lg:w-[400px]">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Order Summary
          </h2>

          <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 border-b border-gray-50 pb-4 last:border-0"
              >
                <img
                  src={
                    item.products.image_url || "https://via.placeholder.com/50"
                  }
                  alt=""
                  className="w-16 h-16 object-cover rounded bg-gray-50 border border-gray-100"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">
                    {item.products.title}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </span>
                    <span className="font-bold text-sm text-gray-900">
                      ${(item.products.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 text-gray-600 text-sm border-t border-gray-100 pt-6 mb-6">
            <div className="flex justify-between">
              <span>Items:</span>
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

          <div className="flex justify-between items-end text-xl font-bold text-gray-900 mb-6 pt-6 border-t border-gray-100">
            <span className="text-lg">Order Total:</span>
            <span className="text-2xl text-red-600">
              ${cartTotal.toFixed(2)}
            </span>
          </div>

          <button
            type="submit"
            form="checkout-form"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-200 disabled:cursor-not-allowed text-gray-900 font-bold text-lg py-4 rounded-xl shadow-sm hover:shadow-md transition-all transform hover:scale-[1.02] mb-4"
          >
            {loading ? "Processing..." : "Place your order"}
          </button>

          <div className="flex items-start text-xs text-gray-500 font-medium mt-4">
            <ShieldCheck size={24} className="mr-2 text-green-600 shrink-0" />
            <p>
              You will not be charged until your order has shipped. Secure,
              encrypted checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
