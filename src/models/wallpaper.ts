import mongoose from 'mongoose';

const wallpaperSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
      trim: true,
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

const Wallpaper = mongoose.model('Wallpaper', wallpaperSchema);

export default Wallpaper;
