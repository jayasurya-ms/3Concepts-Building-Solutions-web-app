import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Calendar,
  Filter,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import apiService from "../../api/apiService";

const TripHistory = () => {
  const { data: tripHistory, isLoading } = useQuery({
    queryKey: ["tripHistory"],
    queryFn: apiService.fetchTripHistory,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-400 hover:text-blue-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900">Trip History</h1>
        </div>
        <button className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-400 hover:text-blue-600 transition-colors">
          <Filter size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 animate-pulse h-28 w-full"></div>
          ))
        ) : tripHistory?.data?.length > 0 ? (
          tripHistory.data.map((trip) => (
            <div 
              key={trip.id} 
              className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer"
            >
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">From / To</p>
                    <p className="text-sm font-bold text-gray-800 line-clamp-1">
                      {trip.fromsite?.site_name || "N/A"} → {trip.tosite?.site_name || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600 font-medium">{trip.trips_date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600 font-medium">{trip.trips_time}</span>
                  </div>
                  <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold">
                    {trip.trips_km} KM
                  </div>
                </div>
              </div>
              
              <div className="ml-4 text-gray-300 group-hover:text-blue-600 transition-colors">
                <ChevronRight size={20} />
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-20 rounded-[2rem] border-2 border-dashed border-gray-100 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
              <History size={40} />
            </div>
            <p className="text-gray-500 font-bold mb-2">No trips logged yet</p>
            <p className="text-sm text-gray-400">Your journey history will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripHistory;
