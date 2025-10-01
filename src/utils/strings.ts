export const pad = (value: number, length: number = 2) => {
  return value.toString().padStart(length, "0");
};