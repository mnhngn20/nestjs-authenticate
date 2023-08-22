import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AuthenticationModule } from './modules/authentication.module';
import { AppService } from './services/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User.entities';
import { UserModule } from './modules/user.module';
import { ConfigModule } from '@nestjs/config';
import { Token } from './entities/Token.entities';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Token],
      synchronize: true,
    }),
    AuthenticationModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
