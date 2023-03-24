import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    id: null,
    role: "",
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    address: "",
    state: "",
    city: "",
    zipCode: "",

    createdAt: null,
    isUserLogin: false,
};


const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginSuccess(state, action) {
             return state = {...action.payload,password:"",isUserLogin:true,role:""}
        },
        logOut(state) {
             return state = initialState
        }

    }
});


export const {loginSuccess, logOut} = userSlice.actions
export default userSlice.reducer
