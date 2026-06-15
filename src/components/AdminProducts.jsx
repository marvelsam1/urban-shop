import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { PlusCircle, Trash2 } from "lucide-react";
import Modal from "./Modal";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    onConfirm: null,
    confirmText: null,
  });

  const showModal = (
    type,
    title,
    message,
    onConfirm = null,
    confirmText = null,
  ) => {
    setModalConfig({
      isOpen: true,
      type,
      title,
      message,
      onConfirm,
      confirmText,
    });
  };

  const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image_url: "",
    category: "Electronics",
    stock_quantity: "100",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setProducts(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("products").insert([
      {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        image_url: formData.image_url,
        category: formData.category,
        stock_quantity: parseInt(formData.stock_quantity, 10),
      },
    ]);

    if (!error) {
      showModal(
        "success",
        "Success!",
        "Product added successfully to inventory.",
      );
      setFormData({
        title: "",
        description: "",
        price: "",
        image_url: "",
        category: "Electronics",
        stock_quantity: "100",
      });
      fetchProducts();
    } else {
      showModal(
        "error",
        "Upload Failed",
        "Error adding product: " + error.message,
      );
    }
    setLoading(false);
  };

  const handleDelete = (id) => {
    showModal(
      "confirm",
      "Delete Product",
      "Are you sure you want to permanently delete this product? This action cannot be undone.",
      async () => {
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (!error) fetchProducts();
        closeModal();
      },
      "Yes, Delete",
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Products</h1>

      {/* Add Product Form */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 mb-10">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <PlusCircle className="mr-2 text-blue-600" /> Add New Product
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">
              Product Title
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
              placeholder="e.g. Sony Noise Cancelling Headphones"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">
              Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              name="price"
              required
              value={formData.price}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
              placeholder="299.99"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none bg-white"
            >
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Gaming">Gaming</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">
              Image URL
            </label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
              placeholder="https://images.unsplash.com/..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Provide a public URL to an image (Unsplash works great).
            </p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
              placeholder="Product features and details..."
            ></textarea>
          </div>
          <div className="md:col-span-2 flex justify-end mt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg shadow-sm transition-colors"
            >
              {loading ? "Adding..." : "Upload Product"}
            </button>
          </div>
        </form>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold">
            Current Inventory ({products.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 flex items-center space-x-4">
                    <img
                      src={
                        product.image_url || "https://via.placeholder.com/50"
                      }
                      alt=""
                      className="w-12 h-12 rounded object-cover border border-gray-200"
                    />
                    <span className="font-medium text-gray-900 line-clamp-1">
                      {product.title}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {product.category}
                  </td>
                  <td className="p-4 font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal {...modalConfig} onClose={closeModal} />
    </div>
  );
};
export default AdminProducts;
