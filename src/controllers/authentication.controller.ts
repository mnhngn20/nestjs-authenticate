import { Body, Controller, Post, Res } from '@nestjs/common';
import { verify } from 'argon2';
import { Response } from 'express';
import { User } from 'src/entities/User.entities';
import { UserService } from 'src/services/user.service';
import { SignInDto, SignInResponse } from 'src/types/authentication';
import { generateToken } from 'src/utils/token';

@Controller()
export class AuthenticationController {
  constructor(private userService: UserService) {}

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
}
