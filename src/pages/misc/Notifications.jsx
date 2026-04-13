import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, Clock, ChevronRight, Circle } from "lucide-react";
import apiService from "../../api/apiService";
import moment from "moment";

const Notifications = () => {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: apiService.fetchNotification,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 p-4 rounded-3xl border border-gray-100 animate-pulse h-20 w-full"
              ></div>
            ))
        ) : notifications?.data?.length > 0 ? (
          notifications.data.map((notif) => (
            <div
              key={notif.id}
              className="bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-start space-x-2 group hover:border-blue-100 transition-all cursor-pointer"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-800">
                    {notif.notification_heading}
                  </h4>
                  <div className="flex items-center space-x-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <Clock size={12} />
                    <span>
                      {moment(notif.notification_date).format("DD-MM-YYYY")}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                  {notif.notification_description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-20 rounded-3xl border-2 border-dashed border-gray-100 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
              <Bell size={40} />
            </div>
            <p className="text-gray-500 font-bold mb-1">Stay clear!</p>
            <p className="text-sm text-gray-400">
              You don't have any new notifications yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
