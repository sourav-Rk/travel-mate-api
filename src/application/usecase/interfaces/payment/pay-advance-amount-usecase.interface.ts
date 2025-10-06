export interface IPayAdvanceAmountUsecase {
    execute(bookingId : string,amount : number) : Promise<{url : string,sessionId : string}>;
}