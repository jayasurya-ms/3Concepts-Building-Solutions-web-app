import axiosInstance from "../lib/axios";
import ENDPOINTS from "./endpoints";

const apiService = {
  // 1. POST check-mobile
  checkMobile: async (mobile) => {
    const response = await axiosInstance.post(ENDPOINTS.CHECK_MOBILE, { mobile }, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  },

  // 2. POST login
  login: async (mobile, password, device_id) => {
    const response = await axiosInstance.post(ENDPOINTS.LOGIN, { mobile, password, device_id }, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  },

  // 3. GET fetch-version
  fetchVersion: async () => {
    const response = await axiosInstance.get(ENDPOINTS.FETCH_VERSION);
    return response.data;
  },

  // 4. POST create-feedback
  createFeedback: async (feedbackSubject, feedbackDescription) => {
    const response = await axiosInstance.post(ENDPOINTS.CREATE_FEEDBACK, {
      feedback_subject: feedbackSubject,
      feedback_description: feedbackDescription,
    }, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  },

  // 5. GET fetch-developer
  fetchDeveloper: async () => {
    const response = await axiosInstance.get(ENDPOINTS.FETCH_DEVELOPER);
    return response.data;
  },

  // 6. GET fetch-notification
  fetchNotification: async () => {
    const response = await axiosInstance.get(ENDPOINTS.FETCH_NOTIFICATION);
    return response.data;
  },

  // 7. GET fetch-profile
  fetchProfile: async () => {
    const response = await axiosInstance.get(ENDPOINTS.FETCH_PROFILE);
    return response.data;
  },

  // 8. PUT update-profile
  updateProfile: async (profileData) => {
    // profileData: { name, mobile, email, user_image }
    const response = await axiosInstance.post(ENDPOINTS.UPDATE_PROFILE, {
      ...profileData,
      _method: "PUT"
    }, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  },

  // 9. DELETE delete-profile
  deleteProfile: async () => {
    const response = await axiosInstance.delete(ENDPOINTS.DELETE_PROFILE);
    return response.data;
  },

  // 10. POST create-kmreading
  createKmReading: async (kmReadingsDate, kmReadings) => {
    const response = await axiosInstance.post(ENDPOINTS.CREATE_KMREADING, {
      km_readings_date: kmReadingsDate,
      km_readings: kmReadings,
    }, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  },

  // 11. GET fetch-active-sites
  fetchActiveSites: async () => {
    const response = await axiosInstance.get(ENDPOINTS.FETCH_ACTIVE_SITES);
    return response.data;
  },

  // 12. POST create-trip
  createTrip: async (tripsDate, tripsTime, tripsFromId, tripsToId) => {
    const response = await axiosInstance.post(ENDPOINTS.CREATE_TRIP, {
      trips_date: tripsDate,
      trips_time: tripsTime,
      trips_from_id: tripsFromId,
      trips_to_id: tripsToId,
    }, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  },

  // 13. GET fetch-trip-history
  fetchTripHistory: async () => {
    const response = await axiosInstance.get(ENDPOINTS.FETCH_TRIP_HISTORY);
    return response.data;
  },

  // 14. GET fetch-recent-trip
  fetchRecentTrip: async () => {
    const response = await axiosInstance.get(ENDPOINTS.FETCH_RECENT_TRIP);
    return response.data;
  },
};

export default apiService;
