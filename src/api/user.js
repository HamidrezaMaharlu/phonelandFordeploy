import {REGISTER} from "../config/urlConfig";
import axios from "./http";

export async function GetUserFullName(id) {
    try {
        const response = await axios.get(REGISTER + '/' + id);
        return response.data.firstName + " " + response.data.lastName;
    } catch (e) {
        return Promise.reject(e);
    }
}

export async function GetUserData(id) {
    try {
        const response = await axios.get(REGISTER + '/' + id);
        return response.data
    } catch (e) {
        return Promise.reject(e);
    }
}