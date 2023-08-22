import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column('text', { array: true, default: [] })
  refreshToken: string[] = [];
}
