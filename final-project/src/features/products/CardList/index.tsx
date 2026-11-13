import { WithQuery } from '../../../shared/store/HOCs/WithQuery';
import { useProducts } from '../model/useProducts';
import { CardList } from './ui/CardList';

const CatalogList = WithQuery(CardList);

export function Catalog({ title }: { title: string }) {
	const { products, isLoading, isError, error, refetch } = useProducts();

	return (
		<CatalogList
			title={title}
			products={products}
			isLoading={isLoading}
			isError={isError}
			error={error}
			refetch={refetch}
		/>
	);
}
