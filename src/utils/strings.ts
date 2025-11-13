import type { IClient } from "@/types/client";
import type { User } from "@/types/user";

export const pad = (value: number, length: number = 2) => {
  return value.toString().padStart(length, "0");
};

export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getDisplayName = ({
  salutation = "",
  firstName = "",
  middleName = "",
  lastName = "",
  preferredName = "",
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
  firstName?: string;
  middleName?: string;
  lastName?: string;
}) => {
  return [firstName, middleName, lastName].filter(Boolean).join(" ");
};

export const generateId = () =>
  `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const getUserAvatar = (user?: IClient | User) => {
  if (user?.avatar) return user.avatar;

  const actualName = `${user?.firstName}+${user?.lastName}`;
  return `https://ui-avatars.com/api/?name=${actualName}`;
};
