import { FUNDING_ERROR_CODE } from "@/constants/errorMsg";

export const CLIENT_FUNDING_COLUMS = [
  { name: "Name", uid: "name" },
  { name: "Starts", uid: "starts" },
  { name: "Expires", uid: "expires" },
  { name: "Amount", uid: "amount" },
  { name: "Balance", uid: "balance" },
  { name: "Default", uid: "default" },
  { name: "", uid: "actions" },
];

export const ClientFundingMessages = {
  [FUNDING_ERROR_CODE.INVALID_REQUEST]: "Invalid request",
  [FUNDING_ERROR_CODE.FUNDING_NOT_FOUND]: "Funding not found",
  [FUNDING_ERROR_CODE.FUNDING_IS_EXISTING]: "Funding is existing",
  [FUNDING_ERROR_CODE.INTERNAL_SERVER_ERROR]: "Internal server error",
};
