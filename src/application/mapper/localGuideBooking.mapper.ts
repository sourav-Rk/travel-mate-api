import { ILocalGuideBookingEntity } from "../../domain/entities/local-guide-booking.entity";
import { ILocalGuideBookingModel } from "../../infrastructure/database/models/local-guide-booking.model";
import { LocalGuideBookingDto } from "../dto/response/local-guide-booking.dto";

type LocalGuideBookingModelWithMeta = ILocalGuideBookingModel & {
  guideName?: string;
  guideProfileImage?: string;
  travellerName?: string;
  travellerProfileImage?: string;
};

export class LocalGuideBookingMapper {
    static toEntity(
        doc: LocalGuideBookingModelWithMeta
      ): ILocalGuideBookingEntity {
        return {
          _id: doc._id.toString(),
          bookingId: doc.bookingId,
          travellerId: doc.travellerId.toString(),
          guideId: doc.guideId.toString(),
          guideProfileId: doc.guideProfileId.toString(),
          quoteId: doc.quoteId,
          guideChatRoomId: doc.guideChatRoomId.toString(),
          sessionDate: doc.sessionDate,
          sessionTime: doc.sessionTime,
          hours: doc.hours,
          hourlyRate: doc.hourlyRate,
          totalAmount: doc.totalAmount,
          location: doc.location,
          notes: doc.notes,
          status: doc.status,
          advancePayment: {
            amount: doc.advancePayment.amount,
            paid: doc.advancePayment.paid,
            dueDate: doc.advancePayment.dueDate,
            paidAt: doc.advancePayment.paidAt || null,
          },
          fullPayment: {
            amount: doc.fullPayment.amount,
            paid: doc.fullPayment.paid,
            dueDate: doc.fullPayment.dueDate || null,
            paidAt: doc.fullPayment.paidAt || null,
          },
          serviceCompletedAt: doc.serviceCompletedAt,
          completionNotes: doc.completionNotes,
          completionRating: doc.completionRating,
          cancelledAt: doc.cancelledAt,
          cancellationRequest: doc.cancellationRequest,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
          guideName: doc.guideName,
          guideProfileImage: doc.guideProfileImage,
          travellerName: doc.travellerName,
          travellerProfileImage: doc.travellerProfileImage,
        };
      }

    static toDto(doc : ILocalGuideBookingEntity) : LocalGuideBookingDto{
         return {
          _id : String(doc._id),
          bookingId : doc.bookingId,
          guideId : String(doc.guideId),
          travellerId : String(doc.travellerId),
          guideProfileId : String(doc.guideProfileId),
          guideChatRoomId : String(doc.guideChatRoomId),
          hourlyRate : doc.hourlyRate,
          hours : doc.hours,
          quoteId : doc.quoteId,
          sessionDate : doc.sessionDate.toISOString(),
          sessionTime : doc.sessionTime,
          status : doc.status,
          totalAmount : doc.totalAmount,
          advancePayment :  {
            amount : doc.advancePayment.amount,
            dueDate : doc.advancePayment.dueDate.toISOString(),
            paid : doc.advancePayment.paid,
            paidAt : doc.advancePayment.paidAt?.toISOString()
          },
          fullPayment : {
            amount : doc.fullPayment.amount,
            paid : doc.fullPayment.paid,
            dueDate : doc.fullPayment.dueDate?.toISOString(),
            paidAt : doc.fullPayment.paidAt?.toISOString()
          },
          createdAt : doc.createdAt?.toISOString()??"",
          updatedAt : doc.updatedAt?.toISOString()??"",
          cancellationRequest : doc.cancellationRequest? {
            reason : doc.cancellationRequest?.reason,
            requestedAt : doc.cancellationRequest.requestedAt.toISOString(),
            approvedAt : doc.cancellationRequest.approvedAt?.toISOString(),
            calculatedRefund : doc.cancellationRequest.calculatedRefund
          }:null,
          cancelledAt : doc.cancelledAt?.toISOString(),
          location : doc.location,
          notes : doc.notes,
          serviceCompletedAt : doc.serviceCompletedAt?.toISOString(),
          completionNotes : doc.completionNotes,
          completionRating : doc.completionRating,
          guideName: doc.guideName,
          guideProfileImage: doc.guideProfileImage,
          travellerName: doc.travellerName,
          travellerProfileImage: doc.travellerProfileImage



         }
    }
}
