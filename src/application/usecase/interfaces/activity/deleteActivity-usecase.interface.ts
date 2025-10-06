export interface IDeleteActivityUsecase{
    execute(itineraryId :string,dayNumber : number,id : string) : Promise<void>;
}