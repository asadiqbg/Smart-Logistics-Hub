import { hash } from 'crypto';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

export class BcryptProvider implements HashingProvider {
  public async hashPassword(data: string | Buffer): Promise<string> {
    const salt: string = await bcrypt.genSalt();
    return bcrypt.hash(data, salt);
  }

  public async comparePassword(
    plainPassword: string | Buffer,
    hashedPassword: string | Buffer,
  ): Promise<boolean> {
    const plain =
      typeof plainPassword === 'string'
        ? plainPassword
        : plainPassword.toString();
    const hashed =
      typeof hashedPassword === 'string'
        ? hashedPassword
        : hashedPassword.toString();

    return bcrypt.compare(plain, hashed);
  }
}
