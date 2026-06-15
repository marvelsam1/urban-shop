import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../AuthContext";
import { Link } from "react-router-dom";
import { Package, ArrowLeft, XCircle } from "lucide-react";
import Modal from "../components/Modal";

const UserOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: null,
    confirmText: null,
  });

  const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    // Join orders -> order_items -> products
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          *,
          products (*)
        )
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) setOrders(data);
    setLoading(false);
  };

  const handleCancelOrder = (orderId) => {
    setModalConfig({
      isOpen: true,
      type: "confirm",
      title: "Cancel Order",
      message:
        "Are you sure you want to cancel this order? This action cannot be undone.",
      confirmText: "Yes, Cancel Order",
      onConfirm: async () => {
        closeModal();
        const { error } = await supabase
          .from("orders")
          .update({ status: "cancelled" })
          .eq("id", orderId)
          .eq("user_id", user.id); // Ensure they only cancel their own order

        if (!error) {
          setOrders((prev) =>
            prev.map((order) =>
              order.id === orderId ? { ...order, status: "cancelled" } : order,
            ),
          );
          setTimeout(() => {
            setModalConfig({
              isOpen: true,
              type: "success",
              title: "Order Cancelled",
              message: "Your order has been successfully cancelled.",
            });
          }, 300);
        } else {
          setTimeout(() => {
            setModalConfig({
              isOpen: true,
              type: "error",
              title: "Error",
              message: "Failed to cancel order: " + error.message,
            });
          }, 300);
        }
      },
    });
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mb-4"></div>
        <p className="text-lg font-medium">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          to="/account"
          className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-orange-600 mb-4 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Account
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Package className="mr-3 text-gray-700" size={32} /> Your Orders
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            You haven't placed any orders yet.
          </h2>
          <p className="text-gray-500 mb-6">
            Discover amazing products and place your first order!
          </p>
          <Link
            to="/"
            className="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-xl transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="bg-gray-50 border-b border-gray-200 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-wrap gap-6 text-sm">
                  <div>
                    <p className="text-gray-500 font-medium mb-1">
                      ORDER PLACED
                    </p>
                    <p className="font-semibold text-gray-900">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium mb-1">TOTAL</p>
                    <p className="font-semibold text-gray-900">
                      ${order.total_amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium mb-1">ORDER #</p>
                    <p className="font-semibold text-gray-900 uppercase">
                      {order.id.split("-")[0]}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize ${statusColors[order.status]}`}
                  >
                    {order.status}
                  </span>
                  {(order.status === "pending" ||
                    order.status === "processing") && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="flex items-center text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                    >
                      <XCircle size={16} className="mr-1" /> Cancel Order
                    </button>
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                <h3 className="font-bold text-gray-900 mb-2">
                  Ship To:{" "}
                  <span className="font-normal text-gray-600">
                    {order.shipping_address}
                  </span>
                </h3>
                {order.order_items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center p-2 flex-shrink-0 border border-gray-100">
                      <img
                        src={
                          item.products?.image_url ||
                          "https://via.placeholder.com/100"
                        }
                        alt=""
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900 hover:text-blue-600 cursor-pointer line-clamp-2">
                        {item.products?.title || "Product unavailable"}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-bold text-gray-900 mt-1">
                        ${item.price_at_time.toFixed(2)}{" "}
                        <span className="text-xs font-normal text-gray-500">
                          each
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal {...modalConfig} onClose={closeModal} />
    </div>
  );
};

export default UserOrders;
