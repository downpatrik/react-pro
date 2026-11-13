import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { RootState } from '../types';

export const customBaseQuery = fetchBaseQuery({
	baseUrl: __API_URL__,
	prepareHeaders: (headers, { getState }) => {
		const accessToken = (getState() as RootState).user.accessToken;

		if (accessToken) {
			headers.set('authorization', accessToken);
		}
		return headers;
	},
});
