export const pad = (value: number, length: number = 2) => {
  return value.toString().padStart(length, "0");
};

export function capitalizeFirstLetter(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
