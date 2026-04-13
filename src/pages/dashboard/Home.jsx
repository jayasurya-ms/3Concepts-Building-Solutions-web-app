import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  PlusCircle, 
  History, 
  MapPin, 
  Clock, 
  ArrowUpRight,
  Zap,
  LayoutGrid,
  ChevronRight
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
          <h1 className="text-2xl font-extrabold text-gray-900">Ready to start?</h1>
          <p className="text-gray-500 font-medium mt-2 mb-8 px-8">Log your first trip to see your dashboard and track your travels.</p>
          <button 
            onClick={() => setIsAddTripOpen(true)}
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-all text-center"
          >
            <PlusCircle size={24} />
            <span>Create First Trip</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Recent Trip Section (Top) */}
      <section>
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-xl font-extrabold text-gray-900">Recent Activity</h2>
          <Link to="/trips" className="text-blue-600 text-sm font-bold flex items-center space-x-1 hover:underline">
            <span>View All</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {recentTrip ? (
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="space-y-4 flex-1">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-10 bg-gradient-to-b from-blue-400 to-transparent rounded-full"></div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Origin</p>
                    <p className="text-gray-900 font-bold text-lg">{recentTrip.fromsite?.site_name || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-10 bg-gradient-to-t from-indigo-500 to-transparent rounded-full"></div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Destination</p>
                    <p className="text-gray-900 font-bold text-lg">{recentTrip.tosite?.site_name || "N/A"}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-2xl font-bold flex items-center space-x-2 text-sm">
                  <Clock size={16} />
                  <span>{recentTrip.trips_time}</span>
                </div>
                <p className="text-xs text-gray-400 font-bold mt-2 pr-2">{recentTrip.trips_date}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-[2rem] border-2 border-dashed border-gray-100 text-center">
            <p className="text-gray-500 font-bold">No active trip log found</p>
          </div>
        )}
      </section>

      {/* Trip History Section */}
      <section>
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center space-x-2">
            <History className="text-blue-600" size={20} />
            <h2 className="text-xl font-extrabold text-gray-900">Trip History</h2>
          </div>
        </div>

        <div className="space-y-4">
          {tripHistory.data.slice(0, 5).map((trip, index) => (
            <div key={trip.id || index} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between group hover:bg-gray-50 transition-all cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors text-xs font-black">
                  {trip.trips_date?.split('-')[2] || "--"}
                </div>
                <div>
                  <p className="text-gray-900 font-bold text-sm">
                    {trip.fromsite?.site_name} → {trip.tosite?.site_name}
                  </p>
                  <p className="text-xs text-gray-400 font-medium">
                    {trip.trips_date} • {trip.trips_time}
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
            </div>
          ))}
          {tripHistory.data.length > 5 && (
            <Link to="/trips" className="block text-center py-3 text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors">
              Show All History
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
