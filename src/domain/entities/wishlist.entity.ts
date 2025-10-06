export interface IWishlistEntity {
    _id : string;
    userId : string;
    packages : string[];
    createdAt ?: Date;
    updatedAt ?: Date;
}