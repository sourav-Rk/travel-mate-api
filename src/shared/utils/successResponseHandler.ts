
export interface ISuccessResponseHandler<T = unknown>{
    statusCode:number,
    content:{
        success:boolean,
        message:string,
        data?:T
    }
}

export function successResponseHandler(success:boolean,statusCode:number,message:string,data?:unknown):ISuccessResponseHandler{
    return {statusCode,content:{success,message,data}};
}