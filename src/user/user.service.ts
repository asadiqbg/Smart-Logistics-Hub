import {
  ConflictException,
  forwardRef,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Inject } from '@nestjs/common';
import passport from 'passport';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async findUserById(id: string): Promise<User | null> {
    console.log('inside user service');
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  public async findUserbyEmailandTenantId(
    email: string,
    tenantId: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email,
        tenantId,
      },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
        tenantId: createUserDto.tenantId,
      },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await this.hashingProvider.hashPassword(
      createUserDto.password,
    );
    const user = this.userRepository.create({
      tenantId: createUserDto.tenantId,
      email: createUserDto.email,
      passwordHash: hashedPassword,
      role: createUserDto.role || 'viewer',
    });
    return await this.userRepository.save(user);
  }
}
