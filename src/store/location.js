import {createSlice} from "@reduxjs/toolkit";

const locationSlice = createSlice({
    name:"location",
    initialState:"",
    reducers:{
        addLocation(state,action){
            return state = action.payload
        }
    }

})

export const {addLocation} = locationSlice.actions
export default locationSlice.reducer
