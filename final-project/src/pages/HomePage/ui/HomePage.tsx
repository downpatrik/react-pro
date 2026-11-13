import { WithProtection } from '../../../shared/store/HOCs/WithProtection';
import { LoadMore } from '../../../features/products/LoadMore';
import { Catalog } from '../../../features/products/CardList';

export const HomePage = WithProtection(() => {
	return (
		<>
			<Catalog title='Лакомства' />
			<LoadMore />
		</>
	);
});
