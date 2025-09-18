export interface IAddToWishListUsecase {
    execute(userId : string,packageId : string) : Promise<void>;
}