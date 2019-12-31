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
      console.log("token valid");
      const date = new Date(0);
      if (date.setUTCSeconds(decoded.exp) < Date.now()) {
        console.log("token expirated | prevent request");
        return redirectToLogin();
      }
      console.log("token not expirated | continue");
    } catch (err) {
      console.log("invalid token | prevent request");
      return redirectToLogin();
    }
  } else {
    if (!config.data || !config.data.withoutToken) {
      console.log("without token | prevent request");
      return redirectToLogin();
    }
  }
  console.log("continuing...");

  const tkn = `Bearer ${token}`;
  config.headers.Authorization = tkn;

  return config;
});

api.interceptors.response.use(
  res => {
    // console.log("RES", res);
    return res;
  }
  // err => {
  //   console.log("err");
  //   console.log(err);
  //   return err;
  //   // console.log(error.toJSON());
  //   // return redirectToLogin();
  // }
);

export default api;

function redirectToLogin() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}
