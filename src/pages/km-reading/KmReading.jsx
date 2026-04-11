import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Gauge, 
  Calendar,
  Save,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import apiService from "../../api/apiService";

const KmReading = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    km_readings_date: new Date().toISOString().split('T')[0],
    km_readings: "",
  });

  const mutation = useMutation({
    mutationFn: (data) => apiService.createKmReading(data.km_readings_date, data.km_readings),
    onSuccess: () => {
      // Potentially invalidate some queries if needed
      // queryClient.invalidateQueries(["kmHistory"]);
      alert("KM Reading registered successfully!");
      navigate("/");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <div className="flex items-center space-x-4">
        <Link to="/" className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-400 hover:text-blue-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-extrabold text-gray-900">KM Reading</h1>
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Date Picker */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-blue-600">
              <Calendar size={18} />
              <span className="text-sm font-extrabold uppercase tracking-wider">Reading Date</span>
            </div>
            <input 
              type="date"
              required
              max={new Date().toISOString().split('T')[0]} // No future date
              className="w-full bg-gray-50 border-transparent border-2 rounded-2xl py-4 px-4 focus:bg-white focus:border-blue-500 focus:ring-0 transition-all text-gray-800 font-bold"
              value={formData.km_readings_date}
              onChange={(e) => setFormData({...formData, km_readings_date: e.target.value})}
            />
          </div>

          {/* KM Reading Input */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-indigo-600">
              <Gauge size={18} />
              <span className="text-sm font-extrabold uppercase tracking-wider">Odometer Reading (KM)</span>
            </div>
            <div className="relative">
              <input 
                type="number"
                required
                placeholder="Example: 12450"
                className="w-full bg-gray-50 border-transparent border-2 rounded-2xl py-4 px-4 focus:bg-white focus:border-blue-500 focus:ring-0 transition-all text-gray-900 font-extrabold text-2xl"
                value={formData.km_readings}
                onChange={(e) => setFormData({...formData, km_readings: e.target.value})}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 font-bold">KM</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-6 rounded-[2rem] shadow-xl shadow-indigo-200 transition-all flex items-center justify-center space-x-3 disabled:opacity-70 active:scale-[0.98]"
          >
            {mutation.isPending ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                <Save size={24} />
                <span className="text-lg">Submit Reading</span>
              </>
            )}
          </button>
        </form>
      </div>

      <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100 flex items-start space-x-4">
        <div className="p-2 bg-white rounded-xl text-blue-600 shadow-sm mt-1">
          <CheckCircle2 size={18} />
        </div>
        <div>
          <h4 className="font-bold text-blue-900 text-sm">Accuracy Note</h4>
          <p className="text-blue-700 text-xs mt-1 leading-relaxed opacity-80">
            Please ensure you are documenting the physical odometer reading correctly. This data is used for fleet maintenance reporting.
          </p>
        </div>
      </div>
    </div>
  );
};

export default KmReading;
