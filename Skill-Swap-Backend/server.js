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




// import chatRoutes from './routes/chatRoutes.js';
// import express from 'express';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import userRoutes from './routes/userRoutes.js';
// import authRoutes from './routes/authRoutes.js';
// import skillRoutes from './routes/skillRoutes.js';
// import barterRoutes from './routes/barterRoutes.js';
// import http from 'http';
// import { Server } from 'socket.io';
// import connect_DB from './config/db.js';
// import cookieParser from 'cookie-parser';

// dotenv.config();

// connect_DB()

// const app = express();
// // app.use(cors());

// const allowedOrigins = [
//   "http://localhost:5173",
//   '*' // for local testing
// ];
// app.use(express.json());

// // app.use(cors({
// //   origin: '*',
// //   credentials: true, // Allow cookies or auth headers
// //   allowedHeaders: ["Content-Type", "Authorization"],
// //   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// // }));

// app.use(cors({
//   origin: 'http://localhost:5173', // no wildcard
//   credentials: true
// }));

// app.use((req, res, next) => {
//   res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
//   res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
//   next();
// });

// app.use(cookieParser());


// const server = http.createServer(app); // <---- this creates the HTTP server
// const io = new Server(server, {
//  cors: {
//     origin: "http://localhost:5173",
//     credentials: true,
//     transports: ["websocket", "polling"],
//   },
//   path: "/socket.io",
// });

// const userSocketMap = {};


// app.use(express.json());
// app.use('/api/users', userRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/skill', skillRoutes);
// app.use('/api/barter', barterRoutes);
// app.use('/api/chat', chatRoutes);
// app.get("/", (req, res) => {
//   res.send("API is running............");
// });
// io.on("connection", (socket) => {
//   const userId = socket.handshake.query.userId;

//   if (userId) userSocketMap[userId] = socket.id;

//   io.emit("getOnlineUser", Object.keys(userSocketMap));

//   console.log(`New client connected: ${socket.id}`);

//   socket.on("join_room", (roomId) => {
//     socket.join(roomId);
//     console.log(`Socket ${socket.id} joined room ${roomId}`);
//   });

//   socket.on("send_message", (data) => {
//     console.log("Message received:", data);
//     io.to(data.roomId).emit("receive_message", data);
//   });

//   socket.on("disconnect", () => {
//     console.log(`Client disconnected: ${socket.id}`);
//   });
// });
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));






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
import { Server } from 'socket.io';
import connect_DB from './config/db.js';
import cookieParser from 'cookie-parser';

dotenv.config();
connect_DB();

const app = express();

// ===== MIDDLEWARE ORDER IS CRITICAL =====

// 1. Cookie parser MUST come before routes
app.use(cookieParser());

// 2. JSON parser
app.use(express.json());

// 3. CORS configuration with debugging
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cookie'
  ],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// 4. Debug middleware - ADD THIS
app.use((req, res, next) => {
  console.log(`\n=== ${req.method} ${req.path} ===`);
  console.log('Origin:', req.headers.origin);
  console.log('Cookies received:', req.cookies);
  console.log('Raw cookie header:', req.headers.cookie);
  
  // Log response headers after they're set
  const originalSend = res.send;
  res.send = function(data) {
    console.log('Response headers:', res.getHeaders());
    console.log('Set-Cookie header:', res.get('Set-Cookie'));
    return originalSend.call(this, data);
  };
  
  next();
});

// 5. Remove these problematic headers that might interfere with cookies
// app.use((req, res, next) => {
//   res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
//   res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
//   next();
// });

// ===== ROUTES =====
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/skill', skillRoutes);
app.use('/api/barter', barterRoutes);
app.use('/api/chat', chatRoutes);

app.get("/", (req, res) => {
  res.send("API is running............");
});

// ===== TEST ROUTE FOR COOKIE DEBUGGING =====
app.get('/api/test-cookie', (req, res) => {
  console.log('\n=== COOKIE TEST ===');
  console.log('Received cookies:', req.cookies);
  
  // Set a test cookie
  res.cookie('test', 'hello-world', {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
    maxAge: 60000, // 1 minute
    path: '/'
  });
  
  res.json({ 
    message: 'Test cookie set', 
    receivedCookies: req.cookies,
    timestamp: new Date().toISOString()
  });
});

// ===== SOCKET.IO =====
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    transports: ["websocket", "polling"],
  },
  path: "/socket.io",
});

const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;
  io.emit("getOnlineUser", Object.keys(userSocketMap));
  console.log(`New client connected: ${socket.id}`);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("send_message", (data) => {
    console.log("Message received:", data);
    io.to(data.roomId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUser", Object.keys(userSocketMap));
  });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('CORS enabled for: http://localhost:5173');
  console.log('Cookie parser enabled');
});

// ===== UPDATED AUTH ROUTE FOR DEBUGGING =====
// Add this to your authRoutes.js:

/*
router.post('/login', async (req, res) => {
    console.log('\n=== LOGIN ATTEMPT ===');
    console.log('Request body:', { email: req.body.email, password: '***' });
    console.log('Request headers:', req.headers);
    console.log('Existing cookies:', req.cookies);
    
    const { email, password } = req.body;
    
    try {
        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const isMatch = await bcrypt.compare(password, userExist.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET, {
            expiresIn: "2w"
        });

        const cookieOptions = {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        };
        
        console.log('Setting cookie with options:', cookieOptions);
        console.log('Token length:', token.length);
        
        res.cookie("token", token, cookieOptions);
        
        console.log('Cookie set, sending response...');
        
        return res.status(200).json({ 
            status: 200, 
            user: userExist, 
            message: "Login successful",
            debug: {
                tokenSet: true,
                cookieOptions: cookieOptions
            }
        });
        
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});
*/
