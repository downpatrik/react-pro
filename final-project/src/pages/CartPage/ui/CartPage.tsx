import s from '../../../features/cart/Cart.module.css';
import classNames from 'classnames';
import { useAppSelector } from '../../../shared/store/utils';
import { cartSelectors } from '../../../features/cart/cartSlice';
import { CartList } from '../../../features/cart/CartList';
import { CartAmount } from '../../../features/cart/CartAmount';

export const CartPage = () => {
	const count = useAppSelector(
		(state) => cartSelectors.getCartProducts(state).length
	);

	if (!count) {
		return <h1 className='header-title'>В корзине пока нет товаров</h1>;
	}

	return (
		<div className={classNames(s['content'], s['container'])}>
			<div className={classNames(s['content-cart'])}>
				<div className={classNames(s['cart-title'])}>
					<span>{count}</span> в корзине
				</div>
				<CartList />
				<CartAmount />
			</div>
		</div>
	);
};
