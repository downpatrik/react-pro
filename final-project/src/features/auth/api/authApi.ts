import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../../../shared/store/api/config';
import { SignUpFormValues } from '../SignUpForm/utils/types';

type SignUpResponse = {
	user: Pick<User, 'id' | 'email'>;
	accessToken: Token['accessToken'];
};

type SignInResponse = {
	user: Pick<User, 'id' | 'email'>;
	accessToken: Token['accessToken'];
};

export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: customBaseQuery,
	tagTypes: ['Profile'],
	endpoints: (builder) => ({
		getProfile: builder.query<User, void>({
			query: () => '/users/me',
			providesTags: ['Profile'],
		}),
		updateProfile: builder.mutation<
			User,
			Partial<Pick<User, 'name' | 'about' | 'avatarPath' | 'email'>> & {
				password?: string;
			}
		>({
			query: (body) => ({ url: '/users/me', method: 'PATCH', body }),
			invalidatesTags: (_result, error) => (error ? [] : ['Profile']),
		}),
		signUp: builder.mutation<SignUpResponse, SignUpFormValues>({
			query: (signUpFormValues) => ({
				url: '/auth/register',
				method: 'POST',
				body: signUpFormValues,
			}),
		}),
		signIn: builder.mutation<SignInResponse, SignUpFormValues>({
			query: (signInFormValues) => ({
				url: '/auth/login',
				method: 'POST',
				body: signInFormValues,
			}),
		}),
	}),
});

export const {
	useSignInMutation,
	useSignUpMutation,
	useGetProfileQuery,
	useUpdateProfileMutation,
} = authApi;
