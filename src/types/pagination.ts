export enum Order {
  DESC = 'DESC',
  ASC = 'ASC',
}

export interface PaginationDto {
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: Order;
}

export interface GetAllResponse<T> {
  page: number;
  total: number;
  totalPages: number;
  data: T[];
  message?: string;
}
