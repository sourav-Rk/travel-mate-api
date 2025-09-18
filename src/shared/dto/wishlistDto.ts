export interface PackageDetailsWishlistDto{
    _id : string;
    packageName : string;
    title : string;
    category : string;
    tags : string;
    images : string[];
    price : string;
    duration : {days : number;nights : number;};
    applicationDeadline : string;
    status : string;
    startDate : string;
    endDate : string;
}

export interface WishlistDto {
    userId : string;
    packages : PackageDetailsWishlistDto[];
}