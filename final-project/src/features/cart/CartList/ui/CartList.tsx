import { useAppSelector } from '../../../../shared/store/utils';
import { cartSelectors } from '../../cartSlice';
import { CartItem } from '../../CartItem';
import s from '../../Cart.module.css';
import classNames from 'classnames';

export const CartList = () => {
	const products = useAppSelector(cartSelectors.getCartProducts);
	return (
		<div className={classNames(s['cart-list'])}>
			{products.map((p) => (
				<CartItem product={p} key={p.id} />
			))}
		</div>
	);
};
