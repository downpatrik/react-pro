import { useMemo } from 'react';
import { useAppSelector } from '../../../../shared/store/utils';
import { cartSelectors } from '../../cartSlice';
import s from '../../Cart.module.css';
import classNames from 'classnames';

export const CartAmount = () => {
	const products = useAppSelector(cartSelectors.getCartProducts);
	const { allPrice, allDiscount } = useMemo(
		() =>
			products.reduce(
				(total, item) => ({
					allPrice: total.allPrice + item.price * item.count,
					allDiscount: total.allDiscount + item.discount * item.count,
				}),
				{ allPrice: 0, allDiscount: 0 }
			),
		[products]
	);

	const handleSubmitCart = () => {
		const order = products.map((p) => ({ id: p.id, count: p.count }));
		console.log('Отправка заказа на сервер: ', JSON.stringify(order, null, 2));
	};

	return (
		<div className={classNames(s['cart-amount'])}>
			<h1 className={classNames(s['cart-amount__title'])}>Ваша корзина</h1>
			<div className={classNames(s['cart-amount__table'])}>
				<div className={classNames(s['cart-amount__table-row'])}>
					<span className={classNames(s['cart-amount__table-title'])}>
						{`Товары (${products.length})`}
					</span>
					<span className={classNames(s['cart-amount__table-value'])}>
						{`${allPrice} ₽`}
					</span>
				</div>
				<div className={classNames(s['cart-amount__table-row'])}>
					<span className={classNames(s['cart-amount__table-title'])}>
						Скидка
					</span>
					<span
						className={classNames(
							s['cart-amount__table-value'],
							s['cart-amount__table-value-discount']
						)}>
						{`${allDiscount} ₽`}
					</span>
				</div>
			</div>
			<div className={classNames(s['cart-amount__total-cost'])}>
				<h2 className={classNames(s['cart-amount__total-cost-title'])}>
					Общая стоимость
				</h2>
				<span className={classNames(s['cart-amount__total-cost-value'])}>
					{`${allPrice - allDiscount} ₽`}
				</span>
			</div>
			<button
				onClick={handleSubmitCart}
				className={classNames(
					s['button'],
					s['button_type_primary'],
					s['button_type_wide']
				)}>
				Оформить заказ
			</button>
		</div>
	);
};
