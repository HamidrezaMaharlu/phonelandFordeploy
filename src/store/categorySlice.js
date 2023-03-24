import {createSlice} from "@reduxjs/toolkit";


const categorySlice = createSlice({
    name: "category",
    initialState: [],
    reducers: {
        addCategory(state, action) {
            return state = action.payload
        },
        clearCategory(state) {
            return state = []
        }
    }
})

export const {addCategory,clearCategory} = categorySlice.actions
export default categorySlice.reducer