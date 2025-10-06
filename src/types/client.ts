export type ClientStatus = "prospect" | "active" | "inactive";

export interface IClient {
  id?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  displayName: string;
  gender?: string;
  maritalStatus?: string;
  birthdate?: string;
  address?: string;
  phoneNumber?: string;
  mobileNumber?: string;
  apartmentNumber?: string;
  avatar?: string;
  email?: string;
  religion?: string;
  nationality?: string;
  status: ClientStatus;
  salutation?: string;
  useSalutation: boolean;
}

export type ClientSubmitValues = Partial<IClient> &
  Pick<IClient, "displayName"> &
  Pick<IClient, "useSalutation"> &
  Pick<IClient, "status">;
