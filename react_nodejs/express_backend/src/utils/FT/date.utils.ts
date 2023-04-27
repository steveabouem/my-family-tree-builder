export const dateValid = (p_date: any) => {
    // @ts-ignore
    return (!p_date || p_date instanceof Date && !isNaN(p_date));
}