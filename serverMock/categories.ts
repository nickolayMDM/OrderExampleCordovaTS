export type Category = {
    ID: number,
    name: {[key: string]: string}
};

let list: Category[] = [
    {
        ID: 0,
        name: {
            en: "Pizzas",
            ua: "Піци"
        }
    },
    {
        ID: 1,
        name: {
            en: "Wok",
            ua: "Wok"
        }
    },
];

export const getAll = (): Category[] => {
    return list;
};

export default {
    getAll
};