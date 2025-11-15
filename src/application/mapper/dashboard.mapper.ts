import { BookingStatusDistribution } from "../dto/response/dashboard.dto";

export class DashboardMapper {
  static mapToBookingStatusDistribution(
    doc: Record<string, number>
  ): BookingStatusDistribution {
    return {
      applied: doc.applied || 0,
      confirmed: doc.confirmed || 0,
      fully_paid: doc.fully_paid || 0,
      completed: doc.completed || 0,
      waitlisted: doc.waitlisted || 0,
      cancelled: doc.cancelled || 0,
      expired: doc.expired || 0,
      advance_pending: doc.advance_pending || 0,
      cancellation_requested: doc.cancellation_requested || 0,
    };
  }
  static mapToTopAgencies(doc: {
    agencyId: string;
    agencyName: string;
    revenue: number;
    bookings: number;
  }): {
    agencyId: string;
    agencyName: string;
    revenue: number;
    bookings: number;
  } {
    return {
      agencyId: doc.agencyId,
      agencyName: doc.agencyName,
      bookings: doc.bookings,
      revenue: doc.revenue,
    };
  }

  static mapToCategoryPerformance(doc: {
    category: string;
    revenue: number;
    bookings: number;
  }): { category: string; revenue: number; bookings: number } {
    return {
      category: doc.category,
      bookings: doc.bookings,
      revenue: doc.revenue,
    };
  }
}
