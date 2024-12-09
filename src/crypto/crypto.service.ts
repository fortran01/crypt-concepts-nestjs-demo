import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import * as argon2 from 'argon2';

@Injectable()
export class CryptoService {
  private readonly PEPPER = Buffer.from('your_secure_pepper_value');
  // 32 bytes for encryption key
  private readonly ENCRYPTION_KEY = crypto.randomBytes(32);
  // 16 bytes for IV (Initialization Vector)
  private readonly IV_LENGTH = 16;

  async hashPassword(password: string, algorithm: string, workFactor: number = 12) {
    const salt = crypto.randomBytes(16);
    const startTime = process.hrtime();
    let hash: string;
    let timing: [number, number];

    const combined = Buffer.concat([
      Buffer.from(password),
      salt,
      this.PEPPER
    ]);

    switch (algorithm) {
      case 'sha256':
        hash = crypto.createHash('sha256').update(combined).digest('hex');
        timing = process.hrtime(startTime);
        break;

      case 'sha3':
        hash = crypto.createHash('sha3-256').update(combined).digest('hex');
        timing = process.hrtime(startTime);
        break;

      case 'bcrypt':
        // Only use workFactor for bcrypt
        hash = await bcrypt.hash(Buffer.concat([Buffer.from(password), this.PEPPER]), workFactor);
        timing = process.hrtime(startTime);
        break;

      case 'argon2':
        // Only use workFactor for argon2
        const argonOptions = {
          timeCost: workFactor,
          memoryCost: 65536,
          parallelism: 4,
          salt,
        };
        hash = await argon2.hash(Buffer.concat([Buffer.from(password), this.PEPPER]), argonOptions);
        timing = process.hrtime(startTime);
        break;

      default:
        throw new Error('Unsupported algorithm');
    }

    const timingMs = (timing[0] * 1e9 + timing[1]) / 1e6;

    return {
      salt: salt.toString('base64'),
      pepper_used: true,
      concatenation: 'password + salt + pepper',
      hash,
      timing_ms: Math.round(timingMs * 100) / 100,
      work_factor: (algorithm === 'bcrypt' || algorithm === 'argon2') ? workFactor : undefined
    };
  }

  async encryptData(data: string) {
    const startTime = process.hrtime();
    
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(
      'aes-256-gcm',
      this.ENCRYPTION_KEY,
      iv
    );

    // Encrypt data, with utf8 input encoding and base64 output encoding
    let encrypted = cipher.update(data, 'utf8', 'base64');
    // Handle remaining data in the cipher's internal buffer
    // and complete the encryption
    encrypted += cipher.final('base64');
    // The auth tag verifies the integrity of the ciphertext
    const authTag = cipher.getAuthTag();

    // Combine IV, encrypted data, and auth tag
    const result = Buffer.concat([
      iv,
      Buffer.from(encrypted, 'base64'),
      authTag
    ]);

    const timing = process.hrtime(startTime);
    const timingMs = (timing[0] * 1e9 + timing[1]) / 1e6;

    return {
      // Convert to string representing base64
      encrypted_base64: result.toString('base64'),
      encryption_timing_ms: Math.round(timingMs * 100) / 100
    };
  }

  async decryptData(encryptedBase64: string) {
    const startTime = process.hrtime();
    
    // Convert base64 to buffer
    const encrypted = Buffer.from(encryptedBase64, 'base64');
    
    // Extract IV, encrypted data, and auth tag
    const iv = encrypted.slice(0, this.IV_LENGTH);
    const authTag = encrypted.slice(-16);
    const encryptedData = encrypted.slice(this.IV_LENGTH, -16);

    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      this.ENCRYPTION_KEY,
      iv
    );
    // Set auth tag for verification
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedData);
    // Handle remaining data in the cipher's internal buffer
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    const timing = process.hrtime(startTime);
    const timingMs = (timing[0] * 1e9 + timing[1]) / 1e6;

    return {
      decrypted_data: decrypted.toString('utf8'),
      decryption_timing_ms: Math.round(timingMs * 100) / 100
    };
  }
}
