import {createSlice} from "@reduxjs/toolkit";

const initialState = {allProducts: [], sortedProducts: {}}

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        sortProducts(state) {
            state.sortedProducts = state.allProducts.reduce((acc, item) => {
                const categoryId = item["category-id"];
                if (!acc[categoryId]) {
                    acc[categoryId] = [item];
                } else {
                    acc[categoryId].push(item);
                }
                return acc;
            }, {});
        },
        addProducts(state, action) {
            state.allProducts = action.payload
        },
        clearProducts(state) {
            return state = initialState
        },
        editProductsCount(state, action) {
            const index=state.allProducts.findIndex(product => product.id=== action.payload.item.id);
            state.allProducts[index].count=action.payload.val;
        },
        editProductsPrice(state, action) {
            const index=state.allProducts.findIndex(product => product.id=== action.payload.item.id);
            state.allProducts[index].price.amount=action.payload.val;
        }
    }

})

export const {addProducts, sortProducts, clearProducts,editProductsCount,editProductsPrice} = productsSlice.actions
export default productsSlice.reducer