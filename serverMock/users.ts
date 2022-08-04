export type User = {
    ID: number,
    name: string,
    status: string
};

const list: User[] = [
    {
        ID: 1,
        name: "",
        status: "guest",
    },
    {
        ID: 2,
        name: "Authorized account",
        status: "authorized",
    }
];

export const getUserByID = (userID: number): User => {
    for (let key in list) {
        if (!list.hasOwnProperty(key)) continue;

        if (list[key].ID === userID) {
            return list[key];
        }
    }

    return null;
};

export default {
    getUserByID
};