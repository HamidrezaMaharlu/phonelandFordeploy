import axios from "./http";
import {GET_PRODUCTS} from "../config/urlConfig";

export async function getAllProducts() {
    try {
        return await axios.get(GET_PRODUCTS)
    } catch (e) {
        return Promise.reject(e)
    }
}

export async function getProduct(id) {
    try {
        return await axios.get(GET_PRODUCTS+"/"+id)
    } catch (e) {
        return Promise.reject(e)
    }
}

export async function AddProduct(data) {
    try {
        return await axios.post(GET_PRODUCTS, data);
    } catch (e) {
        return Promise.reject(e);
    }
}

export async function DeleteProducts(id) {
    try {
        return await axios.delete(GET_PRODUCTS + '/' + id);
    } catch (e) {
        return Promise.reject(e);
    }
}

export async function UpdateProduct(id, data) {
    try {
        return await axios.put(GET_PRODUCTS + '/' + id, data);
    } catch (e) {
        return Promise.reject(e);
    }
}

export async function GetProduct(id) {
    try {
        return await axios.get(GET_PRODUCTS + '/' + id);
    } catch (e) {
        return Promise.reject(e);
    }
}

export async function UpdateLike(id, data) {
    try {
        return await axios.patch(GET_PRODUCTS + '/' + id, data);
    } catch (e) {
        return Promise.reject(e);
    }
}
