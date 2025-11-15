import { IPackageEntity } from "../../../domain/entities/package.entity";

export interface PackageDetailsWishlistDto{
    _id : string;
    packageId ?: string;
    packageName : string;
    title : string;
    category : string;
    tags : string[];
    images : string[];
    price : string;
    duration : {days : number;nights : number;};
    applicationDeadline ?: string;
    status ?: string;
    startDate : string;
    endDate : string;
}

export interface WishlistDto {
    userId : string;
    packages : PackageDetailsWishlistDto[];
}

// Wishlist Aggregation Result
    export interface IWishlistAggregationResult {
    _id: string;
    userId: string;
    packages: string[]; 
    packagesDetails: IPackageEntity[];
    createdAt?: Date;
    updatedAt?: Date;
    }