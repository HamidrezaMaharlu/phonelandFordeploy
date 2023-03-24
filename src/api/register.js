import {REGISTER} from "../config/urlConfig";
import axios from "./http";

export async function RegisterUser(data) {
    try {
        return await axios.post(REGISTER, data);
    } catch (e) {
        return Promise.reject(e);
    }
}