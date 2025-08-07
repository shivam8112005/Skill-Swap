import { Server } from 'socket.io';
import Message from './models/chatMessages.js'; // Ensure this path and model name are consistent with server.js
import mongoose from 'mongoose'; // Import mongoose for ObjectId

export default function setupSocket(server) {
  console.log("----------------------------------------------------------------------- heloooo *******************************************************");
  
  console.log("----------------------------------------------------- server: ", server, "-----------------------------------------------------");
  
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:3001', 'https://skill-swap-rho-ecru.vercel.app'], 
      credentials: true,
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket.IO: User Connected: ${socket.id}`);

    socket.on("join_room", async (data) => {
      const { barterId, userId } = data; 
      if (!barterId || !userId) {
        console.error("Socket.IO: join_room missing barterId or userId", data);
        return;
      }
      socket.join(barterId);
      console.log(`Socket.IO: User ${userId} joined room: ${barterId}`);

      try {
        
        const history = await Message.find({ barterId }).sort({ timestamp: 1 });
        console.log(`Socket.IO: Emitting chat_history for room ${barterId}, messages count: ${history.length}`);
        socket.emit("chat_history", history); // Send history to the joining user
      } catch (error) {
        console.error("Socket.IO: Error fetching chat history:", error);
      }
    });

    socket.on("send_message", async (data) => {
      const { barterId, senderId, content, timestamp } = data;
      if (!barterId || !senderId || !content) {
        console.error("Socket.IO: send_message missing data", data);
        return;
      }
      console.log(`Socket.IO: Message from ${senderId} in room ${barterId}: ${content}`);

      try {
        // Save message to database
        const newMessage = new Message({
          barterId: new mongoose.Types.ObjectId(barterId),
          senderId: new mongoose.Types.ObjectId(senderId),
          content,
          timestamp: new Date(timestamp), // Use the timestamp from the client for consistency
        });
        await newMessage.save();
        console.log("Socket.IO: Message saved to DB:", newMessage);

        // Broadcast the saved message object (which includes _id and actual timestamp from DB)
        io.to(barterId).emit("receive_message", newMessage);
        console.log(`Socket.IO: Message broadcasted to room ${barterId}`);
      } catch (error) {
        console.error("Socket.IO: Error saving or broadcasting message:", error);
      }
    });

    // Video call signaling (keeping your existing logic)
    socket.on("call_user", (data) => {
      io.to(data.userToCall).emit("incoming_call", {
        signal: data.signalData,
        from: data.from,
      });
    });

    socket.on("answer_call", (data) => {
      io.to(data.to).emit("call_accepted", data.signal);
    });

    socket.on("disconnect", () => {
      console.log("Socket.IO: User disconnected", socket.id);
    });
  });
}
