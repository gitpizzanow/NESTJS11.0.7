import * as crypto from 'crypto';
import { configuration } from '../../configs/configuration';

const algorithm = 'aes-256-ctr';
const secretKey = configuration().cryptoSecretKey;

export function encrypt(rawData: string) {
  const iv = crypto.randomBytes(16); // Initialisation vector
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encryptedData = cipher.update(rawData, 'utf-8', 'hex');
  encryptedData += cipher.final('hex');
  return iv.toString('hex') + encryptedData;
}

export function decrypt(encryptedData: string) {
  const iv = Buffer.from(encryptedData.slice(0, 32), 'hex'); // Initialisation vector
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decryptedData = decipher.update(encryptedData.slice(32), 'hex', 'utf-8');
  decryptedData += decipher.final('utf-8');
  return decryptedData;
}

export async function hash(rawData: string) {
  const utf8 = new TextEncoder().encode(configuration().cryptoHashSaltString + rawData);
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((bytes) => bytes.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
