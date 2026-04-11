import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Loader2,
  X
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import apiService from "../../api/apiService";

const AddTrip = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    trips_date: new Date().toISOString().split('T')[0],
    trips_time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    trips_from_id: "",
    trips_to_id: "",
  });

  const { data: activeSites, isLoading: sitesLoading } = useQuery({
    queryKey: ["activeSites"],
    queryFn: apiService.fetchActiveSites,
  });

  const mutation = useMutation({
    mutationFn: (data) => apiService.createTrip(
      data.trips_date, 
      data.trips_time, 
      data.trips_from_id, 
      data.trips_to_id
    ),
    onSuccess: () => {
      queryClient.invalidateQueries(["tripHistory", "recentTrip"]);
      navigate("/trips");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex flex-col pt-[20vh] px-0 bg-gray-50/50 animate-in fade-in duration-700">
      <motion.div 
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="bg-white w-full h-[80vh] rounded-t-[3rem] shadow-[0_-8px_30px_rgb(0,0,0,0.04)] p-8 flex flex-col border-t border-gray-100"
      >
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="space-y-1">
            <h1 className="text-xl font-black text-gray-900 tracking-tight">Add New Trip</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Mobile Log Entry</p>
          </div>
          <Link to="/" className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-red-500 transition-colors">
            <X size={20} />
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Date and Time Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Date</label>
                <input 
                  type="date"
                  required
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 font-bold text-sm"
                  value={formData.trips_date}
                  onChange={(e) => setFormData({...formData, trips_date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Time</label>
                <input 
                  type="time"
                  required
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 font-bold text-sm"
                  value={formData.trips_time}
                  onChange={(e) => setFormData({...formData, trips_time: e.target.value})}
                />
              </div>
            </div>

            {/* From Site Row */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">From Site</label>
              <div className="relative">
                <select
                  required
                  disabled={sitesLoading}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 font-bold appearance-none cursor-pointer text-sm"
                  value={formData.trips_from_id}
                  onChange={(e) => setFormData({...formData, trips_from_id: e.target.value})}
                >
                  <option value="">Select Origin...</option>
                  {activeSites?.data?.map(site => (
                    <option key={site.id} value={site.id}>{site.site_name}</option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <div className="border-l-2 border-b-2 border-current w-2 h-2 -rotate-45 mb-1"></div>
                </div>
              </div>
            </div>

            {/* To Site Row */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">To Site</label>
              <div className="relative">
                <select
                  required
                  disabled={sitesLoading}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-5 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 font-bold appearance-none cursor-pointer text-sm"
                  value={formData.trips_to_id}
                  onChange={(e) => setFormData({...formData, trips_to_id: e.target.value})}
                >
                  <option value="">Select Destination...</option>
                  {activeSites?.data?.map(site => (
                    <option key={site.id} value={site.id}>{site.site_name}</option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <div className="border-l-2 border-b-2 border-current w-2 h-2 -rotate-45 mb-1"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-4">
            {mutation.isError && (
              <p className="text-red-500 text-xs font-bold text-center px-4 mb-4">
                {mutation.error?.response?.data?.message || "Error logging trip. Please try again."}
              </p>
            )}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-[1.5rem] shadow-xl shadow-blue-100 transition-all flex items-center justify-center disabled:opacity-70 active:scale-[0.98]"
            >
              {mutation.isPending ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <span className="text-base">Register Trip Log</span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddTrip;
