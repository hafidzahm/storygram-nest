import { Request } from 'express';
import { TokenPayload } from './payload.interface'; // Adjust the path as needed

export interface RequestUser extends Request {
  user: TokenPayload;
}
