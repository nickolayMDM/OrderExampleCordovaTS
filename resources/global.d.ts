declare global {
    interface ProductPageFilterParameters {
        page?: number,
        limit?: number,
        searchQuery?: string,
        categoryID?: number,
        tab?: string
    }

    interface Product {
        ID: number,
        name: { [key: string]: string },
        description: { [key: string]: string },
        imageName: string,
        categoryID: number,
        price: number,
        inWishlist: boolean,
        inCart: number,
        shouldShowOutsideOfCategory?: boolean
    }
}

export {};