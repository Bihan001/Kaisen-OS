require('dotenv').config({ path: process.env.NODE_ENV === 'production' ? 'prod.env' : 'dev.env' });
import mongoose from 'mongoose';
import app from './app';
// Variables
const PORT = process.env.PORT || 5000;

//Connection
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Database Connection Error: ', err.message));
} else {
  throw new Error('MONGODB_URI not defined');
}

app.listen(PORT, () => console.log('Server is running at ' + PORT));
