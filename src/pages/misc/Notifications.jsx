import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Bell, 
  ArrowLeft, 
  Clock, 
  ChevronRight,
  Circle
} from "lucide-react";
import { Link } from "react-router-dom";
import apiService from "../../api/apiService";

const Notifications = () => {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: apiService.fetchNotification,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/" className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-400 hover:text-blue-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-extrabold text-gray-900">Notifications</h1>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 animate-pulse h-24 w-full"></div>
          ))
        ) : notifications?.data?.length > 0 ? (
          notifications.data.map((notif) => (
            <div 
              key={notif.id} 
              className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-start space-x-4 group hover:border-blue-100 transition-all cursor-pointer"
            >
              <div className="mt-1 flex-shrink-0">
                <div className={`w-3 h-3 rounded-full bg-blue-500 animate-pulse`}></div>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-800">{notif.notification_heading}</h4>
                  <div className="flex items-center space-x-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <Clock size={12} />
                    <span>{notif.notification_date}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                  {notif.notification_description}
                </p>
              </div>
              <div className="self-center text-gray-300 group-hover:text-blue-600 transition-colors">
                <ChevronRight size={18} />
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-20 rounded-[2.5rem] border-2 border-dashed border-gray-100 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
              <Bell size={40} />
            </div>
            <p className="text-gray-500 font-bold mb-1">Stay clear!</p>
            <p className="text-sm text-gray-400">You don't have any new notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
