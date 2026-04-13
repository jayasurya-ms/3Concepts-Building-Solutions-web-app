import React from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  PlusCircle,
  History,
  MapPin,
  Clock,
  ArrowUpRight,
  Zap,
  LayoutGrid,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import apiService from "../../api/apiService";
import { ContextPanel } from "../../lib/ContextPanel";

const Home = () => {
  const { setIsAddTripOpen } = React.useContext(ContextPanel);
  const { data: tripHistory, isLoading: historyLoading } = useQuery({
    queryKey: ["tripHistory"],
    queryFn: apiService.fetchTripHistory,
  });

  const isLoading = historyLoading;
  const hasHistory = tripHistory?.data && tripHistory.data.length > 0;
  const recentTrip = tripHistory?.data?.[0];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900"></div>
      </div>
    );
  }

  if (!hasHistory) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-6">
        <img
          src="/home.png"
          alt="Welcome"
          className="w-full max-w-md object-contain rounded-3xl p-6"
        />
        <div className="text-center">
          <h1 className="text-xl font-extrabold text-gray-900">
            No Trip records ound
          </h1>
          <p className="text-gray-500 font-medium mt-2 mb-8 px-8">
            Tap + Add to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-10">
      {/* Recent Trip Section (Top) */}
      <section>
        <div className="flex items-center justify-between mb-2 px-2">
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
        </div>

        {recentTrip ? (
          <div className="bg-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-10 bg-linear-to-b from-red-800 to-transparent rounded-full"></div>
                  <div>
                    <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">
                      Origin
                    </p>
                    <p className="text-gray-900 font-bold text-lg">
                      {recentTrip.fromsite?.site_name || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-10 bg-linear-to-t from-red-900 to-transparent rounded-full"></div>
                  <div>
                    <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">
                      Destination
                    </p>
                    <p className="text-gray-900 font-bold text-lg">
                      {recentTrip.tosite?.site_name || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-blue-50 text-red-900 px-4 py-2 rounded-2xl font-bold flex items-center space-x-2 text-sm">
                  <Clock size={16} />
                  <span>{recentTrip.trips_time}</span>
                </div>
                <p className="text-xs text-gray-600 font-bold mt-2 pr-2">
                  {dayjs(recentTrip.trips_date).format("DD-MM-YYYY")}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-gray-100 text-center">
            <p className="text-gray-500 font-bold">No active trip log found</p>
          </div>
        )}
      </section>

      {/* Trip History Section */}
      <section>
        <div className="flex items-center justify-between mb-2 px-2">
          <div className="flex items-center space-x-2">
            <History className="text-red-900" size={20} />
            <h2 className="text-xl font-extrabold text-gray-900">
              Trip History
            </h2>
          </div>
        </div>

        <div className="space-y-2">
          {tripHistory.data.map((trip, index) => (
            <div
              key={trip.id || index}
              className="bg-white p-2 rounded-2xl border border-gray-100 flex items-center justify-between group hover:bg-gray-50 transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-50 text-red-900 rounded-md group-hover:bg-red-900 group-hover:text-white transition-colors text-xs font-black">
                  {index + 1}
                </div>
                <div>
                  <p className="text-gray-900 font-bold text-sm">
                    {trip.fromsite?.site_name} → {trip.tosite?.site_name}
                  </p>
                  <p className="text-xs text-gray-400 font-medium">
                    {dayjs(trip.trips_date).format("DD-MM-YYYY")} •{" "}
                    {trip.trips_time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
