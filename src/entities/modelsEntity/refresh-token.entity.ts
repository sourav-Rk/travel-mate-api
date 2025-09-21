export interface IRefreshTokenEntity{
    _id?:string,
    token:string,
    userId:string,
    createdAt:Date,
    updatedAt:Date,
    expiry:Date
}