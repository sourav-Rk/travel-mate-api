export interface GuideInstructionWithPackageDto {
  _id?: string;
  guideId: string;
  packageId: string;
  title: string;
  message: string;
  type:
    | "MEETING_POINT"
    | "ITINERARY_UPDATE"
    | "SAFETY_INFO"
    | "REMINDER"
    | "GENERAL";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  location?: {
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
  };
  sentAt?: Date;
  readBy: string[];
  createdAt: Date;
  updatedAt: Date;
  packageDetails?: {
    packageName: string;
    title: string;
    startDate: Date;
    endDate: Date;
    meetingPoint?: string;
    thumbnail?: string;
  };
}
