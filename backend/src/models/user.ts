import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    _id: {
      // Firebase uid will be stored in _id
      type: String,
      required: true,
    },
    filesCount: {
      type: Number,
      default: 0,
    },
    lastOnline: {
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

const User = mongoose.model('User', userSchema);

export default User;
