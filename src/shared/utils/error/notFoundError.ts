import { CustomError } from "./customError";
import { HTTP_STATUS } from "../../constants";

export class NotFoundError extends CustomError{
    constructor(message : string){
        super(HTTP_STATUS.NOT_FOUND,message);
        this.name = "NotFoundError"
    }
}