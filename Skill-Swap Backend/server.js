import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
dotenv.config();
const app = express();
//Middleware
app.use(express.json());
app.use(cors());

// routes
app.use('/api/users',userRoutes);
app.use('/api/auth',authRoutes);
app.use('/api',skillRoutes);
mongoose.connect(process.env.MONGO_URI).then(() => {console.log('MongoDB connected')}).catch((error) => {console.log(`MongoDB connection error: ${error}`)});

// mongodb://localhost:27017/skill-swap
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error(`MongoDB connection error: ${error}`));

  app.get('/', (req, res) => {
  res.send('API is running............');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));