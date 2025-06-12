import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../user/entities/user.entity';
// import { GetPostDto } from './dto/get-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id: createPostDto.authorId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      // 게시물 생성
      const post = queryRunner.manager.create(Post, createPostDto);
      const savedPost = await queryRunner.manager.save(post);

      // 트랜잭션 커밋
      const postCount = await queryRunner.manager.count(Post, {
        where: { authorId: createPostDto.authorId },
      });

      user.post_count = postCount;
      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
      return savedPost;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Post[]> {
    return await this.postRepository.find({
      relations: ['author'],
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException('해당 게시물을 찾을 수 없습니다.');
    }
    return post;
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    currentUserId: number,
  ): Promise<Post> {
    const post = await this.findOne(id);
    if (post.authorId !== currentUserId) {
      throw new UnauthorizedException('현재 게시물에 대한 권한이 없습니다.');
    }

    Object.assign(post, updatePostDto);
    return await this.postRepository.save(post);
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);
    if (!post) {
      throw new NotFoundException('해당 게시물을 찾을 수 없습니다.');
    }

    await this.postRepository.remove(post);
  }
}
