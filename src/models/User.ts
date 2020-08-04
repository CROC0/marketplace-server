import mongoose, { Document, Schema } from 'mongoose';
import { IProduct } from './Product';

export interface IUser extends Document {
  _id: string;
  username: string;
  password: string;
  email: string;
  emailConfirmed: boolean;
  products: IProduct[];
}

const userSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    emailConfirmed: {
      type: Boolean,
      default: false,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);
