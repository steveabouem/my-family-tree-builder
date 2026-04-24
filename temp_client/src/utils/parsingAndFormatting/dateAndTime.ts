import dayjs from "dayjs";

export const getAge = (stringDate?: string | null) => {
  if (!stringDate) {
    return 0;
  }
  const now = dayjs();
  const then = dayjs(stringDate);
  return (now.diff(then, "years"));
}