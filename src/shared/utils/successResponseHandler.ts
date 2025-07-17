
export interface ISuccessResponseHandler<T = any>{
    statusCode:number,
    content:{
        success:boolean,
        message:string,
        data?:T
    }
}

export function successResponseHandler(success:boolean,statusCode:number,message:string,data?:any):ISuccessResponseHandler{
    return {statusCode,content:{success,message,data}};
}