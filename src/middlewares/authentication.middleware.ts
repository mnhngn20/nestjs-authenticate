import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { User } from 'src/entities/User.entities';
import { UserService } from 'src/services/user.service';
import { DeepPartial } from 'typeorm';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.header('Authorization');
      const accessToken = authHeader && authHeader.split(' ')[1];
      console.log(accessToken);

      if (!accessToken) {
        res.status(401).send('No token header provided!');
      }

      const decodedUser = verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET_KEY,
      ) as DeepPartial<User>;

      const existingUser = await this.userService.findUser({
        id: decodedUser?.id,
      });

      if (!existingUser) {
        res.status(401).send({ message: 'Unauthorized' });

        return;
      }

      return next();
    } catch (error) {
      res.status(401).send({ message: 'Unauthorized' });
    }
  }
}
