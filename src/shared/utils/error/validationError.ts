import { CustomError } from "./customError";
import { HTTP_STATUS } from "../../constants";

export class ValidationError extends CustomError{
    constructor(message : string){
       super(HTTP_STATUS.BAD_REQUEST,message);
       this.name = "ValidationError"     
    }
}