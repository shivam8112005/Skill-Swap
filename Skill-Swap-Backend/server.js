import chatRoutes from './routes/chatRoutes.js';
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import barterRoutes from './routes/barterRoutes.js';
import http from 'http';
import connect_DB from './config/db.js';
import cookieParser from 'cookie-parser';
import socket from './socket.js';

dotenv.config();

connect_DB()

const app = express();
// app.use(cors());

const allowedOrigins = [
  "http://localhost:5173",
  '*' // for local testing
];
app.use(express.json());

// app.use(cors({
//   origin: '*',
//   credentials: true, // Allow cookies or auth headers
//   allowedHeaders: ["Content-Type", "Authorization"],
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// }));

app.use(cors({
  origin: 'http://localhost:5173', // no wildcard
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

app.use(cookieParser());


const server = http.createServer(app); // <---- this creates the HTTP server
socket(server);
const userSocketMap = {};


app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/skill', skillRoutes);
app.use('/api/barter', barterRoutes);
app.use('/api/chat', chatRoutes);
app.get("/", (req, res) => {
  res.send("API is running............");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));




