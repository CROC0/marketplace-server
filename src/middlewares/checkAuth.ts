import { AuthenticationError } from 'apollo-server';
import jwt from 'jsonwebtoken';
import { Context } from '../index';

export interface IAuthToken {
  userId: string;
  username: string;
  email: string;
}

export default (context: Context): IAuthToken => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split('Bearer ')[1];
    if (token) {
      try {
        const user = jwt.verify(token, process.env.SECRET_KEY || '') as IAuthToken;
        return user;
      } catch (error) {
        throw new AuthenticationError('Token is not valid');
      }
    }
    throw new Error("Authorization token must be 'Bearer [token]'");
  }
  throw new Error('Authorization header must be provided');
};
