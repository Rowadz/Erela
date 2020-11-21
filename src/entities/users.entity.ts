import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Exclude } from 'class-transformer'
import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsEmpty,
} from 'class-validator'

enum Type {
  user = 'user',
  admin = 'admin',
}

@Entity({ name: 'users' })
export class UsersEntity {
  @PrimaryGeneratedColumn()
  @IsEmpty({ always: true, message: 'Do not send the ID!' })
  id: number

  @Column({ name: 'first_name', nullable: false })
  @IsString({ always: true })
  @MinLength(1, { always: true })
  @MaxLength(255, { always: true })
  firstName: string

  @Column({ name: 'last_name', nullable: false })
  @IsString({ always: true })
  @MinLength(1, { always: true })
  @MaxLength(255, { always: true })
  lastName: string

  @Column({ name: 'birth_of_date', nullable: true, type: 'date' })
  birthOfDate: Date

  @Column({ unique: true, nullable: false })
  @IsEmail({}, { always: true })
  email: string

  @Column({ default: 'user' })
  @IsEmpty({ always: true, message: 'Do not send the type!' })
  type: Type

  @Column({ nullable: false })
  @Exclude()
  @IsString({ always: true })
  @MinLength(6, { always: true })
  @MaxLength(25, { always: true })
  password: string

  @Column({ nullable: false })
  @Exclude()
  @IsEmpty({ always: true, message: 'Do not send the salt' })
  salt: string

  accessToken?: string
}
