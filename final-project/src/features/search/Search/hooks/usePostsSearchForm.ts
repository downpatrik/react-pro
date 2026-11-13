import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '../../../../shared/hooks/useDebounce';
import { useAppDispatch } from '../../../../shared/store/utils';
import { productsActions } from '../../../../shared/store/slices/products';

export const useProductsSearchForm = () => {
	const dispatch = useAppDispatch();
	const [params, setParams] = useSearchParams();
	const searchValue = params.get('q') ?? '';
	const debounced = useDebounce(searchValue, 400);

	useEffect(() => {
		dispatch(productsActions.setSearchText(debounced));
	}, [debounced, dispatch]);

	function setSearchValue(value: string) {
		const next = new URLSearchParams(params);
		if (value) next.set('q', value);
		else next.delete('q');
		setParams(next, { replace: true });
	}

	return { searchValue, setSearchValue };
};
