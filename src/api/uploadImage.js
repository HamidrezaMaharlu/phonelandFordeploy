import {UPLOAD_IMAGE} from "../config/urlConfig";
import axios from "./http";

export async function UploadImage(data, config) {
    try {
        return await axios.post(UPLOAD_IMAGE, data, config);
    } catch (e) {
        return Promise.reject(e);
    }
}