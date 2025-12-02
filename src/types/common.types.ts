export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Paginated API response format
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}


export interface PaginationQuery {
  page?: number;
  limit?: number;
}


export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

