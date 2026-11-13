import { WithProtection } from '../../../shared/store/HOCs/WithProtection';
import { ButtonBack } from '../../../shared/ui/ButtonBack';
import { Catalog } from '../../../features/products/CardList';

export const FavoritesPage = WithProtection(() => {
	return (
		<>
			<br />
			<ButtonBack />
			<Catalog title='Избранное' />
		</>
	);
});
