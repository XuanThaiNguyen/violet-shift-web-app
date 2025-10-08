export const pad = (value: number, length: number = 2) => {
  return value.toString().padStart(length, "0");
};

export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getDisplayName = ({
  salutation,
  firstName,
  middleName,
  lastName,
  preferredName,
}: {
  salutation?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  preferredName?: string;
}) => {
  const baseName =
    preferredName?.trim() ||
    [firstName, middleName, lastName].filter(Boolean).join(" ");

  return salutation && salutation?.length > 0
    ? `${salutation}. ${baseName}`.trim()
    : baseName;
};

export const getFullName = ({
  firstName = "",
  middleName = "",
  lastName = "",
}: {
  firstName: string;
  middleName?: string;
  lastName: string;
}) => {
  return [firstName, middleName, lastName].filter(Boolean).join(" ");
};
