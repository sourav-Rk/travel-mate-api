import { inject, injectable } from "tsyringe";
import { ValidationError } from "../../../shared/utils/error/validationError";
import { ERROR_MESSAGE } from "../../../shared/constants";
import { IBookingRepository } from "../../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { BookingMapper } from "../../../interfaceAdapters/mappers/booking.mapper";
import { NotFoundError } from "../../../shared/utils/error/notFoundError";
import { BookingDetailsWithUserDetailsDto, BookingListWithUserDetailsDto } from "../../../shared/dto/bookingDto";
import { IGetBookingDetailsGuideUsecase } from "../../../entities/useCaseInterfaces/booking/guide-booking/get-booking-details-guide-usecase.interface";
import { IGuideRepository } from "../../../entities/repositoryInterfaces/guide/guide-repository.interface";

@injectable()
export class GetBookingDetailsGuideUsecase
  implements IGetBookingDetailsGuideUsecase
{
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,

    @inject('IGuideRepository')
    private _guideRepository : IGuideRepository
  ) {}

  async execute(bookingId: string,guideId : string): Promise<BookingDetailsWithUserDetailsDto| null> {
    if (!bookingId || !guideId) {
      throw new ValidationError(ERROR_MESSAGE.ID_REQUIRED);
    }

    const guide = await this._guideRepository.findById(guideId);

    if(!guide){
       throw new NotFoundError(ERROR_MESSAGE.GUIDE_NOT_FOUND);
    }

    const bookingDetails = await this._bookingRepository.findByBookingIdWithUserDetails(
      bookingId
    );

    if (!bookingDetails) {
      throw new NotFoundError(ERROR_MESSAGE.BOOKING_NOT_FOUND);
    }

    return BookingMapper.mapToBookingDetailsWithUserDetailsDto(bookingDetails as BookingListWithUserDetailsDto);
  }
}
