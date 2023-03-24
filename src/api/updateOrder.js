import axios from "./http";
import {GET_ORDERS} from "../config/urlConfig";

export async function addOrder(data) {
    try {
        return await axios.post(GET_ORDERS, data);
    } catch (e) {
        return Promise.reject(e);
    }
}

export async function updateOrder(orderId, data) {
    try {
        return await axios.patch(`${GET_ORDERS}/${orderId}`, data);
    } catch (e) {
        return Promise.reject(e);
    }
}

export async function deleteOrder(orderId) {
    try {
        return await axios.delete(`${GET_ORDERS}/${orderId}`);
    } catch (e) {
        return Promise.reject(e);
    }
}