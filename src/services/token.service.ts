import { UserService } from './user.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from 'src/entities/Token.entities';
import { Repository } from 'typeorm';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly userService: UserService,
  ) {}

  private async checkUserExisting(userId: number) {
    try {
      const existingUser = await this.userService.findUser({ id: userId });

      if (!existingUser) {
        throw new Error('User not found!');
      }
    } catch (error) {
      throw new error();
    }
  }

  async checkUserRefreshToken(userId: number, refreshTokenToCheck: string) {
    try {
      await this.checkUserExisting(userId);

      const userRefreshTokens = await this.tokenRepository.findOne({
        where: {
          userId,
        },
      });

      return !!userRefreshTokens.refreshToken.includes(refreshTokenToCheck);
    } catch (error) {
      throw new Error(error);
    }
  }

  async saveUserRefreshTokens(userId: number, refreshToken: string) {
    try {
      await this.checkUserExisting(userId);

      const userTokens = await this.tokenRepository.findOne({
        where: {
          userId,
        },
      });

      if (!userTokens) {
        const newUserTokens = await this.tokenRepository.create({
          refreshToken: [refreshToken],
          userId,
        });
        await this.tokenRepository.save(newUserTokens);
      } else {
        userTokens.refreshToken = [...userTokens.refreshToken, refreshToken];
        await this.tokenRepository.save(userTokens);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async removeUserRefreshToken(userId: number, refreshToken: string) {
    try {
      await this.checkUserExisting(userId);

      const userTokens = await this.tokenRepository.findOne({
        where: {
          userId,
        },
      });

      userTokens.refreshToken = userTokens.refreshToken.filter(
        (token) => token !== refreshToken,
      );

      await this.tokenRepository.save(userTokens);
    } catch (error) {
      throw new Error(error);
    }
  }
}
