import { sign } from 'jsonwebtoken';
import { User } from 'src/entities/User.entities';

export function generateToken(user: User) {
  const accessToken = sign({ ...user }, process.env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: '30m',
  });

  const refreshToken = sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: '1year',
    },
  );

  return {
    accessToken,
    refreshToken,
  };
}
