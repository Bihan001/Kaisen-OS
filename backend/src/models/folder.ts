import mongoose from 'mongoose';

const folderSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      trim: true,
      default: 'folder',
    },
    path: {
      type: String,
      required: true,
      trim: true,
    },
    children: [
      {
        type: String,
        ref: 'folders',
      },
    ],
    editableBy: {
      type: String,
      ref: 'users',
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    modifiedOn: {
      type: Date,
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

const Folder = mongoose.model('Folder', folderSchema);

export default Folder;
