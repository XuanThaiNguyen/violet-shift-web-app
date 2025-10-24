export const ROLE_IDS = {
  CARER: "66fe5a3e9a0c8a0012a00001",
  HR: "66fe5a3e9a0c8a0012a00002",
  ADMIN: "66fe5a3e9a0c8a0012a00003",
  COORDINATOR: "66fe5a3e9a0c8a0012a00004",
  OFFICE_SUPPORT: "66fe5a3e9a0c8a0012a00005",
} as const;

export const ROLES = {
  [ROLE_IDS.CARER]: "Carrier",
  [ROLE_IDS.HR]: "HR",
  [ROLE_IDS.ADMIN]: "Admin",
  [ROLE_IDS.COORDINATOR]: "Coordinator",
  [ROLE_IDS.OFFICE_SUPPORT]: "Office Support",
} as const;
