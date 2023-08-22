import { Body, Controller, Post, Res } from '@nestjs/common';
import { verify } from 'argon2';
import { Response } from 'express';
import { User } from 'src/entities/User.entities';
import { TokenService } from 'src/services/token.service';
import { UserService } from 'src/services/user.service';
import { SignInDto, SignInResponse } from 'src/types/authentication';
import { generateToken } from 'src/utils/token';
import { verify as verifyJWT } from 'jsonwebtoken';

@Controller()
export class AuthenticationController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('sign-in')
  async signIn(
    @Body() { email, password }: SignInDto,
    @Res() res: Response,
  ): Promise<Response<SignInResponse>> {
    try {
      const existingUser = await this.userService.findUser({
        email,
      });

      if (!existingUser) {
        return res.status(404).send('User Not Found!');
      }

      const isPasswordMatch = await verify(existingUser.password, password);
      if (!isPasswordMatch) {
        return res.status(400).send('Incorrect Password!');
      }
      const { accessToken, refreshToken } = generateToken(existingUser);

      await this.tokenService.saveUserRefreshTokens(
        existingUser.id,
        refreshToken,
      );

      return res.send({
        accessToken,
        refreshToken,
        user: existingUser,
      });
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  @Post('sign-up')
  async signUp(
    @Body() payload: SignInDto,
    @Res() res: Response,
  ): Promise<Response<User>> {
    try {
      const { email, password } = payload;

      if (!email || !password) {
        return res.send(400).send('Email or Password must be provided!');
      }

      const newUser = await this.userService.createUser({ ...payload });

      return res.send(newUser);
    } catch (error) {
      return res.send(error.message);
    }
  }

  @Post('refresh-token')
  async refreshToken(
    @Body() { refreshToken }: { refreshToken: string },
    @Res() res: Response,
  ): Promise<Response<{ accessToken: string; refreshToken: string }>> {
    try {
      const decodedRefreshTokenData = verifyJWT(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY,
      ) as { id: number };

      const isRefreshTokenValid = await this.tokenService.checkUserRefreshToken(
        decodedRefreshTokenData.id,
        refreshToken,
      );

      const user = await this.userService.findUser({
        id: decodedRefreshTokenData.id,
      });

      await this.tokenService.removeUserRefreshToken(
        decodedRefreshTokenData.id,
        refreshToken,
      );

      if (isRefreshTokenValid) {
        const tokens = generateToken(user);

        await this.tokenService.saveUserRefreshTokens(
          decodedRefreshTokenData.id,
          tokens.refreshToken,
        );

        return res.send(tokens);
      }
      throw new Error('Invalid refresh token!');
    } catch (error) {
      return res.send('Invalid refresh token!');
    }
  }
}
