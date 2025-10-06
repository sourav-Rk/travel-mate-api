export interface IHandleStripeWebHookUsecase {
    execute(payload: Buffer, signature: string, endpointSecret: string) : Promise<void>;
}