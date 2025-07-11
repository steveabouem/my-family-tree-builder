// type genderOptions = "male" | "female";
// type Result<T, E = Error> = Success<T> | Failure<E>;
// // TODO: use the trycatch function everywhere
// type Success<T> = {
//   data: T;
//   error: null;
// };
// type Failure<E> = {
//   data: null;
//   error: E;
// };

// export const getGenderString = (genderCode: number): genderOptions => {
//   if (genderCode === 1) {
//     return "male"
//   }

//   return "female"
// };

// // Main wrapper function
// export async function tryCatch<T, E = Error>(
//   promise: Promise<T>,
// ): Promise<Result<T, E>> {
//   try {
//     const data = await promise;
//     return { data, error: null };
//   } catch (error) {
//     return { data: null, error: error as E };
//   }
// }