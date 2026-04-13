import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  Save, 
  Trash2,
  Loader2,
  ChevronRight,
  ShieldCheck,
  LogOut
} from "lucide-react";
import apiService from "../../api/apiService";
import useAuth from "../../hooks/useAuth";

const Profile = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    user_image: null
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const resp = await apiService.fetchProfile();
      const userData = resp.data;
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        mobile: userData.mobile || "",
        user_image: null
      });
      return resp;
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => apiService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
      setIsEditing(false);
      alert("Profile updated successfully!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: apiService.deleteProfile,
    onSuccess: () => {
      logout();
      window.location.href = "/login";
    },
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 max-w-2xl mx-auto">
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-tr from-blue-600 to-indigo-600 p-1">
            <div className="w-full h-full rounded-[2.3rem] bg-white flex items-center justify-center text-4xl font-bold text-blue-600 overflow-hidden">
              {profile?.data?.user_image ? (
                <img 
                  src={`${profile.image_url.find(i => i.image_for === "User")?.image_url}${profile.data.user_image}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                profile?.data?.name?.charAt(0) || "U"
              )}
            </div>
          </div>
          <button className="absolute bottom-0 right-0 p-3 bg-white border border-gray-100 shadow-xl rounded-2xl text-blue-600 active:scale-95 transition-all">
            <Camera size={20} />
          </button>
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">{profile?.data?.name || "User Profile"}</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">{profile?.data?.user_position || "Field Professional"}</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 space-y-8">
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className={`space-y-6 ${!isEditing ? "pointer-events-none opacity-80" : ""}`}>
              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    className="w-full bg-gray-50 border-transparent border-2 rounded-2xl py-4 pl-12 pr-4 focus:bg-white focus:border-blue-500 focus:ring-0 transition-all font-bold text-gray-800"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="email" 
                    className="w-full bg-gray-50 border-transparent border-2 rounded-2xl py-4 pl-12 pr-4 focus:bg-white focus:border-blue-500 focus:ring-0 transition-all font-bold text-gray-800"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {/* Mobile */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Mobile Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="tel" 
                    readOnly
                    className="w-full bg-gray-100 border-transparent border-2 rounded-2xl py-4 pl-12 pr-4 text-gray-500 font-bold cursor-not-allowed"
                    value={formData.mobile}
                  />
                </div>
              </div>
            </div>

            {isEditing ? (
              <div className="flex space-x-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-4 px-6 rounded-2xl font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="flex-1 py-4 px-6 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center space-x-2"
                >
                  {updateMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      <Save size={20} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button 
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full py-4 px-6 rounded-2xl font-bold text-blue-600 border-2 border-blue-50 hover:bg-blue-50 transition-all"
              >
                Edit Profile Information
              </button>
            )}
          </form>
        </div>

        <div className="bg-gray-50 p-6 flex flex-col space-y-4">
          <div className="flex items-center space-x-3 text-gray-500 p-2">
            <ShieldCheck size={20} className="text-green-500" />
            <span className="text-sm font-medium">Your account is verified and secured.</span>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 py-4 text-blue-600 font-bold bg-blue-50/50 hover:bg-blue-50 rounded-2xl transition-all"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
          
          <button 
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="w-full flex items-center justify-center space-x-2 py-2 text-red-400 font-bold hover:text-red-600 transition-all text-sm opacity-60 hover:opacity-100 mt-2"
          >
            {deleteMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : (
              <>
                <Trash2 size={16} />
                <span>Delete Account</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
