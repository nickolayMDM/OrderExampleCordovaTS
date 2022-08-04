import getProductsPage from "../adapters/serverRequester/getProductPage";
import {useAppSelector, useAppDispatch} from '../redux/hooks';
import {setList} from "../redux/slices/productsSlice";

export const useProductListUpdate = () => {
    const tabName = useAppSelector((state) => state.tab.name);
    const localeCode = useAppSelector((state) => state.language.localeCode);
    const productsFilter = useAppSelector((state) => state.products.filter);
    const dispatch = useAppDispatch();

    return async () => {
        let productsPage = await getProductsPage(productsFilter, localeCode, tabName);
        dispatch(setList(productsPage));
    };
};

export default useProductListUpdate;