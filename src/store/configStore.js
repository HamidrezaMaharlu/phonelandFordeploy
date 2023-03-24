import {configureStore} from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import categorySlice from "./categorySlice";
import productsSlice from "./productsSlice";
import searchSlice from "./serachSlice";
import basketSlice from "./basketSlice";
import locationSlice from "./location";

const store =configureStore({
    reducer:{userSlice,categorySlice,productsSlice,searchSlice,basketSlice,locationSlice}
})

export default store