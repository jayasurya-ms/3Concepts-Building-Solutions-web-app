import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, MapPlus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import apiService from "../../api/apiService";
import { ContextPanel } from "../../lib/ContextPanel";
import AddSiteModal from "../site/AddSiteModal";

const AddTripModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const { isAddSiteOpen, setIsAddSiteOpen } = React.useContext(ContextPanel);

  const [formData, setFormData] = useState({
    trips_date: new Date().toISOString().split("T")[0],
    trips_time: new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    trips_from_id: "",
    trips_to_id: "",
  });

  const { data: activeSites, isLoading: sitesLoading } = useQuery({
    queryKey: ["activeSites"],
    queryFn: apiService.fetchActiveSites,
    enabled: isOpen, // Only fetch when modal is open
  });

  const mutation = useMutation({
    mutationFn: (data) =>
      apiService.createTrip(
        data.trips_date,
        data.trips_time,
        data.trips_from_id,
        data.trips_to_id,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["tripHistory", "recentTrip"]);
      toast.success("Trip logged successfully!");
      onClose();
      // Reset form
      setFormData({
        trips_date: new Date().toISOString().split("T")[0],
        trips_time: new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        trips_from_id: "",
        trips_to_id: "",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex flex-col justify-end"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 md:left-[25%] right-0 bg-white w-full md:w-[50%] h-[70vh] rounded-t-4xl shadow-[0_-8px_30px_rgb(0,0,0,0.1)] p-6 flex flex-col border-t border-gray-100 z-60"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <h1 className="text-xl font-black text-[#B23A3A] tracking-tight">
                  Add Trip
                </h1>
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">
                  Quick Log Entry
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-gray-50 rounded-full text-gray-900 hover:text-red-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex-1 flex flex-col justify-between"
            >
              <div className="space-y-2">
                {/* Date and Time Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-2">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:bg-white focus:ring-2 focus:ring-red-900 transition-all text-gray-800 font-bold text-sm"
                      value={formData.trips_date}
                      onChange={(e) =>
                        setFormData({ ...formData, trips_date: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-2">
                      Time
                    </label>
                    <input
                      type="time"
                      required
                      className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:bg-white focus:ring-2 focus:ring-red-900 transition-all text-gray-800 font-bold text-sm"
                      value={formData.trips_time}
                      onChange={(e) =>
                        setFormData({ ...formData, trips_time: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* From Site Row */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-2 w-full flex justify-between">
                    <span>From Site</span>
                    <button
                      type="button"
                      onClick={() => setIsAddSiteOpen(true)}
                      className="flex items-center space-x-1 px-4 py-1 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <MapPlus size={16} className="text-gray-400" />
                      <span className="font-medium">Add Site</span>
                    </button>
                  </label>
                  <div className="relative">
                    <select
                      required
                      disabled={sitesLoading}
                      className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:bg-white focus:ring-2 focus:ring-red-900 transition-all text-gray-800 font-bold appearance-none cursor-pointer text-sm"
                      value={formData.trips_from_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          trips_from_id: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Origin...</option>
                      {activeSites?.data
                        ?.filter(
                          (site) =>
                            site.id.toString() !==
                            formData.trips_to_id.toString(),
                        )
                        .map((site) => (
                          <option key={site.id} value={site.id}>
                            {site.site_name}
                          </option>
                        ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <div className="border-l-2 border-b-2 border-current w-2 h-2 -rotate-45 mb-1"></div>
                    </div>
                  </div>
                </div>

                {/* To Site Row */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-2">
                    To Site
                  </label>
                  <div className="relative">
                    <select
                      required
                      disabled={sitesLoading}
                      className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:bg-white focus:ring-2 focus:ring-red-900 transition-all text-gray-800 font-bold appearance-none cursor-pointer text-sm"
                      value={formData.trips_to_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          trips_to_id: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Destination...</option>
                      {activeSites?.data
                        ?.filter(
                          (site) =>
                            site.id.toString() !==
                            formData.trips_from_id.toString(),
                        )
                        .map((site) => (
                          <option key={site.id} value={site.id}>
                            {site.site_name}
                          </option>
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
                    {mutation.error?.response?.data?.message ||
                      "Error logging trip. Please try again."}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-[#B23A3A] hover:bg-red-900 text-white font-black py-2 rounded-2xl shadow-xl shadow-blue-100 transition-all flex items-center justify-center disabled:opacity-70 active:scale-[0.98]"
                >
                  {mutation.isPending ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <span className="text-base">Create</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
      <AddSiteModal
        isOpen={isAddSiteOpen}
        onClose={() => setIsAddSiteOpen(false)}
      />
    </AnimatePresence>
  );
};

export default AddTripModal;
