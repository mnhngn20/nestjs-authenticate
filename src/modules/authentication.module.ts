import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationController } from 'src/controllers/authentication.controller';
import { User } from 'src/entities/User.entities';
import { AuthenticationService } from 'src/services/authentication.service';
import { UserModule } from './user.module';
import { Token } from 'src/entities/Token.entities';
import { TokenService } from 'src/services/token.service';

@Module({
  providers: [AuthenticationService, TokenService],
  controllers: [AuthenticationController],
  imports: [TypeOrmModule.forFeature([User, Token]), UserModule],
})
export class AuthenticationModule {}
