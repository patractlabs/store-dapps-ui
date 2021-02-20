export const sec2time = (s: number): string => {
  return `${s / 60} : ${s % 60}`;
};
