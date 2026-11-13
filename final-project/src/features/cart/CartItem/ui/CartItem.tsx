import TrashIcon from '../../../../shared/assets/icons/trash.svg?react';
import { Link } from 'react-router-dom';
import s from '../../Cart.module.css';
import classNames from 'classnames';
import { memo, useState } from 'react';
import { Button } from '../../../../shared/ui/Button';
import { Modal } from '../../../../shared/ui/Modal';
import { useDispatch } from 'react-redux';
import { cartActions } from '../../cartSlice';
import { CartCounter } from '../../CartCounter';

type CartItemProps = {
	product: CartProduct;
};
export const CartItem = memo(function CartItem({ product }: CartItemProps) {
	const [confirm, setConfirm] = useState(false);
	const dispatch = useDispatch();
	const { id, name, images, price, discount } = product;

	const handleDelete = () => {
		setConfirm(false);
		dispatch(cartActions.deleteCartProduct(id));
	};
	return (
		<div className={classNames(s['cart-item'])}>
			<div className={classNames(s['cart-item__desc'])}>
				<img
					src={images}
					alt={name}
					className={classNames(s['cart-item__image'])}
				/>

				<div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
					<div style={{ display: 'flex', gap: '20px', flexGrow: 1 }}>
						<Link
							className={classNames(s['cart-item__title'])}
							to={`/products/${id}`}>
							<h2>{name}</h2>
						</Link>

						<div style={{ display: 'flex', flexDirection: 'column' }}>
							<CartCounter productId={id} />

							<div className={classNames(s['cart-item__price'])}>
								<div className={classNames(s['price-big'], s['price-wrap'])}>
									<span
										className={classNames(s['price_old'], s['price_right'])}>
										{price}
									</span>
									<span className={classNames(s['price_discount'], s['price'])}>
										{price - discount}
									</span>
								</div>
							</div>
						</div>
						<Button
							className={s['cart-item__bnt-trash']}
							aria-label={`Удалить ${name} из корзины`}
							onClick={() => setConfirm(true)}>
							<TrashIcon aria-hidden='true' />
						</Button>
					</div>
				</div>
			</div>
			{confirm && (
				<Modal
					title='Удалить товар из корзины?'
					onClose={() => setConfirm(false)}>
					<p>{name}</p>
					<div className={s['cart-confirm-actions']}>
						<Button onClick={() => setConfirm(false)}>Отмена</Button>
						<Button onClick={handleDelete}>Удалить</Button>
					</div>
				</Modal>
			)}
		</div>
	);
});
