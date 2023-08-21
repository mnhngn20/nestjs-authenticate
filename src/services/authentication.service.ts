import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticationService {
  signIn(): string {
    return 'Processing data...';
  }
}
