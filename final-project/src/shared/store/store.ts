import { configureStore } from '@reduxjs/toolkit';
import AppApi from '../api/ApiServise';
import { rootReducer } from './reducers/rootReducer';
import { authApi } from '../../features/auth/api/authApi';
import { productsApi } from '../../features/products/api/productsApi';

const AUTH_TOKEN_KEY = 'dogfood.authToken';
let savedAccessToken = localStorage.getItem(AUTH_TOKEN_KEY)?.trim() || '';

export const store = configureStore({
	reducer: rootReducer,
	preloadedState: { user: { user: null, accessToken: savedAccessToken } },
	devTools: import.meta.env.DEV,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			thunk: {
				extraArgument: AppApi,
			},
		}).concat([authApi.middleware, productsApi.middleware]),
});

store.subscribe(() => {
	const { accessToken } = store.getState().user;
	if (accessToken === savedAccessToken) return;

	savedAccessToken = accessToken;
	if (accessToken) localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
	else localStorage.removeItem(AUTH_TOKEN_KEY);
});
