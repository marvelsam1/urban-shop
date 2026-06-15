import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useCart } from "../CartContext";

const todaysDealsData = [
  {
    id: 1,
    title: "Premium wireless headphones and earbuds",
    discount: "Up to 35% off",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Smartwatches and fitness trackers",
    discount: "Up to 40% off",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Laptops and accessories",
    discount: "Up to 20% off",
    img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Digital cameras and lenses",
    discount: "Up to 30% off",
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Running shoes and apparel",
    discount: "Up to 50% off",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Home appliances up to 40% off",
    discount: "Up to 25% off",
    img: "https://images.unsplash.com/photo-1585515320310-259814833e62?q=80&w=400&auto=format&fit=crop",
  },
];

const Home = () => {
  const { user, isAdmin } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .limit(8);
      if (!error && data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white h-[450px] flex flex-col items-center justify-start pt-16 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl w-[70%] mx-auto md:text-6xl font-extrabold mb-4 drop-shadow-lg tracking-tight">
            Shop the Best Deals of the Season at Urban
            <span className="text-yellow-400">Shop</span>
          </h1>
          <p className="text-lg md:text-2xl mx-auto text-center mb-8 max-w-2xl drop-shadow-md font-light">
            Up to 40% off on electronics, fresh fashion, and home essentials.
          </p>
        </div>
        {/* Faded bottom edge to blend into content like Amazon */}
        <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-gray-100 to-transparent"></div>
      </div>

      <main className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-10 mb-12">
        {/* Amazon-style 4-Card Overlapping Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Gaming */}
          <div className="bg-white p-5 rounded shadow-sm flex flex-col h-[400px] cursor-pointer">
            <h3 className="text-xl font-bold mb-4">Gaming Accessories</h3>
            <div className="grid grid-cols-2 gap-4 flex-1">
              <div className="flex flex-col h-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=200&auto=format&fit=crop"
                  alt="Headsets"
                  className="flex-1 object-cover mb-1 rounded bg-gray-50"
                />
                <span className="text-xs">Headsets</span>
              </div>
              <div className="flex flex-col h-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=200&auto=format&fit=crop"
                  alt="Keyboards"
                  className="flex-1 object-cover mb-1 rounded bg-gray-50"
                />
                <span className="text-xs">Keyboards</span>
              </div>
              <div className="flex flex-col h-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1527814050087-179337eddd1a?q=80&w=200&auto=format&fit=crop"
                  alt="Mice"
                  className="flex-1 object-cover mb-1 rounded bg-gray-50"
                />
                <span className="text-xs">Mice</span>
              </div>
              <div className="flex flex-col h-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=200&auto=format&fit=crop"
                  alt="Chairs"
                  className="flex-1 object-cover mb-1 rounded bg-gray-50"
                />
                <span className="text-xs">Chairs</span>
              </div>
            </div>
            <span className="text-blue-600 hover:text-orange-600 hover:underline text-sm mt-4 inline-block">
              See more
            </span>
          </div>

          {/* Card 2: Fashion */}
          <div className="bg-white p-5 rounded shadow-sm flex flex-col h-[400px] cursor-pointer">
            <h3 className="text-xl font-bold mb-4">Refresh Your Space</h3>
            <div className="bg-gray-100 flex-1 mb-2 relative overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop"
                alt="Furniture"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-blue-600 hover:text-orange-600 hover:underline text-sm mt-2 inline-block">
              Shop Home & Kitchen
            </span>
          </div>

          {/* Card 3: Electronics */}
          <div className="bg-white p-5 rounded shadow-sm flex flex-col h-[400px] cursor-pointer">
            <h3 className="text-xl font-bold mb-4">Deals on Electronics</h3>
            <div className="bg-gray-100 flex-1 mb-2 relative overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop"
                alt="Electronics"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-blue-600 hover:text-orange-600 hover:underline text-sm mt-2 inline-block">
              Shop all deals
            </span>
          </div>

          {/* Card 4: Sign In / Personalized Ad */}
          <div className="flex flex-col h-[400px] space-y-6">
            {!user ? (
              <div className="bg-white p-5 rounded shadow-sm flex flex-col items-center justify-center text-center">
                <h3 className="text-xl font-bold mb-2">
                  Sign in for the best experience
                </h3>
                <Link
                  to="/auth"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 rounded-lg shadow-sm mb-2 text-sm border border-yellow-500"
                >
                  Sign in securely
                </Link>
              </div>
            ) : (
              <div className="bg-white p-5 rounded shadow-sm flex flex-col h-full cursor-pointer">
                <h3 className="text-xl font-bold mb-2">
                  Hi, {user.email.split("@")[0]}!
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Pick up where you left off
                </p>
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop"
                    alt="Recently viewed 1"
                    className="w-full h-full object-cover rounded"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200&auto=format&fit=crop"
                    alt="Recently viewed 2"
                    className="w-full h-full object-cover rounded"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop"
                    alt="Recently viewed 3"
                    className="w-full h-full object-cover rounded"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1585515320310-259814833e62?q=80&w=200&auto=format&fit=crop"
                    alt="Recently viewed 4"
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              </div>
            )}

            {/* Mini Ad */}
            <div className="bg-white p-4 rounded shadow-sm flex-1 cursor-pointer hover:bg-gray-50">
              <img
                src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop"
                className="w-full h-24 object-cover mb-2"
                alt="Ad"
              />
              <span className="text-xs text-gray-500 font-bold">Sponsored</span>
              <p className="text-sm font-semibold">
                Get 5% back with the UrbanShop Rewards Card
              </p>
            </div>
          </div>
        </div>

        {/* Thin Marketing Ad Strip */}
        <div className="bg-white py-3 px-6 mb-8 shadow-sm rounded flex flex-col md:flex-row items-center justify-between border border-gray-200">
          <div className="flex items-center space-x-4 mb-2 md:mb-0">
            <div className="bg-blue-600 text-white font-bold px-2 py-1 rounded text-sm">
              URBAN PRIME
            </div>
            <p className="font-semibold text-gray-800">
              Enjoy fast, free delivery on millions of items.
            </p>
          </div>
          <button className="text-blue-600 hover:underline font-semibold text-sm">
            Start your 30-day free trial
          </button>
        </div>

        {/* Flash Sales / Today's Deals Section */}
        <section className="mb-8 bg-white p-6 rounded shadow-sm">
          <h2 className="text-2xl font-bold mb-6 flex items-baseline">
            Today's Deals{" "}
            <Link
              to="/"
              className="ml-4 text-sm font-normal text-blue-600 hover:underline"
            >
              See all deals
            </Link>
          </h2>
          <div className="flex overflow-x-auto pb-4 space-x-6 hide-scrollbar">
            {todaysDealsData.map((deal) => (
              <div
                key={deal.id}
                className="flex-none w-48 cursor-pointer group"
              >
                <div className="bg-gray-100 h-48 rounded mb-2 flex items-center justify-center p-4 overflow-hidden">
                  <img
                    src={deal.img}
                    alt={deal.title}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-sm">
                    {deal.discount}
                  </span>
                  <span className="text-red-600 text-xs font-bold">
                    Deal of the Day
                  </span>
                </div>
                <p className="text-sm text-gray-800 line-clamp-2 group-hover:text-orange-600">
                  {deal.title}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="mb-8 bg-white p-6 rounded shadow-sm">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            Featured Products{" "}
            <span className="ml-4 text-sm font-normal text-blue-600 hover:underline cursor-pointer">
              Shop all
            </span>
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading amazing products...</p>
          ) : products.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">
                No products found. Add some from the Admin Panel!
              </p>
              <Link to="/admin" className="text-blue-600 hover:underline">
                Go to Admin Dashboard
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group p-4 bg-white rounded flex flex-col border border-transparent hover:border-gray-200 hover:shadow-xl transition-all"
                >
                  <div className="h-52 bg-white rounded mb-4 overflow-hidden flex items-center justify-center p-2">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="object-contain h-full w-full group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <img
                        src="https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=400&auto=format&fit=crop"
                        alt="Placeholder"
                        className="object-contain h-full w-full opacity-30 group-hover:scale-105 transition-transform"
                      />
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-orange-600 cursor-pointer mb-1">
                    {product.title}
                  </h3>

                  {/* Mock Amazon-style rating stars */}
                  <div className="flex text-yellow-400 text-xs mb-2">
                    ★★★★<span className="text-gray-300">★</span>{" "}
                    <span className="text-blue-600 hover:underline ml-1">
                      1,245
                    </span>
                  </div>

                  <div className="text-xl font-bold text-gray-900">
                    <span className="text-sm align-top">$</span>
                    {product.price.toString().split(".")[0]}
                    <span className="text-sm align-top">
                      {product.price.toFixed(2).split(".")[1]}
                    </span>
                  </div>

                  {/* Prime logo placeholder */}
                  <div className="text-xs font-bold text-blue-600 mb-2">
                    URBAN PRIME
                  </div>

                  <div className="flex-1"></div>

                  <button
                    onClick={() => addToCart(product.id)}
                    disabled={isAdmin}
                    className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-gray-900 text-sm font-semibold py-2 rounded-full flex items-center justify-center transition-colors shadow-sm border border-yellow-500"
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Amazon-style Footer */}
      <footer className="mt-auto">
        <div
          className="bg-gray-700 hover:bg-gray-600 text-white text-center py-4 cursor-pointer text-sm font-semibold transition-colors"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Back to top
        </div>
        <div className="bg-gray-800 text-white py-12">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div>
              <h4 className="font-bold mb-4 text-base">Get to Know Us</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Careers</li>
                <li>Blog</li>
                <li>About UrbanShop</li>
                <li>Investor Relations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-base">Make Money with Us</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Sell products on UrbanShop</li>
                <li>Sell on UrbanShop Business</li>
                <li>Become an Affiliate</li>
                <li>Advertise Your Products</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-base">
                UrbanShop Payment Products
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li>UrbanShop Business Card</li>
                <li>Shop with Points</li>
                <li>Reload Your Balance</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-base">Let Us Help You</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Your Account</li>
                <li>Your Orders</li>
                <li>Shipping Rates & Policies</li>
                <li>Returns & Replacements</li>
                <li>Help</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 text-center py-6 text-gray-400 text-xs flex flex-col items-center">
          <div className="text-xl font-bold tracking-tight text-white mb-4">
            Urban<span className="text-yellow-400">Shop</span>
          </div>
          <p>© 2024, UrbanShop.com, Inc. or its affiliates</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
