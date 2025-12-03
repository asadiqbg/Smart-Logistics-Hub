import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/database/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { BcryptProvider } from './providers/bcrypt.provider';
import { HashingProvider } from './providers/hashing.provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private hashingProvider: HashingProvider,
  ) {}
  public async register(registerDto: RegisterDto) {
    //create user
    const user = await this.userService.createUser(registerDto);
    //generate tokens
    const tokens = await this.generateTokens(user);
    //exclude password and return user object beside tokens
    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  public async login(loginDto: LoginDto) {
    //find user
    const user = await this.userService.findUserbyEmailandTenantId(
      loginDto.email,
      loginDto.tenantId,
    );
    //check for user validity
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }
    //compare password
    const isPasswordValid = await this.hashingProvider.comparePassword(
      loginDto.password,
      (await user).passwordHash,
    );
    //if valid, generate tokens
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password Invalid');
    }

    const tokens = await this.generateTokens(user);
    //return

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  public async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '1h' }),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ]);
    return { accessToken, refreshToken };
  }

  //Exclude passwordHash field from user object and returns rest of the user named sanitized
  public sanitizeUser(user: User) {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
}
