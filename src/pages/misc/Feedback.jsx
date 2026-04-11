import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  MessageSquare, 
  Send, 
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import apiService from "../../api/apiService";

const Feedback = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    feedback_subject: "",
    feedback_description: ""
  });

  const mutation = useMutation({
    mutationFn: (data) => apiService.createFeedback(data.feedback_subject, data.feedback_description),
    onSuccess: () => {
      alert("Feedback submitted successfully. Thank you!");
      navigate("/");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="space-y-8 max-w-lg mx-auto pb-10">
      <div className="flex items-center space-x-4">
        <Link to="/" className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-400 hover:text-blue-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-extrabold text-gray-900">Feedback</h1>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-800">We Value Your Opinion</h2>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">
            Tell us about your experience or report any issues you've encountered while using the app.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Subject</label>
            <input 
              type="text" 
              required
              placeholder="What is this about?"
              className="w-full bg-gray-50 border-transparent border-2 rounded-2xl py-4 px-4 focus:bg-white focus:border-blue-500 focus:ring-0 transition-all font-bold text-gray-800"
              value={formData.feedback_subject}
              onChange={(e) => setFormData({...formData, feedback_subject: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Description</label>
            <textarea 
              required
              rows={4}
              placeholder="Provide more details here..."
              className="w-full bg-gray-50 border-transparent border-2 rounded-2xl py-4 px-4 focus:bg-white focus:border-blue-500 focus:ring-0 transition-all font-bold text-gray-800 resize-none"
              value={formData.feedback_description}
              onChange={(e) => setFormData({...formData, feedback_description: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 active:scale-[0.98]"
          >
            {mutation.isPending ? <Loader2 className="animate-spin" size={24} /> : (
              <>
                <Send size={20} />
                <span>Submit Feedback</span>
              </>
            )}
          </button>
        </form>
      </div>

      <div className="flex items-center justify-center space-x-4 py-8">
        <div className="h-px bg-gray-100 flex-1"></div>
        <MessageSquare className="text-gray-200" size={24} />
        <div className="h-px bg-gray-100 flex-1"></div>
      </div>
    </div>
  );
};

export default Feedback;
