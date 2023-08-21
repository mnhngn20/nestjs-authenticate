import { sign } from 'jsonwebtoken';
import { User } from 'src/entities/User.entities';

export function generateToken(user: User) {
  console.log(user);

  const accessToken = sign({ ...user }, process.env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: '30m',
  });

  const refreshToken = sign({ ...user }, process.env.REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: '30d',
  });

  return {
    accessToken,
    refreshToken,
  };
}
