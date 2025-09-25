export interface GuideListDto {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  gender: string;
  alternatePhone : string;
  languageSpoken : string[];
  yearOfExperience : string;
  profileImage : string;
  isAvailable : boolean
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

//guide profile details for client
export interface GuideDetailsForClientDto{
  _id : string;
  firstName : string;
  lastName : string;
  email : string;
  phone : string;
  alternatePhone : string;
  bio : string;
  profileImage : string;
  yearOfExperience : string;
  languageSpoken : string[];
  totalTrips : number;
}