import { Body, Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/entities/User.entities';
import { UserService } from 'src/services/user.service';
import { GetAllResponse } from 'src/types/pagination';
import { GetAllUsersDto } from 'src/types/user';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  async getUsers(
    @Body() payload: GetAllUsersDto,
    @Res() res: Response,
  ): Promise<Response<GetAllResponse<User>>> {
    try {
      const response = await this.userService.getAllUsers(payload);

      return res.send(response);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  @Get('users/:id')
  async getUser(
    @Param() params: { id?: number },
    @Res() res: Response,
  ): Promise<Response<User>> {
    try {
      const userId = params.id;
      if (!userId) {
        return res.status(400).send('User id must be provided!');
      }
      const foundUser = await this.userService.findUser({ id: userId });

      return res.send(foundUser);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}
