import { createContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import apiService from "../api/apiService";

export const ContextPanel = createContext();

const AppProvider = ({ children }) => {
  const [statusCheck, setStatusCheck] = useState("ok");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddTripOpen, setIsAddTripOpen] = useState(false);
  const navigate = useNavigate();

  // Initialize auth from cookies
  const initializeAuth = useCallback(() => {
    const storedToken = Cookies.get("token");
    const storedId = Cookies.get("id");
    const storedName = Cookies.get("name");
    const storedEmail = Cookies.get("email");

    if (storedToken) {
      setToken(storedToken);
      setUser({
        id: storedId,
        name: storedName,
        email: storedEmail,
      });
    } else {
      setToken(null);
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    initializeAuth();

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

  const login = (userData, userToken) => {
    const expires = 7;
    Cookies.set("token", userToken, { expires });
    Cookies.set("id", userData.id, { expires });
    Cookies.set("name", userData.name, { expires });
    Cookies.set("email", userData.email, { expires });
    
    setToken(userToken);
    setUser(userData);
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("id");
    Cookies.remove("name");
    Cookies.remove("email");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <ContextPanel.Provider value={{ statusCheck, user, token, loading, login, logout, isAddTripOpen, setIsAddTripOpen }}>
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
