import axios from "axios";
import {LOGIN, REFRESH_TOKEN_URL} from "../config/urlConfig";
import {refreshTokenRequest} from "./refreshToken";




axios.defaults.baseURL = "http://localhost:3002";

axios.interceptors.request.use((req) => {
    if (req.url === REFRESH_TOKEN_URL) {
        req.headers.refreshToken = localStorage.getItem("refreshToken");
    } else if (req.url !== LOGIN) {
        req.headers.token = localStorage.getItem("accessToken");
    }
    return req;
});

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response.status !== 401) {
            return Promise.reject(error);
        }
        const originalRequest = error.config;
        if (
            error.response.status === 401 &&
            originalRequest.url === REFRESH_TOKEN_URL
        ) {
            return Promise.reject(error);
        }
        if (!originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const RFT=await refreshTokenRequest()
                localStorage.setItem("accessToken", RFT.accessToken)
                const res = await axios.request(originalRequest);
                return Promise.resolve(res);

            } catch (e) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            }
        }
    }
);

export default axios;