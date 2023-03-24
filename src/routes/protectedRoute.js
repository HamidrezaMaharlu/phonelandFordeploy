import {redirect} from "react-router-dom";
import jwt_decode from "jwt-decode";


function getAuthToken() {
    const token=  localStorage.getItem("accessToken")
    if (token){
        const {exp}=jwt_decode(token)
        return exp>Date.now()/1000
    }
    return false
}

export function checkAuthLoader() {
    const token = getAuthToken();
    if(!token) {
        return redirect("/login")
    }
    return null
}