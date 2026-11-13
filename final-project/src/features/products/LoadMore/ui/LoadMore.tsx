import { Alert, Stack } from '@mui/material';
import { Spinner } from '../../../../shared/ui/Spinner';
import { useRef } from 'react';
import { useLoadMore } from '../hooks/useLoadMore';

export const LoadMore = () => {
	const ref = useRef<HTMLDivElement>(null);
	const { isEndOfList, isFetching } = useLoadMore({ ref });

	return (
		<Stack
			ref={ref}
			direction='row'
			justifyContent='center'
			alignItems='center'
			sx={{ my: 5 }}>
			{isFetching && <Spinner />}
			{isEndOfList && <Alert severity='success'>Все товары загружены</Alert>}
		</Stack>
	);
};
