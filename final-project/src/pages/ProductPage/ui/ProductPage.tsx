import s from './ProductPage.module.css';
import { useParams } from 'react-router-dom';
import { Spinner } from '../../../shared/ui/Spinner';
import { userSelectors } from '../../../shared/store/slices/user';
import classNames from 'classnames';
import truckSVG from '../../../shared/assets/icons/truck.svg';
import qualitySVG from '../../../shared/assets/icons/quality.svg';
import { Rating } from '../../../shared/ui/Rating';
import { ButtonBack } from '../../../shared/ui/ButtonBack';
import { LikeButton } from '../../../features/products/LikeButton';
import { ReviewList } from '../../../features/products/ReviewList/ui/ReviewList';
import { WithProtection } from '../../../shared/store/HOCs/WithProtection';
import { useGetProductQuery } from '../../../features/products/api/productsApi';
import { ProductCartCounter } from '../../../features/cart/ProductCartCounter/ui/ProductCartCounter';
import { useAppSelector } from '../../../shared/store/utils';
import { cartSelectors } from '../../../features/cart/cartSlice';
import { CartCounter } from '../../../features/cart/CartCounter';

export const ProductPage = WithProtection(() => {
	const { productId = '' } = useParams();
	const {
		data: product,
		isLoading,
		isError,
	} = useGetProductQuery({ id: productId });
	const currentUser = useAppSelector(userSelectors.getUser);
	const isProductInCart = useAppSelector((state) =>
		cartSelectors.getCartProducts(state).some((item) => item.id === productId)
	);

	if (isLoading) return <Spinner />;
	if (isError || !product) return <p role='alert'>Не удалось открыть товар.</p>;

	const { id, name, images, description, price, discount, reviews } = product;
	const average = reviews.length
		? Math.round(
				reviews.reduce((total, review) => total + review.rating, 0) /
					reviews.length
		  )
		: 0;

	return (
		<>
			<ButtonBack />
			<h1 className={classNames(s['header-title'])}>{name}</h1>
			{product.user?.id === currentUser?.id && currentUser?.id && (
				<p>Ваш товар</p>
			)}
			<Rating rating={average} />
			<div className={classNames(s['product'])}>
				<div className={classNames(s['product__img-wrapper'])}>
					<img src={images} alt={description} />
				</div>
				<div className={classNames(s['product__desc'])}>
					<div className={classNames(s['price-big'], s['price-wrap'])}>
						<span className={classNames(s['price_old'], s['price_left'])}>
							{`${price} ₽`}
						</span>
						<span className={classNames(s['price_discount'], s['price'])}>
							{`${price - discount} ₽`}
						</span>
					</div>

					{isProductInCart ? (
						<CartCounter productId={id} />
					) : (
						<ProductCartCounter product={product} />
					)}

					<LikeButton product={product} />
					<div className={classNames(s['product__delivery'])}>
						<img src={truckSVG} alt='truck' />
						<div className={classNames(s['product__right'])}>
							<h3 className={classNames(s['product__name'])}>
								Доставка по всему Миру!
							</h3>
							<p className={classNames(s['product__text'])}>
								Доставка курьером — <span className='bold'> от 399 ₽</span>
							</p>
							<p className={classNames(s['product__text'])}>
								Доставка в пункт выдачи —
								<span className={classNames(s['product__bold'])}>
									{' '}
									от 199 ₽
								</span>
							</p>
						</div>
					</div>
					<div className={classNames(s['product__delivery'])}>
						<img src={qualitySVG} alt='quality' />
						<div className={classNames(s['product__right'])}>
							<h3 className={classNames(s['product__name'])}>
								Гарантия качества
							</h3>
							<p className={classNames(s['product__text'])}>
								Если Вам не понравилось качество нашей продукции, мы вернем
								деньги, либо сделаем все возможное, чтобы удовлетворить ваши
								нужды.
							</p>
						</div>
					</div>
				</div>
			</div>
			<div className={classNames(s['product__box'])}>
				<h2 className={classNames(s['product__title'])}>Описание</h2>
				<p className={s['product__subtitle']}>{description}</p>
			</div>
			<ReviewList product={product} />
		</>
	);
});
