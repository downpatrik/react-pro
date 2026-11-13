import { useActionState, useOptimistic } from 'react';
import LikeSvg from '../../../../shared/assets/icons/like.svg?react';
import classNames from 'classnames';
import { useStore } from 'react-redux';
import type { RootState } from '../../../../shared/store/types';
import { useAppDispatch, useAppSelector } from '../../../../shared/store/utils';
import { userSelectors } from '../../../../shared/store/slices/user';
import {
	productsApi,
	useSetLikeProductMutation,
	useDeleteLikeProductMutation,
} from '../../api/productsApi';
import { Button } from '../../../../shared/ui/Button';
import { toast } from 'react-toastify';
import styles from './LikeButton.module.css';

export const LikeButton = ({ product }: { product: Product }) => {
	const dispatch = useAppDispatch();
	const store = useStore<RootState>();
	const userId = useAppSelector(userSelectors.getUser)?.id;
	const accessToken = useAppSelector(userSelectors.getAccessToken);
	const [addLike] = useSetLikeProductMutation();
	const [removeLike] = useDeleteLikeProductMutation();
	const liked = product.likes.some((like) => like.userId === userId);
	const [optimistic, showLike] = useOptimistic(liked);

	const [, toggleLike, pending] = useActionState(async () => {
		if (!accessToken || !userId) {
			toast.warning('Войдите, чтобы добавить товар в избранное');
			return null;
		}

		showLike(!liked);
		try {
			const { id } = product;
			let saved: Like | null = null;
			if (liked) {
				await removeLike({ id }).unwrap();
			} else {
				saved = (await addLike({ id }).unwrap()).like;
			}

			const updateLikes = (item: Product) => {
				item.likes = item.likes.filter((like) => like.userId !== userId);
				if (saved) item.likes.push(saved);
			};

			for (const args of productsApi.util.selectCachedArgsForQuery(
				store.getState(),
				'getProducts'
			)) {
				dispatch(
					productsApi.util.updateQueryData(
						'getProducts',
						args,
						({ products }) => {
							const item = products.find((entry) => entry.id === id);
							if (item) updateLikes(item);
						}
					)
				);
			}
			dispatch(
				productsApi.util.updateQueryData('getProduct', { id }, updateLikes)
			);
			toast.success(
				liked ? 'Товар удалён из избранного' : 'Товар добавлен в избранное'
			);
		} catch {
			toast.error('Не удалось изменить избранное. Попробуйте ещё раз.');
		}
		return null;
	}, null);

	return (
		<form action={toggleLike}>
			<Button
				type='submit'
				className={classNames(styles['card__favorite'], {
					[styles['card__favorite_is-active']]: optimistic,
				})}
				aria-label={
					optimistic ? 'Убрать из избранного' : 'Добавить в избранное'
				}
				aria-pressed={optimistic}
				aria-busy={pending}
				disabled={pending}>
				<LikeSvg aria-hidden='true' />
			</Button>
		</form>
	);
};
