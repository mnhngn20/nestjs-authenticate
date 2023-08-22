import { User } from 'src/entities/User.entities';

// Dto

export interface SignUpDto {
  email: string;
  password: string;
}

export interface SignInDto {
  email: string;
  password: string;
  fullName: string;
  address: string;
  age: number;
}

export interface LogoutDto {
  refreshToken: string;
  userId: number;
}

// Response

export interface SignInResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
