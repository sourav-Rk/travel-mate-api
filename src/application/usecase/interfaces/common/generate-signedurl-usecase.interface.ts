export interface IGenerateSignedUrlUsecase{
    execute(publicId : string,expiresIn : string) : Promise<string>;
    executeMultiple(publicIds: string[], expiresIn: number): Promise<string[]>;
}