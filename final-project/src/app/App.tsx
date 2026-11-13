import './styles/normalize.css';
import './styles/styles.css';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { authApi, useGetProfileQuery } from '../features/auth/api/authApi';
import { productsApi } from '../features/products/api/productsApi';
import { userActions, userSelectors } from '../shared/store/slices/user';
import { useAppDispatch, useAppSelector } from '../shared/store/utils';
import { Header } from '../widgets/Header';
import { Sort } from '../features/search/Sort';
import { Footer } from '../widgets/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const App = () => {
	const dispatch = useAppDispatch();
	const accessToken = useAppSelector(userSelectors.getAccessToken);
	const user = useAppSelector(userSelectors.getUser);
	const { currentData: profile, error } = useGetProfileQuery(undefined, {
		skip: !accessToken || !!user,
	});

	useEffect(() => {
		if (!accessToken || user) return;

		if (profile) dispatch(userActions.setUser(profile));
		if (
			error &&
			'status' in error &&
			(error.status === 401 || error.status === 403)
		) {
			dispatch(userActions.clearUser());
			dispatch(authApi.util.resetApiState());
			dispatch(productsApi.util.resetApiState());
		}
	}, [accessToken, dispatch, error, profile, user]);

	return (
		<>
			<Header />
			<Sort />
			<Outlet />
			<ToastContainer
				position='top-right'
				autoClose={5000}
				hideProgressBar={false}
				pauseOnHover
				theme='colored'
			/>
			<Footer />
		</>
	);
};
