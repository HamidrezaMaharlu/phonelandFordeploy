import {createSlice} from "@reduxjs/toolkit";

const searchSlice = createSlice({
    name: "search",
    initialState: "",
    reducers: {
        updateState(state,action){
            return state=action.payload
        },
        deleteSearchState(state){
            return state=""
        }
    }
})

export const{updateState,deleteSearchState}=searchSlice.actions
export default searchSlice.reducer