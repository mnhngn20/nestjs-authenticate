import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationController } from 'src/controllers/authentication.controller';
import { User } from 'src/entities/User.entities';
import { AuthenticationService } from 'src/services/authentication.service';
import { UserModule } from './user.module';

@Module({
  providers: [AuthenticationService],
  controllers: [AuthenticationController],
  imports: [TypeOrmModule.forFeature([User]), UserModule],
})
export class AuthenticationModule {}
