import { IResolverObject } from 'apollo-server';
import { Context } from 'src';
import { IProduct } from 'src/models/Product';
import { IUser } from 'src/models/User';
import checkAuth from '../../middlewares/checkAuth';

// import { productLoader } from '../dataLoader';

interface ICreateProduct {
  name: string;
  price: number;
  description: string;
  point: [number];
}

export const productQueries: IResolverObject = {
  products: async (_, { search }: { search: string }, context: Context): Promise<IProduct[]> => {
    try {
      const { userId } = checkAuth(context);

      if (search) {
        const products = await context.models.Product.find({
          name: { $regex: search, $options: 'i' },
        })
          .populate('user')
          .sort({ createdAt: 'desc' });
        return products.filter((p) => p.user.id !== userId);
      } else {
        const products = await context.models.Product.find().populate('user').sort({
          createdAt: 'desc',
        });
        return products.filter((p) => p.user.id !== userId);
      }
    } catch (error) {
      throw new Error(error);
    }
  },
  product: async (_, { id }: { id: string }, context: Context): Promise<IProduct> => {
    try {
      const product = await context.models.Product.findById(id);
      if (!product) throw new Error('Product Not Found');
      return product;
    } catch (error) {
      throw new Error(error);
    }
  },
};

export const productNestedQueries: IResolverObject = {
  user: async (product: IProduct, _, context: Context): Promise<IUser> => {
    try {
      const user = await context.models.User.findById(product.user._id);
      if (!user) throw new Error('User not found');
      return user;
    } catch (error) {
      throw new Error(error);
    }
  },
};

export const productMutations: IResolverObject = {
  createProduct: async (
    _,
    { name, price, description, point }: ICreateProduct,
    context: Context
  ): Promise<IProduct> => {
    try {
      const { userId } = checkAuth(context);
      const newProduct = new context.models.Product({
        name,
        price: +price,
        description,
        status: 'AVAILABLE',
        user: userId,
        location: {
          type: 'Point',
          coordinates: point,
        },
      });
      const res = await newProduct.save();
      const user = await context.models.User.findById(userId);
      if (!user) throw new Error('User not found');
      user.products.push(newProduct);
      user.save();
      return res;
    } catch (error) {
      throw new Error(error);
    }
  },
  deleteProduct: async (_, { id }: { id: string }, context: Context): Promise<string> => {
    try {
      const res = await context.models.Product.findByIdAndDelete(id);
      if (!res) throw new Error('Product not found');
      return id;
    } catch (error) {
      throw new Error(error);
    }
  },
};
