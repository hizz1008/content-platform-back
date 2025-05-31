import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAllPosts(): string {
    return '전부 가져온다.';
  }
}
