import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: Number,
      required: true,
    },
    path: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
    },
    editableBy: {
      type: String,
      ref: 'User',
      required: true,
      trim: true,
    },
    dateCreated: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dateModified: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const File = mongoose.model('File', fileSchema);

export default File;
