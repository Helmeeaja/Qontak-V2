import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({ baseURL });

export const publicApi = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const res = await axios.post(
            `${api.defaults.baseURL}/token/refresh/`,
            { refresh: refreshToken }
          );
          localStorage.setItem("access_token", res.data.access);
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          return api(originalRequest);
        } catch {
          localStorage.clear();
          window.location.href = "/login";
        }
      } else {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const extractError = (error, fallback) => {
  const detail = error.response?.data;
  if (detail && typeof detail === "object") {
    return Object.entries(detail)
      .map(([field, errs]) => (field === "detail" ? errs : `${field}: ${errs}`))
      .join("\n");
  }
  return fallback;
};

export default api;
