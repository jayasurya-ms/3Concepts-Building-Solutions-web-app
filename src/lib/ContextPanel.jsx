import { createContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import apiService from "../api/apiService";

export const ContextPanel = createContext();

const AppProvider = ({ children }) => {
  const [statusCheck, setStatusCheck] = useState("ok");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [userUrls, setUserUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddTripOpen, setIsAddTripOpen] = useState(false);
  const navigate = useNavigate();

  // Initialize auth from cookies and localStorage
  const initializeAuth = useCallback(() => {
    const storedToken = Cookies.get("token");
    const storedUser = Cookies.get("user_data");
    const storedUrls = localStorage.getItem("user_urls");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        if (storedUrls) {
          setUserUrls(JSON.parse(storedUrls));
        }
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        setToken(null);
        setUser(null);
      }
    } else {
      setToken(null);
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    initializeAuth();

    const fetchFullProfile = async () => {
      const storedToken = Cookies.get("token");
      if (storedToken) {
        try {
          const resp = await apiService.fetchProfile();
          if (resp && resp.data) {
            setUser(resp.data);
            setUserUrls(resp.image_url || []);
            Cookies.set("user_data", JSON.stringify(resp.data), { expires: 7 });
            localStorage.setItem("user_urls", JSON.stringify(resp.image_url || []));
          }
        } catch (error) {
          console.error("Error fetching full profile on init:", error);
        }
      }
    };

    fetchFullProfile();

    const checkPanelStatus = async () => {
      try {
        const data = await apiService.fetchVersion();
        if (data) {
          setStatusCheck("ok");
        }
      } catch (error) {
        console.error("Error fetching panel status:", error);
      }
    };

    checkPanelStatus();
    const interval = setInterval(checkPanelStatus, 300000);
    return () => clearInterval(interval);
  }, [initializeAuth]);

  const login = async (userData, userToken, image_url = []) => {
    const expires = 7;
    Cookies.set("token", userToken, { expires });
    Cookies.set("user_data", JSON.stringify(userData), { expires });
    
    if (image_url && image_url.length > 0) {
      localStorage.setItem("user_urls", JSON.stringify(image_url));
      setUserUrls(image_url);
    }
    
    setToken(userToken);
    setUser(userData);

    // Fetch full profile to get complete image URLs and other details
    try {
      const resp = await apiService.fetchProfile();
      if (resp && resp.data) {
        const fullUser = resp.data;
        const fullUrls = resp.image_url || [];
        Cookies.set("user_data", JSON.stringify(fullUser), { expires });
        localStorage.setItem("user_urls", JSON.stringify(fullUrls));
        setUser(fullUser);
        setUserUrls(fullUrls);
      }
    } catch (error) {
      console.error("Error fetching full profile during login:", error);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user_data");
    localStorage.removeItem("user_urls");
    setToken(null);
    setUser(null);
    setUserUrls([]);
    navigate("/login");
  };

  return (
    <ContextPanel.Provider value={{ statusCheck, user, token, userUrls, loading, login, logout, isAddTripOpen, setIsAddTripOpen }}>
      {statusCheck === "ok" ? children : (
        <div className="flex items-center justify-center h-screen bg-white">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h1 className="text-xl font-bold text-gray-800">System maintenance in progress...</h1>
          </div>
        </div>
      )}
    </ContextPanel.Provider>
  );
};

export default AppProvider;
