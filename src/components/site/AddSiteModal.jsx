import React, { useState, useRef, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import apiService from "../../api/apiService";

const AddSiteModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    site_name: "",
    site_address: "",
    site_url: "",
    place_id: "",
  });

  const autoCompleteRef = useRef(null);
  const autoCompleteInstance = useRef(null);
  const lastSelectedAddress = useRef("");

  const handlePlaceSelect = () => {
    const place = autoCompleteInstance.current.getPlace();

    if (!place || !place.formatted_address) return;

    lastSelectedAddress.current = place.formatted_address;
    setFormData((prev) => ({
      ...prev,
      site_address: place.formatted_address,
      site_url: place.url || "",
      place_id: place.place_id || "",
    }));
  };

  const handleScriptLoad = useCallback(async () => {
    if (!autoCompleteRef.current) return;
    try {
      const { Autocomplete } = await window.google.maps.importLibrary("places");

      autoCompleteInstance.current = new Autocomplete(autoCompleteRef.current, {
        componentRestrictions: { country: "IN" },
        fields: ["formatted_address", "url", "place_id"],
      });

      autoCompleteInstance.current.addListener("place_changed", () => {
        handlePlaceSelect();
      });
    } catch (error) {
      console.error("Error loading Google Maps library:", error);
    }
  }, []);

  useEffect(() => {
    let checkGoogle;

    if (isOpen) {
      if (window.google && window.google.maps) {
        handleScriptLoad();
      } else {
        checkGoogle = setInterval(() => {
          if (window.google && window.google.maps) {
            handleScriptLoad();
            clearInterval(checkGoogle);
          }
        }, 1000);
      }
    }

    return () => {
      if (checkGoogle) clearInterval(checkGoogle);
      if (autoCompleteInstance.current) {
        window.google?.maps?.event?.clearInstanceListeners(
          autoCompleteInstance.current,
        );
      }
    };
  }, [isOpen, handleScriptLoad]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        site_name: "",
        site_address: "",
        site_url: "",
        place_id: "",
      });
      lastSelectedAddress.current = "";
    }
  }, [isOpen]);

  const { data: activeSites, isLoading: sitesLoading } = useQuery({
    queryKey: ["activeSites"],
    queryFn: apiService.fetchActiveSites,
    enabled: isOpen, // Only fetch when modal is open
  });

  const mutation = useMutation({
    mutationFn: (data) =>
      apiService.createSite(
        data.site_name,
        data.site_address,
        data.site_url,
        data.place_id,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["activeSites"]);
      toast.success("Site created successfully!");
      onClose();
      // Reset form
      setFormData({
        site_name: "",
        site_address: "",
        site_url: "",
        place_id: "",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.site_url || !formData.place_id) {
      toast.error("Please select a valid address from the suggestions");
      return;
    }

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
                  Create Site
                </h1>
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">
                  Add New Site
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
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-2">
                    Site Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter site name"
                    className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:bg-white focus:ring-2 focus:ring-red-900 transition-all text-gray-800 font-bold text-sm"
                    value={formData.site_name}
                    onChange={(e) =>
                      setFormData({ ...formData, site_name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-2">
                    Site Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    ref={autoCompleteRef}
                    autoComplete="off"
                    placeholder="Search site address"
                    className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:bg-white focus:ring-2 focus:ring-red-900 transition-all text-gray-800 font-bold text-sm"
                    value={formData.site_address}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) => {
                        const updated = { ...prev, site_address: value };
                        if (value !== lastSelectedAddress.current) {
                          updated.site_url = "";
                          updated.place_id = "";
                        }
                        return updated;
                      });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.preventDefault();
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        setFormData((prev) => {
                          if (!prev.place_id && !prev.site_url) {
                            return { ...prev, site_address: "" };
                          }
                          return prev;
                        });
                      }, 200);
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-2">
                    Site URL
                  </label>
                  <input
                    type="text"
                    readOnly
                    placeholder="Automatically filled from address selection"
                    className="w-full bg-gray-100 border-none rounded-2xl py-3 px-4 cursor-not-allowed text-gray-500 font-bold text-sm"
                    value={formData.site_url}
                  />
                </div>
              </div>

              <div className="pt-6 space-y-4">
                {mutation.isError && (
                  <p className="text-red-500 text-xs font-bold text-center px-4 mb-4">
                    {mutation.error?.response?.data?.message ||
                      "Error creating site. Please try again."}
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
    </AnimatePresence>
  );
};

export default AddSiteModal;
