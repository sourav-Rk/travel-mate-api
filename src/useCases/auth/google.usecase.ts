import { inject, injectable } from "tsyringe";
import { IGoogleUsecase } from "../../entities/useCaseInterfaces/auth/google-usecase.interface";
import { IRegisterStrategy } from "./register-strategies/register-strategy.interface";
import { ILoginStrategy } from "./login-strategies/login-strategy.interface";
import {OAuth2Client} from "google-auth-library"
import { IUserEntity } from "../../entities/modelsEntity/user.entity";
import { CustomError } from "../../shared/utils/error/customError";
import { ERROR_MESSAGE, HTTP_STATUS } from "../../shared/constants";
import { IUserExistenceService } from "../../entities/serviceInterfaces/user-existence-service.interface";
import { UserExistenceServive } from "../../interfaceAdapters/services/user-existence.service";

@injectable()
export class GoogleUsecase implements IGoogleUsecase{
    private _registerStrategies : Record<string,IRegisterStrategy>;
    private _loginStrategies : Record <string,ILoginStrategy>;
    private _client : OAuth2Client;
    constructor(
        @inject('ClientRegisterStrategy')
        private _clientRegisterStrategy : IRegisterStrategy,

        @inject('ClientGoogleLoginStrategy')
        private _clientLogin : ILoginStrategy,

        @inject('IUserExistenceService')
        private _userExistenceService : IUserExistenceService
    ){
        this._registerStrategies = {
            client : this._clientRegisterStrategy
        };
        this._loginStrategies = {
            client : this._clientLogin
        };
        this._client = new OAuth2Client();
    }

    async execute(credential: any, client_id: any, role: any): Promise<Partial<IUserEntity>> {
        const registerStrategy = this._registerStrategies[role];
        const loginStrategy = this._loginStrategies[role];

        if(!registerStrategy || !loginStrategy){
            throw new CustomError(HTTP_STATUS.FORBIDDEN,"Invalid user role");
        }

        const ticket = await this._client.verifyIdToken({
            idToken : credential,
            audience : client_id,
        });

        const payload = ticket.getPayload();

        if(!payload){
            throw new CustomError(HTTP_STATUS.UNAUTHORIZED,"Invalid or empty token payload")
        };

        const googleId = payload.sub;
        const email = payload.email;
        const firstName = payload.given_name;
        const lastName = payload.family_name;
        const profileImage = payload.picture;

        if(!email) throw new CustomError(HTTP_STATUS.BAD_REQUEST,"Email is required");

        const existingUser = await loginStrategy.login({email,role});



        if(!existingUser){
            if(payload.email){
                    if(await this._userExistenceService.emailExists(payload?.email)){
                throw new CustomError(HTTP_STATUS.CONFLICT,"This email is alreday registered under a different role . Please use a different Google account");
            }
            }
            
      
           
            const newUser = await registerStrategy.register({
                firstName : firstName as string,
                lastName : lastName as string,
                role,
                googleId : googleId,
                email,
                profileImage,
            });
            console.log(newUser)

            if(!newUser) throw new CustomError(0,"");

            return {email,role,_id:newUser._id}
        };

        return {email,role,_id : existingUser._id}

    }
}