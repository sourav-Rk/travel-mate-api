import { IVendorEntity } from "../../entities/modelsEntity/vendor.entity";
import { VendorDto } from "../../shared/dto/user.dto";
import { VendorProfileDto } from "../../shared/dto/vendor.dto";

export class VendorMapper {
  static mapVendorToAdminTableDto(doc: IVendorEntity): VendorDto {
    return {
      _id: doc._id,
      agencyName: doc.agencyName,
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      profileImage: doc.profileImage,
      role: doc.role as "vendor",
      status: doc.status,
      phone: doc.phone ?? "N/A",
    };
  }

  static mapVendorToFullInfoDto(doc: any): VendorProfileDto {
    return {
      _id: doc._id.toString(),
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      phone: doc.phone,
      role: "vendor",
      isBlocked: doc.isBlocked ?? false,
      agencyName: doc.agencyName,
      description: doc.description ?? "",
      profileImage: doc.profileImage ?? null,
      status: doc.status,
      rejectionReason: doc.rejectionReason ?? undefined,
      createdAt: doc.createdAt,

      address: doc.address
        ? {
            street: doc.address.street,
            city: doc.address.city,
            state: doc.address.state,
            pincode: doc.address.pincode,
            country: doc.address.country,
          }
        : null,

      kycDetails: doc.kycDetails
        ? {
            pan: doc.kycDetails.pan,
            gstin: doc.kycDetails.gstin,
            registrationNumber: doc.kycDetails.registrationNumber,
            documents: doc.kycDetails.documents,
          }
        : null,
    };
  }
}
