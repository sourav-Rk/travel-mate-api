export interface IPayFullAmountUsecase{
    execute(bookingId : string,amount : number) : Promise<{url : string,sessionId : string}>;
}