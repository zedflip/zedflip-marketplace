import mongoose, { Document, Schema } from 'mongoose';

export type ListingCondition = 'new' | 'like-new' | 'good' | 'fair' | 'poor';
export type ListingStatus = 'active' | 'sold' | 'reserved' | 'expired' | 'deleted';

export interface IListing extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  currency: string;
  condition: ListingCondition;
  category: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  images: string[];
  city: string;
  location?: string;
  status: ListingStatus;
  views: number;
  favorites: number;
  isFeatured: boolean;
  isNegotiable: boolean;
  contactPhone: string;
  contactWhatsApp?: string;
  tags: string[];
  expiresAt: Date;
  soldAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ZAMBIA_CITIES = [
  'Lusaka', 'Kitwe', 'Ndola', 'Kabwe', 'Livingstone', 
  'Chipata', 'Mansa', 'Mongu', 'Solwezi', 'Kasama', 
  'Mufulira', 'Luanshya'
];

const listingSchema = new Schema<IListing>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    currency: {
      type: String,
      default: 'ZMW',
      enum: ['ZMW'],
    },
    condition: {
      type: String,
      required: [true, 'Condition is required'],
      enum: {
        values: ['new', 'like-new', 'good', 'fair', 'poor'],
        message: 'Invalid condition value',
      },
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller is required'],
    },
    images: {
      type: [String],
      validate: {
        validator: function (v: string[]) {
          return v.length >= 1 && v.length <= 10;
        },
        message: 'Listing must have between 1 and 10 images',
      },
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      enum: {
        values: ZAMBIA_CITIES,
        message: 'Please select a valid Zambian city',
      },
    },
    location: {
      type: String,
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'sold', 'reserved', 'expired', 'deleted'],
    },
    views: {
      type: Number,
      default: 0,
    },
    favorites: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNegotiable: {
      type: Boolean,
      default: true,
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
      match: [/^\+260[0-9]{9}$/, 'Please enter a valid Zambian phone number'],
    },
    contactWhatsApp: {
      type: String,
      match: [/^\+260[0-9]{9}$/, 'Please enter a valid Zambian phone number'],
    },
    tags: {
      type: [String],
      default: [],
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
    soldAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for search and filtering
listingSchema.index({ title: 'text', description: 'text', tags: 'text' });
listingSchema.index({ category: 1, status: 1 });
listingSchema.index({ city: 1, status: 1 });
listingSchema.index({ seller: 1 });
listingSchema.index({ price: 1 });
listingSchema.index({ createdAt: -1 });
listingSchema.index({ expiresAt: 1 });

export default mongoose.model<IListing>('Listing', listingSchema);
