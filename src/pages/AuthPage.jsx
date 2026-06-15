import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { MailCheck } from "lucide-react";

const AuthPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  // Redirect if already logged in
  if (user) return <Navigate to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role },
          },
        });
        if (error) throw error;
        setEmailSent(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex flex-col items-center pt-20 bg-gray-50">
        <div className="text-3xl font-bold tracking-tight mb-8">
          Urban<span className="text-yellow-500">Shop</span>
        </div>
        <div className="bg-white p-10 border border-gray-200 rounded-lg w-full max-w-md shadow-lg text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <MailCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Check your email
          </h2>
          <p className="text-gray-600 mb-8">
            We've sent a verification link to{" "}
            <span className="font-semibold text-gray-900">{email}</span>. Please
            click the link to confirm your account.
          </p>
          <button
            onClick={() => {
              setEmailSent(false);
              setIsLogin(true);
            }}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2.5 rounded-lg shadow-sm border border-yellow-500 transition-colors"
          >
            Return to Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center pt-10 bg-gray-50">
      <div className="text-3xl font-bold tracking-tight mb-6">
        Urban<span className="text-yellow-500">Shop</span>
      </div>
      <div className="bg-white p-8 border border-gray-300 rounded-lg w-full max-w-sm shadow-sm">
        <h2 className="text-2xl font-normal mb-4">
          {isLogin ? "Sign in" : "Create account"}
        </h2>
        {error && (
          <div className="bg-red-50 text-red-600 p-2 mb-4 text-sm border border-red-200 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent shadow-inner"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent shadow-inner"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-bold mb-1">
                Account Type
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent shadow-inner bg-white"
              >
                <option value="user">Buyer</option>
                <option value="admin">Seller</option>
              </select>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-2 rounded shadow-sm border border-yellow-500 transition-colors"
          >
            {loading
              ? "Processing..."
              : isLogin
                ? "Sign in"
                : "Create your UrbanShop account"}
          </button>
        </form>
        <div className="mt-6 text-sm text-center border-t pt-4">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline hover:text-orange-600"
          >
            {isLogin
              ? "New to UrbanShop? Create an account"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
