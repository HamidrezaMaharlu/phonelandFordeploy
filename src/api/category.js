import axios from "./http";
import {GET_CATEGORIES} from "../config/urlConfig";

export async function GetCategories() {
    try {
        return await axios.get(GET_CATEGORIES);
    } catch (e) {
        return Promise.reject(e);
    }
}
export async function AddCategory(category) {
    try {
        return await axios.post(`${GET_CATEGORIES}`, category);
    } catch (e) {
        return Promise.reject(e);
    }
}

export async function EditCategory(category) {
    try {
        return await axios.put(`${GET_CATEGORIES}/${category.id}`, category);
    } catch (e) {
        return Promise.reject(e);
    }
}