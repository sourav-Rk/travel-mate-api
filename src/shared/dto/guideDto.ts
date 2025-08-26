export interface GuideListDto {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  gender: string;
}


//guide profile dto
export interface GuideProfileDto {
   firstName : string;
   lastName : string;
   email : string;
   phone : string;
   alternatePhone : string;
   status : string;
   bio : string;
   dob : string;
   profileImage : string;
   yearOfExperience : string;
   languageSpoken : string[];
   documents : string[];
}