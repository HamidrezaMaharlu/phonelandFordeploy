import http from "./http";
import {REFRESH_TOKEN_URL} from "../config/urlConfig";

export const refreshTokenRequest = async () => {
    try {
        const response = await http.post(`${REFRESH_TOKEN_URL}`);
        return response.data;
    } catch (error) {
        return Promise.reject(error.response.data);
    }
};