export const dateValid = (date: any) => {
    // @ts-ignore
    return (!date || date instanceof Date && !isNaN(date));
}