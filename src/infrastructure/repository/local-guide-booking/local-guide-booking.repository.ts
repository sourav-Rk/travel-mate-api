import { injectable } from "tsyringe";
import { PipelineStage, Types } from "mongoose";

import { ILocalGuideBookingEntity } from "../../../domain/entities/local-guide-booking.entity";
import { ILocalGuideBookingRepository } from "../../../domain/repositoryInterfaces/local-guide-booking/local-guide-booking-repository.interface";
import {
  localGuideBookingDB,
  ILocalGuideBookingModel,
} from "../../database/models/local-guide-booking.model";
import { BaseRepository } from "../baseRepository";
import { LocalGuideBookingMapper } from "../../../application/mapper/localGuideBooking.mapper";
import {
  LocalGuideBookingCategory,
  LocalGuideBookingListFilters,
  LocalGuideBookingStatus,
  LocalGuidePaymentFilter,
} from "../../../shared/constants";

const PENDING_STATUSES: LocalGuideBookingStatus[] = [
  "QUOTE_ACCEPTED",
  "ADVANCE_PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
];

const COMPLETED_STATUSES: LocalGuideBookingStatus[] = [
  "COMPLETED",
  "FULLY_PAID",
  "CANCELLED",
];

type SummaryRow = {
  _id: LocalGuideBookingStatus;
  count: number;
};

@injectable()
export class LocalGuideBookingRepository
  extends BaseRepository<ILocalGuideBookingModel, ILocalGuideBookingEntity>
  implements ILocalGuideBookingRepository
{
  constructor() {
    super(localGuideBookingDB, LocalGuideBookingMapper.toEntity);
  }

  async create(
    booking: Omit<
      ILocalGuideBookingEntity,
      "_id" | "bookingId" | "createdAt" | "updatedAt"
    >
  ): Promise<ILocalGuideBookingEntity> {
    const created = await localGuideBookingDB.create({
      ...booking,
      travellerId: new Types.ObjectId(booking.travellerId),
      guideId: new Types.ObjectId(booking.guideId),
      guideProfileId: new Types.ObjectId(booking.guideProfileId),
      guideChatRoomId: new Types.ObjectId(booking.guideChatRoomId),
    });
    return LocalGuideBookingMapper.toEntity(created);
  }

  async findByBookingId(
    bookingId: string
  ): Promise<ILocalGuideBookingEntity | null> {
    const booking = await localGuideBookingDB.findOne({ bookingId }).lean();
    return booking
      ? LocalGuideBookingMapper.toEntity(booking as ILocalGuideBookingModel)
      : null;
  }

  async findByQuoteId(
    quoteId: string
  ): Promise<ILocalGuideBookingEntity | null> {
    const booking = await localGuideBookingDB.findOne({ quoteId }).lean();
    return booking
      ? LocalGuideBookingMapper.toEntity(booking as ILocalGuideBookingModel)
      : null;
  }

  async findByTravellerId(
    travellerId: string
  ): Promise<ILocalGuideBookingEntity[]> {
    const bookings = await localGuideBookingDB
      .find({ travellerId: new Types.ObjectId(travellerId) })
      .sort({ createdAt: -1 })
      .lean();
    return bookings.map((b) =>
      LocalGuideBookingMapper.toEntity(b as ILocalGuideBookingModel)
    );
  }

  async findByGuideId(guideId: string): Promise<ILocalGuideBookingEntity[]> {
    const bookings = await localGuideBookingDB
      .find({ guideProfileId: new Types.ObjectId(guideId) })
      .sort({ createdAt: -1 })
      .lean();
    return bookings.map((b) =>
      LocalGuideBookingMapper.toEntity(b as ILocalGuideBookingModel)
    );
  }

  async findByGuideChatRoomId(
    guideChatRoomId: string
  ): Promise<ILocalGuideBookingEntity | null> {
    const booking = await localGuideBookingDB
      .findOne({ guideChatRoomId: new Types.ObjectId(guideChatRoomId) })
      .lean();
    return booking
      ? LocalGuideBookingMapper.toEntity(booking as ILocalGuideBookingModel)
      : null;
  }

  async checkOverlaps(
    guideId: string,
    sessionDate: Date,
    sessionTime: string,
    hours: number,
    excludeBookingId?: string
  ): Promise<ILocalGuideBookingEntity[]> {
    // Convert sessionTime (HH:mm) to Date for comparison
    const [timeHours, timeMinutes] = sessionTime.split(":").map(Number);
    const sessionDateTime = new Date(sessionDate);
    sessionDateTime.setHours(timeHours, timeMinutes, 0, 0);

    // Calculate end time (sessionDateTime + hours)
    const endDateTime = new Date(sessionDateTime);
    endDateTime.setHours(endDateTime.getHours() + hours);

    // Get start and end of day for date filtering
    const startOfDay = new Date(sessionDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(sessionDate);
    endOfDay.setHours(23, 59, 59, 999);

    const query: Record<string, unknown> = {
      guideId: new Types.ObjectId(guideId),
      status: {
        $in: ["QUOTE_ACCEPTED", "ADVANCE_PENDING", "CONFIRMED", "IN_PROGRESS"],
      },
      sessionDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    };

    if (excludeBookingId) {
      query._id = { $ne: new Types.ObjectId(excludeBookingId) };
    }

    const bookings = await localGuideBookingDB.find(query).lean();

    // Filter by time overlap
    const overlappingBookings = bookings.filter((booking) => {
      const bookingTime = booking.sessionTime.split(":").map(Number);
      const bookingStart = new Date(booking.sessionDate);
      bookingStart.setHours(bookingTime[0], bookingTime[1], 0, 0);
      const bookingEnd = new Date(bookingStart);
      bookingEnd.setHours(bookingEnd.getHours() + booking.hours);

      // Check if sessions overlap
      return (
        (sessionDateTime >= bookingStart && sessionDateTime < bookingEnd) ||
        (endDateTime > bookingStart && endDateTime <= bookingEnd) ||
        (sessionDateTime <= bookingStart && endDateTime >= bookingEnd)
      );
    });

    return overlappingBookings.map((b) =>
      LocalGuideBookingMapper.toEntity(b as ILocalGuideBookingModel)
    );
  }

  async updateByBookingId(
    id: string,
    data: Partial<ILocalGuideBookingEntity>
  ): Promise<ILocalGuideBookingEntity | null> {
    const updateData: Record<string, unknown> = { ...data };

    // Convert string IDs to ObjectIds if present
    if (data.travellerId) {
      updateData.travellerId = new Types.ObjectId(data.travellerId);
    }
    if (data.guideId) {
      updateData.guideId = new Types.ObjectId(data.guideId);
    }
    if (data.guideProfileId) {
      updateData.guideProfileId = new Types.ObjectId(data.guideProfileId);
    }
    if (data.guideChatRoomId) {
      updateData.guideChatRoomId = new Types.ObjectId(data.guideChatRoomId);
    }

    const updated = await localGuideBookingDB
      .findOneAndUpdate({ bookingId: id }, updateData, { new: true })
      .lean();
    return updated
      ? LocalGuideBookingMapper.toEntity(updated as ILocalGuideBookingModel)
      : null;
  }

  async findWithFilters(
    travellerId: string,
    filters: LocalGuideBookingListFilters
  ): Promise<{
    bookings: ILocalGuideBookingEntity[];
    pagination: {
      total: number;
      totalPages: number;
      page: number;
      limit : number;
    };
    summary: {
      pendingCount: number;
      completedCount: number;
    };
  }> {
    const {
      category = "pending",
      status,
      paymentStatus,
      search,
      from,
      to,
      page = 1,
      limit = 10,
    } = filters;

    const categoryValue: LocalGuideBookingCategory =
      category === "completed" ? "completed" : "pending";
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.min(Math.max(limit, 1), 50);

    const matchStage: PipelineStage.Match["$match"] = {
      travellerId: new Types.ObjectId(travellerId),
    };

    /** Status filter (applies to summary + data) */
    if (status) {
      matchStage.status = status;
    }

    /** Date Range */
    if (from) {
      matchStage.sessionDate = {
        ...(matchStage.sessionDate || {}),
        $gte: new Date(from),
      };
    }
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      matchStage.sessionDate = {
        ...(matchStage.sessionDate || {}),
        $lte: toDate,
      };
    }

    /** Payment Filter */
    if (paymentStatus) {
      const paymentFilters = this.mapPaymentFilters(paymentStatus);
      Object.assign(matchStage, paymentFilters);
    }

    const lookupGuideStages: PipelineStage[] = [
      {
        $lookup: {
          from: "clients",
          localField: "guideId",
          foreignField: "_id",
          as: "guide",
          pipeline: [
            {
              $project: {
                firstName: 1,
                lastName: 1,
                profileImage: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$guide",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          guideName: {
            $trim: {
              input: {
                $replaceAll: {
                  input: {
                    $concat: [
                      { $ifNull: ["$guide.firstName", ""] },
                      " ",
                      { $ifNull: ["$guide.lastName", ""] },
                    ],
                  },
                  find: "  ",
                  replacement: " ",
                },
              },
            },
          },
          guideProfileImage: "$guide.profileImage",
        },
      },
      {
        $project: {
          guide: 0,
        },
      },
    ];

    /** Search by Booking ID or Guide Name */
    const searchStage: PipelineStage[] = search
      ? [
          {
            $match: {
              $or: [
                { bookingId: { $regex: search, $options: "i" } },
                { guideName: { $regex: search, $options: "i" } },
              ],
            },
          },
        ]
      : [];

    const categoryMatchStage: PipelineStage.Match["$match"] | null = !status
      ? {
          status: {
            $in:
              categoryValue === "completed"
                ? COMPLETED_STATUSES
                : PENDING_STATUSES,
          },
        }
      : null;

    /** Pipeline */
    const pipeline: PipelineStage[] = [
      { $match: matchStage },
      ...lookupGuideStages,
      ...searchStage,
      {
        $facet: {
          summary: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],

          data: [
            ...(categoryMatchStage ? [{ $match: categoryMatchStage }] : []),
            { $sort: { sessionDate: 1, createdAt: 1 } },
            { $skip: (pageNumber - 1) * limitNumber },
            { $limit: limitNumber },
          ],

          totalCount: [
            ...(categoryMatchStage ? [{ $match: categoryMatchStage }] : []),
            { $count: "count" },
          ],
        },
      },
    ];

    const aggregationResult = await localGuideBookingDB
      .aggregate(pipeline)
      .exec();
    const result = aggregationResult[0] || {
      summary: [],
      data: [],
      totalCount: [],
    };

    const summaryRaw = (result.summary as SummaryRow[]) || [] || [];
    const pendingCount = summaryRaw
      .filter((x: { _id: LocalGuideBookingStatus; count: number }) =>
        PENDING_STATUSES.includes(x._id)
      )
      .reduce((a, b) => a + b.count, 0);

    const completedCount = summaryRaw
      .filter((x) => COMPLETED_STATUSES.includes(x._id))
      .reduce((a, b) => a + b.count, 0);

    const total = result.totalCount[0]?.count || 0;
    const totalPages = Math.max(Math.ceil(total / limitNumber), 1);

    const bookings = (
      (result.data as (ILocalGuideBookingModel & {
        guideName?: string;
        guideProfileImage?: string;
      })[]) || []
    ).map((doc) => LocalGuideBookingMapper.toEntity(doc));

    return {
      bookings,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages,
      },
      summary: {
        pendingCount,
        completedCount,
      },
    };
  }

  async findGuideBookingsWithFilters(
    guideProfileId: string,
    filters: LocalGuideBookingListFilters
  ): Promise<{
    bookings: ILocalGuideBookingEntity[];
    pagination: {
      total: number;
      totalPages: number;
      page: number;
      limit: number;
    };
    summary: {
      pendingCount: number;
      completedCount: number;
    };
  }> {
    const {
      category = "pending",
      status,
      paymentStatus,
      search,
      from,
      to,
      page = 1,
      limit = 10,
    } = filters;

    const categoryValue: LocalGuideBookingCategory =
      category === "completed" ? "completed" : "pending";
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.min(Math.max(limit, 1), 50);

    const matchStage: PipelineStage.Match["$match"] = {
      guideProfileId: new Types.ObjectId(guideProfileId),
    };

    if (status) {
      matchStage.status = status;
    }

    if (from) {
      matchStage.sessionDate = {
        ...(matchStage.sessionDate || {}),
        $gte: new Date(from),
      };
    }
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      matchStage.sessionDate = {
        ...(matchStage.sessionDate || {}),
        $lte: toDate,
      };
    }

    if (paymentStatus) {
      const paymentFilters = this.mapPaymentFilters(paymentStatus);
      Object.assign(matchStage, paymentFilters);
    }

    const lookupTravellerStages: PipelineStage[] = [
      {
        $lookup: {
          from: "clients",
          localField: "travellerId",
          foreignField: "_id",
          as: "traveller",
          pipeline: [
            {
              $project: {
                firstName: 1,
                lastName: 1,
                profileImage: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$traveller",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          travellerName: {
            $trim: {
              input: {
                $replaceAll: {
                  input: {
                    $concat: [
                      { $ifNull: ["$traveller.firstName", ""] },
                      " ",
                      { $ifNull: ["$traveller.lastName", ""] },
                    ],
                  },
                  find: "  ",
                  replacement: " ",
                },
              },
            },
          },
          travellerProfileImage: "$traveller.profileImage",
        },
      },
      {
        $project: {
          traveller: 0,
        },
      },
    ];

    const searchStage: PipelineStage[] = search
      ? [
          {
            $match: {
              $or: [
                { bookingId: { $regex: search, $options: "i" } },
                { travellerName: { $regex: search, $options: "i" } },
              ],
            },
          },
        ]
      : [];

    const categoryMatchStage: PipelineStage.Match["$match"] | null = !status
      ? {
          status: {
            $in:
              categoryValue === "completed"
                ? COMPLETED_STATUSES
                : PENDING_STATUSES,
          },
        }
      : null;

    const pipeline: PipelineStage[] = [
      { $match: matchStage },
      ...lookupTravellerStages,
      ...searchStage,
      {
        $facet: {
          summary: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],
          data: [
            ...(categoryMatchStage ? [{ $match: categoryMatchStage }] : []),
            { $sort: { sessionDate: 1, createdAt: 1 } },
            { $skip: (pageNumber - 1) * limitNumber },
            { $limit: limitNumber },
          ],
          totalCount: [
            ...(categoryMatchStage ? [{ $match: categoryMatchStage }] : []),
            { $count: "count" },
          ],
        },
      },
    ];

    const aggregationResult = await localGuideBookingDB.aggregate(pipeline).exec();
    const result = aggregationResult[0] || {
      summary: [],
      data: [],
      totalCount: [],
    };

    const summaryRaw = (result.summary as SummaryRow[]) || [];
    const pendingCount = summaryRaw
      .filter((x) => PENDING_STATUSES.includes(x._id))
      .reduce((a, b) => a + b.count, 0);

    const completedCount = summaryRaw
      .filter((x) => COMPLETED_STATUSES.includes(x._id))
      .reduce((a, b) => a + b.count, 0);

    const total = result.totalCount[0]?.count || 0;
    const totalPages = Math.max(Math.ceil(total / limitNumber), 1);

    const bookings = (
      (result.data as (ILocalGuideBookingModel & {
        travellerName?: string;
        travellerProfileImage?: string;
      })[]) || []
    ).map((doc) => LocalGuideBookingMapper.toEntity(doc));

    return {
      bookings,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages,
      },
      summary: {
        pendingCount,
        completedCount,
      },
    };
  }

  private mapPaymentFilters(
    paymentStatus: LocalGuidePaymentFilter
  ): Record<string, unknown> {
    const now = new Date();

    switch (paymentStatus) {
      case "advance_due":
        return { "advancePayment.paid": false };

      case "advance_overdue":
        return {
          "advancePayment.paid": false,
          "advancePayment.dueDate": { $lt: now },
        };

      case "full_due":
        return {
          "advancePayment.paid": true,
          "fullPayment.paid": false,
        };

      case "full_paid":
        return { "fullPayment.paid": true };

      default:
        return {};
    }
  }

  async getServiceStats(
    guideProfileId: string
  ): Promise<{
    totalSessions: number;
    completedSessions: number;
    completionRate: number;
  }> {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          guideProfileId: new Types.ObjectId(guideProfileId),
        },
      },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          completedSessions: {
            $sum: {
              $cond: [
                {
                  $in: [
                    "$status",
                    ["COMPLETED", "FULLY_PAID"],
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ];

    const result = await localGuideBookingDB
      .aggregate<{
        totalSessions: number;
        completedSessions: number;
      }>(pipeline)
      .exec();

    const stats = result[0] || {
      totalSessions: 0,
      completedSessions: 0,
    };

    const completionRate =
      stats.totalSessions > 0
        ? Math.round(
            (stats.completedSessions / stats.totalSessions) * 100 * 100
          ) / 100
        : 0;

    return {
      totalSessions: stats.totalSessions || 0,
      completedSessions: stats.completedSessions || 0,
      completionRate: Math.min(completionRate, 100), 
    };
  }

async getEarningsStats(
  guideProfileId: string
): Promise<{ totalEarnings: number }> {
  const pipeline: PipelineStage[] = [
    {
      $match: {
        guideProfileId: new Types.ObjectId(guideProfileId),
        "fullPayment.paid": true,     
        "advancePayment.paid": true,  
      },
    },
    {
      $group: {
        _id: null,
        totalEarnings: {
          $sum: {
            $add: [
              { $ifNull: ["$advancePayment.amount", 0] },
              { $ifNull: ["$fullPayment.amount", 0] }
            ]
          }
        }
      }
    }
  ];

  const result = await localGuideBookingDB.aggregate<{ totalEarnings: number }>(pipeline).exec();

  return {
    totalEarnings: result[0]?.totalEarnings || 0
  };
}

  async getRatingStats(
    guideProfileId: string
  ): Promise<{
    averageRating: number;
    totalRatings: number;
  }> {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          guideProfileId: new Types.ObjectId(guideProfileId),
          completionRating: { $ne: null },
          status: { $in: ["COMPLETED", "FULLY_PAID"] },
        },
      },
      {
        $match: {
          completionRating: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$completionRating" },
          totalRatings: { $sum: 1 },
        },
      },
    ];

    const result = await localGuideBookingDB
      .aggregate<{
        averageRating: number;
        totalRatings: number;
      }>(pipeline)
      .exec();

    const stats = result[0] || {
      averageRating: 0,
      totalRatings: 0,
    };

    return {
      averageRating: Math.round((stats.averageRating || 0) * 100) / 100,
      totalRatings: stats.totalRatings || 0,
    };
  }
}
