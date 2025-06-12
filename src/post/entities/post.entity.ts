import {
  Column, // 컬럼 정의
  CreateDateColumn, // 생성 날짜
  Entity, // 엔티티 정의
  PrimaryGeneratedColumn, // 기본 키 생성
  UpdateDateColumn, // 업데이트 날짜
  ManyToOne, // 다대일 관계
  JoinColumn, // 조인 컬럼
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('post')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  authorId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
