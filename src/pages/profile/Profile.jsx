import React, { useState, useRef } from "react";
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
  LogOut,
} from "lucide-react";
import apiService from "../../api/apiService";
import useAuth from "../../hooks/useAuth";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { toast } from "react-hot-toast";

const Profile = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    user_image: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const resp = await apiService.fetchProfile();
      const userData = resp.data;
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        mobile: userData.mobile || "",
        user_image: null,
      });
      return resp;
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => apiService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
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
    setShowDeleteConfirm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, user_image: file });
      setPreviewUrl(URL.createObjectURL(file));
      // Switch to editing mode if an image is selected
      setIsEditing(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5 pb-5 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <div className="relative inline-block">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
          <div className="w-30 h-30 rounded-3xl bg-linear-to-tr from-red-900 to-red-900 p-1">
            <div className="w-full h-full rounded-3xl bg-white flex items-center justify-center text-4xl font-bold text-blue-600 overflow-hidden">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : profile?.data?.user_image ? (
                <img
                  src={`${profile.image_url.find((i) => i.image_for === "User")?.image_url}${profile.data.user_image}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                profile?.data?.name?.charAt(0) || "U"
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-3 bg-white border border-gray-100 shadow-xl rounded-2xl text-blue-600 active:scale-95 transition-all"
          >
            <Camera size={15} />
          </button>
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {profile?.data?.name || "User Profile"}
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">
            {profile?.data?.user_position || "Field Professional"}
          </p>
        </div>
      </div>

      <div className="bg-gray-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleUpdate} className="space-y-4">
            <div
              className={`space-y-4 ${!isEditing ? "pointer-events-none opacity-80" : ""}`}
            >
              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-red-900"
                    size={18}
                  />
                  <input
                    type="text"
                    className="w-full bg-white border-transparent border-2 rounded-2xl py-3 pl-10 pr-4 focus:bg-white focus:border-blue-500 focus:ring-0 transition-all font-bold text-gray-800"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-red-900"
                    size={18}
                  />
                  <input
                    type="email"
                    className="w-full bg-white border-transparent border-2 rounded-2xl py-3 pl-10 pr-4 focus:bg-white focus:border-blue-500 focus:ring-0 transition-all font-bold text-gray-800"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Mobile */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">
                  Mobile Number
                </label>
                <div className="relative group">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-red-900"
                    size={18}
                  />
                  <input
                    type="tel"
                    readOnly
                    className="w-full bg-white border-transparent border-2 rounded-2xl py-3 pl-10 pr-4 text-gray-800 font-bold cursor-not-allowed"
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
                  className="flex-1 py-3 px-6 rounded-2xl font-bold text-gray-500 bg-white hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="flex-1 py-3 px-6 rounded-2xl font-bold text-white bg-red-900 hover:bg-red-950 shadow-lg shadow-blue-200 transition-all flex items-center justify-center space-x-2"
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <Save size={20} />
                      <span>Update</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full py-3 px-6 rounded-2xl font-bold text-red-900 bg-white border-2 border-black-50 hover:bg-black-50 transition-all"
              >
                Edit Profile
              </button>
            )}
          </form>
        </div>

        <div className="bg-gray-50 p-2 flex flex-col space-y-2">
          <div className="flex items-center space-x-2 text-gray-600 p-2">
            <ShieldCheck size={20} className="text-green-500" />
            <span className="text-sm font-medium">
              Your account is verified & secured.
            </span>
          </div>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-center space-x-2 py-3 text-red-900 font-bold bg-white hover:bg-red-50 rounded-2xl transition-all"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>

          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="w-full flex items-center justify-center space-x-2 py-2 text-red-400 font-bold hover:text-red-600 transition-all text-sm opacity-60 hover:opacity-100 mt-2"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete Account</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>

    {/* Confirmation Dialogs */}
    <ConfirmDialog
      isOpen={showLogoutConfirm}
      onClose={() => setShowLogoutConfirm(false)}
      onConfirm={logout}
      title="Sign Out"
      message="Are you sure you want to sign out of your account?"
      confirmText="Sign Out"
      type="info"
    />

    <ConfirmDialog
      isOpen={showDeleteConfirm}
      onClose={() => setShowDeleteConfirm(false)}
      onConfirm={() => deleteMutation.mutate()}
      title="Delete Account"
      message="Are you sure you want to delete your profile? This action is permanent and cannot be undone."
      confirmText="Delete permanently"
      type="danger"
    />
  </>
);
};

export default Profile;
