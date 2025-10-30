import { ROLE_IDS } from "./roles";

export const employmentTypeOptions = [
  { label: "Full Time", value: "full_time" },
  { label: "Part Time", value: "part_time" },
  { label: "Casual", value: "casual" },
  { label: "Contractor", value: "contractor" },
];

export const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Intersex", value: "intersex" },
  { label: "Non-binary", value: "non_binary" },
  { label: "Unspecified", value: "unspecified" },
  { label: "Prefer not to say", value: "other" },
];

export const roleOptions = {
  carer: [{ name: "Carer", value: ROLE_IDS.CARER }],
  officer: [
    { name: "HR", value: ROLE_IDS.HR },
    { name: "Admin", value: ROLE_IDS.ADMIN },
    { name: "Coordinator", value: ROLE_IDS.COORDINATOR },
    { name: "Office Support", value: ROLE_IDS.OFFICE_SUPPORT },
  ],
};

export const statusTypeOptions = [
  { label: "Prospect", value: "prospect" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export const ageTypeOptions = [
  { label: "Adult", value: "adult" },
  { label: "Children", value: "children" },
];
