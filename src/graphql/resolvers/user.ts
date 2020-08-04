import { UserInputError, IResolverObject } from 'apollo-server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { IUser } from 'src/models/User';
// import { userLoader, productLoader } from '../dataLoader';
import { Context } from 'src';
import { IProduct } from 'src/models/Product';

const generateJWT = async (user: IUser): Promise<string> => {
  return jwt.sign(
    { userId: user.id, username: user.username, email: user.email },
    process.env.SECRET_KEY || '',
    { expiresIn: '2h' }
  );
};

export const userQueries: IResolverObject = {
  user: async (_, { id }: { id: string }, context: Context): Promise<IUser> => {
    try {
      const user = await context.models.User.findById(id);
      if (!user) throw new UserInputError('User not found');
      return user;
    } catch (error) {
      throw new Error(error);
    }
  },
};

export const userNestedQueries: IResolverObject = {
  initials: (user: IUser): string => {
    return user.username
      .split(' ')
      .map((w) => w[0])
      .join('');
  },
  products: async (user: IUser, _, context: Context): Promise<IProduct[]> => {
    try {
      return context.models.Product.find({ user: user.id });
    } catch (error) {
      throw new Error(error);
    }
  },
};

export const userMutations: IResolverObject = {
  loginUser: async (
    _,
    { email, password }: ILoginUser,
    context: Context
  ): Promise<{ token: string }> => {
    try {
      // Check if user exists based on email
      const user = await context.models.User.findOne({ email });
      if (!user) throw new UserInputError('Invalid credentials');

      // Check if password entered is correct
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new UserInputError('Invalid credentials');

      const token = await generateJWT(user);
      return { token };
    } catch (error) {
      throw new Error(error);
    }
  },
  registerUser: async (
    _,
    { email, password, username }: IRegisterUser,
    context: Context
  ): Promise<{ token: string }> => {
    // Check if username is in use
    const checkUsername = await context.models.User.findOne({
      username: { $regex: new RegExp('^' + username.toLowerCase(), 'i') },
    });
    if (checkUsername) throw new UserInputError('Username already exists');

    // Check if email is in use
    const checkEmail = await context.models.User.findOne({ email });
    if (checkEmail) throw new UserInputError('Email already exists');

    password = await bcrypt.hash(password, 12);

    const user = new context.models.User({
      email,
      password,
      username,
    });
    const res = await user.save();
    const token = await generateJWT(res);
    return { token };
  },
};

interface ILoginUser {
  email: string;
  password: string;
}

interface IRegisterUser {
  email: string;
  password: string;
  username: string;
}
