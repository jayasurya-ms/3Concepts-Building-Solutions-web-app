import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Lock,
  ChevronRight,
  Loader2,
  ArrowLeft,
  User,
} from "lucide-react";
import apiService from "../../api/apiService";
import useAuth from "../../hooks/useAuth";
import { getDeviceId } from "../../utils/deviceId";
import { toast } from "react-hot-toast";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();
 
  // Load remembered credentials on mount
  useEffect(() => {
    const savedMobile = localStorage.getItem("remembered_mobile");
    const savedPassword = localStorage.getItem("remembered_password");
    if (savedMobile && savedPassword) {
      setMobile(savedMobile);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const deviceId = getDeviceId();
      const data = await apiService.login(mobile, password, deviceId);

      if (data.code === 200 && data.data) {
        const token = data.data.token;
        const user = data.data.user;
        const imageUrls = data.image_url || [];
        
        // Handle Remember Me
        if (rememberMe) {
          localStorage.setItem("remembered_mobile", mobile);
          localStorage.setItem("remembered_password", password);
        } else {
          localStorage.removeItem("remembered_mobile");
          localStorage.removeItem("remembered_password");
        }

        login(user, token, imageUrls);
        toast.success("Welcome back! Login successful.");
        navigate("/");
      } else {
        const errorMsg = data.msg || "Login failed. Please check your credentials.";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#FFF7F7] flex flex-col justify-center items-center p-3 w-full py-5 gap-4">
      <div className="h-[20vh] text-center flex justify-center items-center">
        <img src="/logo.png" alt="3Concepts Building Solutions" />
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-[98%] md:w-lg max-h-[75vh] bg-white md:shadow-2xl rounded-[30px] p-4 md:p-8 flex justify-center items-center"
      >
        <div className="h-auto max-h-full w-full">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-[20px] text-center font-bold text-gray-800 mb-6">
              Welcome to <br />
              <p className="text-[18px]">Brief Solution Login Now!</p>
            </h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="group">
                <label htmlFor="mobile" className="text-[16px] font-semibold">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-red-900 transition-colors">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Enter Mobile Number"
                    className="block w-full pl-12 py-2 bg-[#FFF7F7] border-transparent border-2 rounded-xl focus:bg-white focus:border-red-900 focus:ring-0 transition-all text-gray-900 font-medium"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>
              </div>

              <div className="group">
                <label htmlFor="password" className="text-[16px] font-semibold">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-red-900 transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Enter Password"
                    className="block w-full pl-12 py-2 bg-[#FFF7F7] border-transparent border-2 rounded-xl focus:bg-white focus:border-red-900 focus:ring-0 transition-all text-gray-900 font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="relative group flex justify-between px-2 text-[14px]">
                <div className="flex gap-1">
                  <input
                    type="checkbox"
                    id="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-red-900 border-gray-300 rounded focus:ring-red-900"
                  />
                  <label htmlFor="checkbox">Remember me</label>
                </div>
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#B23A3A] hover:bg-red-800 text-white font-bold py-2 rounded-2xl shadow-lg transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <span>Login</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
