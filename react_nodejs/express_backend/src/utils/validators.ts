import FTUser from "../models/FT.user";

export const dateValid = (date: any) => {
    // @ts-ignore
    return (!date || date instanceof Date && !isNaN(date));
};

export const userExists = async (id: number): Promise<boolean> => {
    const currentUser = await FTUser.findOne({where: {id: id}});
    return !!currentUser;
}; 