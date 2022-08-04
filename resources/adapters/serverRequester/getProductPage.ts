import validators from "../../helpers/validators";
import * as productsMock from "../../../serverMock/products";

export type GetProductPage = (
    {
        page,
        limit,
        searchQuery,
        categoryID
    }: ProductPageFilterParameters,
    localeCode?: string,
    tab?: string
) => Promise<Product[]>;

export const getProductsPage = async (
    {
        page,
        limit,
        searchQuery,
        categoryID,
    }: ProductPageFilterParameters,
    localeCode?: string,
    tab?: string
): Promise<Product[]> => {
    if (!validators.isPositiveInteger(page)) {
        page = undefined;
    }
    if (!validators.isPositiveInteger(limit)) {
        limit = undefined;
    }
    if (!validators.isInt(categoryID)) {
        categoryID = undefined;
    }
    if (!validators.isPopulatedString(tab)) {
        tab = undefined;
    }

    return productsMock.getPage({
        page,
        limit,
        searchQuery,
        categoryID,
        tab,
        localeCode
    });
};

export default getProductsPage;