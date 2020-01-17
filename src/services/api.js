import axios from "axios";
import jwtDecode from "jwt-decode";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

// Add a request interceptor
api.interceptors.request.use(config => {
  const { token } = localStorage;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const date = new Date(0);
      if (date.setUTCSeconds(decoded.exp) < Date.now()) {
        return redirectToLogin();
      }
    } catch (err) {
      return redirectToLogin();
    }
    const tkn = `Bearer ${token}`;
    config.headers.Authorization = tkn;
  } else {
    if (!config.data || !config.data.withoutToken) {
      return redirectToLogin();
    }
  }
  return config;
});

export default api;

function redirectToLogin() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}
