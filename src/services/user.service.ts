import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User.entities';
import { GetAllResponse, Order } from 'src/types/pagination';
import { GetAllUsersDto } from 'src/types/user';
import { hashPassword } from 'src/utils/password';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findUser({
    email,
    id,
    selectFields,
  }: {
    email?: string;
    id?: number;
    selectFields?: (keyof User)[];
  }): Promise<User> {
    try {
      const existingUser = await this.usersRepository.findOne({
        where: {
          email,
          id,
        },
        select: selectFields,
      });

      return existingUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllUsers({
    address,
    age,
    email,
    fullName,
    limit = 10,
    order = Order.ASC,
    orderBy = 'createdAt',
    page = 1,
  }: GetAllUsersDto): Promise<GetAllResponse<User>> {
    const options = {
      ...(email && {
        email: ILike(`%${email}%`),
      }),
      ...(address && {
        address: ILike(`%${email}%`),
      }),
      ...(fullName && {
        fullName: ILike(`%${email}%`),
      }),
      ...(age && {
        age,
      }),
    };

    try {
      const [users, total] = await this.usersRepository.findAndCount({
        where: {
          ...options,
        },
        take: limit,
        skip: (page - 1) * limit,
        order: {
          [orderBy]: order,
        },
      });

      const totalPages = Math.ceil(total / limit);
      if (totalPages > 0 && page > totalPages) throw new Error('Out of bounds');

      return {
        data: users,
        page,
        total,
        totalPages,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async createUser(
    user: Omit<User, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>,
  ): Promise<User> {
    const { email, password } = user;
    try {
      const existingUser = await this.usersRepository.findOne({
        where: {
          email,
        },
      });

      if (existingUser) {
        throw new Error('User already exists!');
      }

      const hashedPassword = await hashPassword(password);

      const newUser = await this.usersRepository.create({
        ...user,
        password: hashedPassword,
      });

      await this.usersRepository.save(newUser);

      return newUser;
    } catch (error) {
      throw new Error(error);
    }
  }
}
