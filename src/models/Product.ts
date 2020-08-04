import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { Point } from 'geojson';

export interface IProduct extends Document {
  _id: string;
  name: string;
  price: number;
  status: string;
  description: string;
  user: IUser;
  location: Point;
  createdAt: string;
  updatedAt: string;
}

const productSchema: Schema<IProduct> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['AVAILABLE', 'SOLD', 'REMOVED'],
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', productSchema);
