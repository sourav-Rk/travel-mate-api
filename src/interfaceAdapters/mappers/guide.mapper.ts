import { profile } from "console";
import { IGuideEntity } from "../../entities/modelsEntity/guide.entity";
import { GuideListDto, GuideProfileDto } from "../../shared/dto/guideDto";
import { GuideDto } from "../../shared/dto/user.dto";

export class GuideMapper {
  static mapGuideToVendorTableDto(doc: IGuideEntity): GuideListDto {
    return {
      _id: doc._id,
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      gender: doc.gender ?? "N/A",
      phone: doc.phone ?? "N/A",
      status: doc.status ?? "N/A",
      alternatePhone : doc.alternatePhone,
      languageSpoken : doc.languageSpoken,
      yearOfExperience : doc.yearOfExperience,
      profileImage : doc.profileImage ?? "",
      isAvailable : doc.isAvailable

    };
  }

  static mapGuideToVendorViewDto(doc: IGuideEntity): GuideDto {
    return {
      _id: doc._id,
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      phone: doc.phone ?? "N/A",
      alternatePhone: doc.alternatePhone ?? "N/A",
      gender: doc.gender ?? "N/A",
      dob: doc.dob ? new Date(doc.dob).toString() : "N/A",
      yearOfExperience: doc.yearOfExperience,
      languageSpoken: doc.languageSpoken,
      bio: doc.bio,
      documents: doc.documents,
      profileImage: doc.profileImage,
      role: "guide",
      isAvailable : doc.isAvailable,
    };
  }

  static mapToGuideProfile(doc: IGuideEntity): GuideProfileDto {
    return {
      firstName: doc.firstName,
      lastName: doc.lastName,
      phone: doc.phone ?? "",
      alternatePhone: doc.alternatePhone,
      bio: doc.bio,
      dob: String(doc.dob),
      email: doc.email,
      profileImage: doc.profileImage ?? "",
      languageSpoken: doc.languageSpoken,
      yearOfExperience: doc.yearOfExperience,
      status: doc.status ?? "",
      documents: doc.documents,
    };
  }
}
