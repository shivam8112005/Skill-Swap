// import express from 'express';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import userRoutes from './routes/userRoutes.js';
// import authRoutes from './routes/authRoutes.js';
// import skillRoutes from './routes/skillRoutes.js';
// import barterRoutes from './routes/barterRoutes.js';
// dotenv.config();
// const http=require('http');
// const {Server} = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io= new Server(server, {
//   cors:{origin:'http://localhost:3000'}
// });
// //Middleware
// app.use(express.json());
// app.use(cors());

// // routes
// app.use('/api/users',userRoutes);
// app.use('/api/auth',authRoutes);
// app.use('/api/skill',skillRoutes);
// app.use('/api/barter',barterRoutes);
// // app.use('/api/')
// mongoose.connect(process.env.MONGO_URI).then(() => {console.log('MongoDB connected')}).catch((error) => {console.log(`MongoDB connection error: ${error}`)});
// //shomya123@gmail.com pass->1234
// // shivam123@gmail.com pass->1234
// // mongodb://localhost:27017/skill-swap
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log('MongoDB connected'))
//   .catch((error) => console.error(`MongoDB connection error: ${error}`));

//   app.get('/', (req, res) => {
//   res.send('API is running............');
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




import chatRoutes from './routes/chatRoutes.js';
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import barterRoutes from './routes/barterRoutes.js';

dotenv.config();

import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app); // <---- this creates the HTTP server
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173' }
});

app.use(express.json());
app.use(cors());
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/skill', skillRoutes);
app.use('/api/barter', barterRoutes);
app.use('/api/chat', chatRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error(`MongoDB connection error: ${error}`));
app.get('/', (req, res) => {
  res.send('API is running............');
});
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('send_message', (data) => {
    console.log('Message received:', data);
    io.to(data.roomId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
