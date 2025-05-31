import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  create(createPostDto: CreatePostDto) {
    console.log(createPostDto);
    return `${createPostDto.title} 글이 등록되었습니다.`;
  }

  findAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${updatePostDto.id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
