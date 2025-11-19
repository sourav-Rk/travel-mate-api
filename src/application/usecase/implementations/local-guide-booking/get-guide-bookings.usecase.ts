import { inject, injectable } from "tsyringe";

import { ILocalGuideBookingRepository } from "../../../../domain/repositoryInterfaces/local-guide-booking/local-guide-booking-repository.interface";
import {
  IGetLocalGuideBookingsForGuideUsecase,
  LocalGuideBookingListFilters,
  LocalGuideBookingListResult,
} from "../../interfaces/local-guide-booking/get-guide-bookings.interface";
import { LocalGuideBookingMapper } from "../../../mapper/localGuideBooking.mapper";
import { ValidationError } from "../../../../domain/errors/validationError";
import { ERROR_MESSAGE } from "../../../../shared/constants";
import { IClientRepository } from "../../../../domain/repositoryInterfaces/client/client.repository.interface";
import { NotFoundError } from "../../../../domain/errors/notFoundError";

@injectable()
export class GetLocalGuideBookingsForGuideUsecase
  implements IGetLocalGuideBookingsForGuideUsecase
{
  constructor(
    @inject('IClientRepository')
    private readonly _clientRepository : IClientRepository,
    @inject("ILocalGuideBookingRepository")
    private readonly _localGuideBookingRepository: ILocalGuideBookingRepository
  ) {}

  async execute(
    clientId : string,
    filters: LocalGuideBookingListFilters
  ): Promise<LocalGuideBookingListResult> {
    
    if(!clientId){
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const client = await this._clientRepository.findById(clientId);

    if(!client){
      throw new NotFoundError(ERROR_MESSAGE.USER_NOT_FOUND);
    }

    if(!client.localGuideProfileId){
      throw new ValidationError(ERROR_MESSAGE.LOCAL_GUIDE.NOT_VERIFIED_LOCAL_GUIDE);
    }

    const { bookings, pagination, summary } =
      await this._localGuideBookingRepository.findGuideBookingsWithFilters(
        client.localGuideProfileId,
        filters
      );

    return {
      bookings: bookings.map(LocalGuideBookingMapper.toDto),
      pagination,
      summary,
    };
  }
}


