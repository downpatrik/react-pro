import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../../../shared/store/api/config';

export interface IErrorResponse {
	data: { statusCode: number; message: string; error: string };
	status: number;
}

interface ProductsResponse {
	products: Product[];
	length: number;
}

interface SetLikeResponse {
	like: Like;
}

interface ProductRequest {
	page: number;
	perPage?: number;
	sort: Sort;
	searchText: string;
}

export const productsApi = createApi({
	reducerPath: 'productsApi',
	baseQuery: customBaseQuery,
	tagTypes: ['Products'],
	endpoints: (builder) => ({
		getProducts: builder.query<ProductsResponse, ProductRequest>({
			query: ({ searchText: searchTerm, sort, page, perPage }) => {
				return {
					url: '/products',
					params: {
						sort,
						searchTerm: searchTerm.length ? searchTerm : undefined,
						perPage: perPage ? page * perPage : undefined,
					},
				};
			},
			providesTags: [{ type: 'Products', id: 'list' }],
		}),
		getProduct: builder.query<Product, Pick<Product, 'id'>>({
			query: ({ id }) => ({ url: `/products/${id}` }),
			providesTags: (productFromBE) => [
				{ type: 'Products', id: productFromBE?.id },
			],
		}),

		createReview: builder.mutation<
			Review,
			{ productId: string; text: string; rating: number }
		>({
			query: ({ productId, text, rating }) => ({
				url: `/reviews/leave/${encodeURIComponent(productId)}`,
				method: 'POST',
				body: { text, rating },
			}),
			async onQueryStarted({ productId }, { dispatch, queryFulfilled }) {
				try {
					const { data: review } = await queryFulfilled;
					dispatch(
						productsApi.util.updateQueryData(
							'getProduct',
							{ id: productId },
							(product) => {
								const index = product.reviews.findIndex(
									(item) => item.id === review.id
								);
								if (index === -1) product.reviews.unshift(review);
								else product.reviews[index] = review;
							}
						)
					);
				} catch {
					// A failed request leaves the product cache intact.
				}
			},
		}),

		deleteProduct: builder.mutation<Product, Pick<Product, 'id'>>({
			query: ({ id }) => ({
				url: `/products/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (productFromBE) => [
				{ type: 'Products', id: 'list' },
				{ type: 'Products', id: productFromBE?.id },
			],
		}),
		setLikeProduct: builder.mutation<SetLikeResponse, Pick<Product, 'id'>>({
			query: ({ id }) => ({
				url: `/products/${id}/likes`,
				method: 'PUT',
			}),
		}),
		deleteLikeProduct: builder.mutation<unknown, Pick<Product, 'id'>>({
			query: ({ id }) => ({
				url: `/products/${id}/likes`,
				method: 'DELETE',
			}),
		}),
	}),
});

export const {
	useCreateReviewMutation,
	useGetProductQuery,
	useGetProductsQuery,
	useSetLikeProductMutation,
	useDeleteLikeProductMutation,
} = productsApi;
