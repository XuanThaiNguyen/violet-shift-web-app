export type User = {
  id: string;
  address?: string;
  email: string;
  employmentType: string;
  role: string;
  avatar?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  preferredName?: string;
  phoneNumber?: string;
  mobileNumber?: string;
  birthdate?: string;
  gender?: string;
  salutation?: string;
  joinedAt?: string;
  createdAt: string;
  updatedAt: string;
  hasSetProfile?: boolean;
};

export type CreateUser = Omit<User, "id" | "createdAt" | "updatedAt">;
