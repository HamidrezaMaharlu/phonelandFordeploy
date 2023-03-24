import axios from "./http";
import {GET_ORDERS} from "../config/urlConfig";

export async function GetOrders() {
    try {
        return await axios.get(GET_ORDERS);
    } catch (e) {
        return Promise.reject(e);
    }
}

export async function GetOrder(id) {
    try {
        return await axios.get(`${GET_ORDERS}/${id}`);
    } catch (e) {
        return Promise.reject(e);
    }
}

export async function GetUserOrder(id) {
    try {
        return await axios.get(`${GET_ORDERS}?user-id=${id}`);
    } catch (e) {
        return Promise.reject(e);
    }
}