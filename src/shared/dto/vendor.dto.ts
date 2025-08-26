export interface VendorProfileDto {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "vendor";
  isBlocked: boolean;
  agencyName: string;
  description?: string;
  profileImage?: string | null;
  status: "pending" | "verified" | "rejected" | "reviewing";
  rejectionReason?: string;
  createdAt: Date;
  
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  } | null;

  kycDetails: {
    pan: string;
    gstin: string;
    registrationNumber: string;
    documents: string[];
  } | null;
}
