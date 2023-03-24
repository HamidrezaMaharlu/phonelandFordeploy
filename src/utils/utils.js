import jwt_decode from "jwt-decode";
import _ from "lodash";


export const checkUserExpired = () => {
    const token = localStorage.getItem("refreshToken");
    if (!token) return false;
    const { exp } = jwt_decode(token);
    if (exp < Date.now()/1000) {
        localStorage.removeItem('userData');
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return false
    }
    return true
}

export const getTokenData=()=>{
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    return jwt_decode(token)
}

export function convertNumber(price) {
    if(isNaN(price)) return price
    price=price.toString()
    price = price.replace(/\,/g, '');
    const objRegex = new RegExp('(-?[0-9]+)([0-9]{3})');
    while (objRegex.test(price)) {
        price = price.replace(objRegex, '$1,$2');
    }
    return price
}


export function paginate(items, pageNumber, pageSize) {
    const startIndex = (pageNumber - 1) * pageSize;
    return _(items)
        .slice(startIndex)
        .take(pageSize)
        .value();
}