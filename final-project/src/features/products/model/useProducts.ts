import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { userSelectors } from '../../../shared/store/slices/user';
import { useAppSelector } from '../../../shared/store/utils';
import { isLiked } from '../../../shared/utils';
import { productsSelectors } from '../../../shared/store/slices/products';
import { useGetProductsQuery } from '../api/productsApi';

const EMPTY_PRODUCTS: Product[] = [];

export const useProducts = () => {
	const { pathname } = useLocation();
	const token = useAppSelector(userSelectors.getAccessToken);

	const { searchText, page, perPage, sort } = useAppSelector(
		productsSelectors.getProductsState
	);

	const isFavoritesPage = pathname === '/favorites';
	const { isLoading, isError, error, data, isFetching, refetch } =
		useGetProductsQuery(
			{
				searchText,
				sort,
				page,
				perPage: isFavoritesPage ? undefined : perPage,
			},
			{ skip: !token }
		);

	const allProducts = data?.products ?? EMPTY_PRODUCTS;
	const userId = useAppSelector(userSelectors.getUser)?.id;
	const products = useMemo(
		() =>
			isFavoritesPage
				? allProducts.filter((product) => isLiked(product.likes, userId))
				: allProducts,
		[allProducts, isFavoritesPage, userId]
	);

	const productsCount = data?.length || 0;

	return {
		products,
		isLoading,
		isError,
		isFetching,
		error,
		productsCount,
		refetch,
	};
};
