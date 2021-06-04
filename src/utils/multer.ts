import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOADS_FOLDER_LOCAL as string);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + '-' + file.originalname);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: Function) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb({ message: 'File format not supported' }, false);
  }
};

export default multer({
  storage,
  fileFilter,
});
