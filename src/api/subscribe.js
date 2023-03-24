import axios from "./http";
import {ADD_NEWSLETTER} from "../config/urlConfig";

export async function subscribe(data) {
    try {
        return await axios.post(ADD_NEWSLETTER, data);
    } catch (e) {
        return Promise.reject(e);
    }
}