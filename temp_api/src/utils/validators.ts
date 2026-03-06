import User from "../models/User";

export const dateValid = (date: any) => {
    // @ts-ignore
    return (!date || date instanceof Date && !isNaN(date));
};

export const userExists = async (id: number): Promise<boolean> => {
    const currentUser = await User.findOne({where: {id: id}});
    return !!currentUser;
}; 