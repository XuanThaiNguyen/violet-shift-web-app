export type AvailabilityTypeEnum = "available" | "unavailable";

export interface IAvailibility {
  staff: string;
  type?: AvailabilityTypeEnum;
  from: number; // 0 -> 1440
  to: number; // 0 -> 1440
  note?: string;
  isApproved?: boolean;
  isDeleted?: boolean;
  _id: string;
}
