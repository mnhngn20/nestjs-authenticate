import { PaginationDto } from './pagination';

export interface GetAllUsersDto extends PaginationDto {
  email?: string;
  fullName?: string;
  age?: number;
  address?: string;
}
