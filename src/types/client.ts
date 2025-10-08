export type ClientStatus = "prospect" | "active" | "inactive";

export interface IClient {
  id?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  preferredName?: string;
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
}

export type ClientSubmitValues = Partial<IClient> &
  Pick<IClient, "firstName"> &
  Pick<IClient, "lastName"> &
  Pick<IClient, "status">;
