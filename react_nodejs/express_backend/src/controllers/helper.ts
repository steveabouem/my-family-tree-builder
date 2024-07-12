type genderOptions = "male" | "female";
export const getGenderString = (genderCode: number): genderOptions => {
  if (genderCode === 1) {
    return "male"
  }

  return "female"
};
