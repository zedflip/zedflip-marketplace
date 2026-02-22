import mongoose, { Document, Schema } from 'mongoose';

export type ReportType = 'listing' | 'user' | 'chat';
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';
export type ReportReason = 
  | 'spam'
  | 'scam'
  | 'inappropriate'
  | 'counterfeit'
  | 'harassment'
  | 'other';

export interface IReport extends Document {
  _id: mongoose.Types.ObjectId;
  reporter: mongoose.Types.ObjectId;
  type: ReportType;
  targetListing?: mongoose.Types.ObjectId;
  targetUser?: mongoose.Types.ObjectId;
  targetChat?: mongoose.Types.ObjectId;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  adminNotes?: string;
  resolvedBy?: mongoose.Types.ObjectId;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>(
  {
    reporter: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reporter is required'],
    },
    type: {
      type: String,
      required: [true, 'Report type is required'],
      enum: ['listing', 'user', 'chat'],
    },
    targetListing: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
    },
    targetUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    targetChat: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      enum: ['spam', 'scam', 'inappropriate', 'counterfeit', 'harassment', 'other'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    },
    adminNotes: {
      type: String,
      maxlength: [500, 'Admin notes cannot exceed 500 characters'],
    },
    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ reporter: 1 });
reportSchema.index({ type: 1, status: 1 });

export default mongoose.model<IReport>('Report', reportSchema);
