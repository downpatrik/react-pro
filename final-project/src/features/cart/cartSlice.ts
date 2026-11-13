import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState {
	products: CartProduct[];
}

const createInitState = (): CartState => ({
	products: [],
});

export const cartSlice = createSlice({
	name: 'cart',
	initialState: createInitState(),
	reducers: {
		addCartProduct(state, action: PayloadAction<CartProduct>) {
			if (
				action.payload.stock > 0 &&
				!state.products.some((item) => item.id === action.payload.id)
			) {
				const product = action.payload;
				state.products.push({
					...product,
					count: Math.max(1, Math.min(99, product.stock, product.count)),
				});
			}
		},
		deleteCartProduct(state, action: PayloadAction<CartProduct['id']>) {
			state.products = state.products.filter((p) => p.id !== action.payload);
		},
		setCartProductCount(
			state,
			action: PayloadAction<Pick<CartProduct, 'id' | 'count'>>
		) {
			const product = state.products.find(
				(item) => item.id === action.payload.id
			);
			if (product && Number.isFinite(action.payload.count)) {
				product.count = Math.max(
					1,
					Math.min(99, product.stock, Math.trunc(action.payload.count))
				);
			}
		},
	},
	selectors: {
		getCartProducts: (state: CartState) => state.products,
	},
});

export const cartActions = { ...cartSlice.actions };
export const cartSelectors = cartSlice.selectors;
