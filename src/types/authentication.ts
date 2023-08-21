import { User } from 'src/entities/User.entities';

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

export interface SignInResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
