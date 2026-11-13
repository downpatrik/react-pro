import { useCallback } from 'react';
import { cartActions } from './cartSlice';
import { useAppDispatch } from '../../shared/store/utils';

export const useAddToCart = () => {
	const dispatch = useAppDispatch();
	const addProductToCart = useCallback(
		(cartProduct: CartProduct) => {
			dispatch(cartActions.addCartProduct(cartProduct));
		},
		[dispatch]
	);

	return { addProductToCart };
};
