// import React, { useEffect, useState, useRef } from 'react';
// import io from 'socket.io-client';
// import { useLocation, Link } from 'react-router-dom';
// import { ArrowLeft, Loader, LogIn, Send, MessageCircle } from 'lucide-react';

// // Initialize socket connection outside the omponent to prevent re-initialization on re-renders
// const RENDER_BASE_URL = import.meta.env.VITE_RENDER_API_BASE_URL;
// console.log("url:  ",RENDER_BASE_URL);

// const socket = io(RENDER_BASE_URL); 

// const Chat = () => {
//   const [message, setMessage] = useState('');
//   const [chat, setChat] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [error, setError] = useState('');

//   const location = useLocation();
//   const { barterId, senderId: initialSenderId, receiverId: initialReceiverId } = location.state || {};

//   const chatContainerRef = useRef(null); // Ref for auto-scrolling chat

//   const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// console.log("RENDER_BASE_URL:", RENDER_BASE_URL);
// console.log("BASE_URL:", BASE_URL);
//   useEffect(() => {
//     const checkAuthAndConnectChat = async () => {
//       try {
//         setLoading(true);
//         setError('');

//         // Authenticate user first
//         const authResponse = await fetch(`${BASE_URL}users/userprofile`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         });

//         if (authResponse.status === 401) {
//           setIsAuthenticated(false);
//           setLoading(false);
//           console.log("Chat.jsx: Authentication failed (401).");
//           return;
//         }

//         if (!authResponse.ok) {
//           throw new Error("Failed to verify authentication");
//         }

//         const authData = await authResponse.json();
//         const userId = authData.user._id || authData.user.id;
//         setCurrentUserId(userId);
//         setIsAuthenticated(true);
//         console.log("Chat.jsx: User authenticated. Current User ID:", userId);

//         // Socket connection status logging
//         socket.on('connect', () => {
//           console.log('Socket.IO: Connected to server!');
//           if (barterId) {
//             console.log("Chat.jsx: Emitting join_room on connect:", { barterId, userId });
//             socket.emit("join_room", { barterId, userId });
//           }
//         });

//         socket.on('disconnect', () => {
//           console.log('Socket.IO: Disconnected from server.');
//         });

//         socket.on('connect_error', (err) => {
//           console.error('Socket.IO: Connection Error:', err.message);
//           setError(`Failed to connect to chat server: ${err.message}. Please ensure backend is running.`);
//         });

//         // If already connected (e.g., component re-rendered but socket is persistent)
//         if (socket.connected && barterId) {
//           console.log("Chat.jsx: Socket already connected, emitting join_room:", { barterId, userId });
//           socket.emit("join_room", { barterId, userId });
//         } else if (!socket.connected) {
//           console.log("Chat.jsx: Socket not connected, waiting for 'connect' event.");
//         }

//       } catch (err) {
//         setError("Failed to load chat. Please try again.");
//         console.error("Error during chat authentication/connection:", err);
//         setIsAuthenticated(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuthAndConnectChat();

//     // Socket listeners for messages and history
//     const handleReceiveMessage = (data) => {
//       console.log("Chat.jsx: Received new message:", data);
//       setChat((prev) => [...prev, data]);
//     };

//     const handleChatHistory = (historyData) => {
//       console.log("Chat.jsx: Received chat history:", historyData);
//       setChat(historyData);
//     };

//     socket.on("receive_message", handleReceiveMessage);
//     socket.on("chat_history", handleChatHistory);

//     // Cleanup function for socket listeners
//     return () => {
//       console.log("Chat.jsx: Cleaning up socket listeners.");
//       socket.off("connect");
//       socket.off("disconnect");
//       socket.off("connect_error");
//       socket.off("receive_message", handleReceiveMessage);
//       socket.off("chat_history", handleChatHistory);
//       if (barterId && currentUserId) { // Only emit leave if we actually joined
//         socket.emit("leave_room", { barterId, userId: currentUserId });
//       }
//     };
//   }, [barterId, currentUserId, RENDER_BASE_URL]); // Re-run if barterId or currentUserId changes

//   // Auto-scroll to bottom of chat
//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   }, [chat]);

//   const sendMessage = () => {
//     if (!message.trim() || !barterId || !currentUserId) {
//       console.warn("Chat.jsx: Cannot send message. Missing message content, barterId, or currentUserId.");
//       return;
//     }

//     const messageData = {
//       barterId,
//       senderId: currentUserId, // Use the authenticated user's ID
//       receiverId: initialReceiverId, // This might need to be dynamically determined on backend
//       content: message,
//       timestamp: new Date().toISOString(), // Send ISO string for consistent parsing
//     };

//     console.log("Chat.jsx: Emitting send_message:", messageData);
//     socket.emit("send_message", messageData);
//     setMessage('');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
//         <div className="text-center">
//           <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
//           <p className="text-gray-600 text-lg">Loading chat...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-8 md:px-16 rounded-b-3xl shadow-lg">
//           <div className="max-w-4xl mx-auto">
//             <div className="flex items-center justify-between mb-6">
//               <Link
//                 to="/"
//                 className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-xl transition-colors duration-200"
//               >
//                 <ArrowLeft className="w-5 h-5" />
//                 <span>Back</span>
//               </Link>
//             </div>
//             <h1 className="text-4xl font-bold mb-2">Chat</h1>
//             <p className="text-lg opacity-90">Connect with your barter partner</p>
//           </div>
//         </div>

//         {/* Login Required Message */}
//         <div className="max-w-4xl mx-auto px-6 mt-10">
//           <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
//             <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <LogIn className="w-12 h-12 text-blue-600" />
//             </div>
//             <h2 className="text-3xl font-bold text-gray-800 mb-4">Login Required</h2>
//             <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
//               You need to be logged in to access the chat. Please sign in to continue.
//             </p>
//             <Link
//               to="/login-signup"
//               className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 inline-flex items-center space-x-3 text-lg shadow-lg hover:shadow-xl"
//             >
//               <LogIn className="w-6 h-6" />
//               <span>Sign In / Sign Up</span>
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
//         <div className="text-center p-6 bg-white rounded-xl shadow-lg">
//           <p className="text-red-600 text-lg mb-4">{error}</p>
//           <button
//             onClick={() => window.location.reload()} // Simple refresh to retry
//             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!barterId) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
//         <div className="text-center p-6 bg-white rounded-xl shadow-lg">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Chat Not Found</h2>
//           <p className="text-gray-600 mb-6">Please navigate to chat from an active barter.</p>
//           <Link
//             to="/active-requests"
//             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
//           >
//             View Active Barters
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-6">
//       <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//         <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <Link to="/active-requests" className="text-white hover:text-blue-100">
//               <ArrowLeft className="w-6 h-6" />
//             </Link>
//             <h2 className="text-2xl font-bold">Barter Chat</h2>
//           </div>
//           <MessageCircle className="w-6 h-6" />
//         </div>

//         {/* Chat Box */}
//         <div
//           ref={chatContainerRef}
//           className="p-6 space-y-4 h-[400px] overflow-y-auto bg-gray-50"
//         >
//           {chat.length === 0 && (
//             <div className="text-center text-gray-500 py-10">
//               <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
//               <p>No messages yet. Start the conversation!</p>
//             </div>
//           )}
//           {chat.map((msg) => ( // Removed index 'i' as key, using msg._id
//             <div
//               key={msg._id} // Use msg._id for unique key
//               className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
//             >
//               <div
//                 className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
//                   msg.senderId === currentUserId
//                     ? 'bg-blue-500 text-white rounded-br-none'
//                     : 'bg-gray-200 text-gray-800 rounded-bl-none'
//                 }`}
//               >
//                 <p className="font-semibold text-sm mb-1">
//                   {msg.senderId === currentUserId ? 'You' : 'Partner'}
//                 </p>
//                 <p>{msg.content}</p>
//                 <p className="text-xs opacity-75 mt-1">
//                   {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Input & Send */}
//         <div className="p-6 border-t border-gray-100 bg-white flex gap-3">
//           <input
//             type="text"
//             className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
//             placeholder="Type your message..."
//             disabled={!isAuthenticated || !barterId}
//           />
//           <button
//             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
//             onClick={sendMessage}
//             disabled={!message.trim() || !isAuthenticated || !barterId}
//           >
//             <Send className="w-5 h-5" />
//             <span>Send</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;















import { useEffect, useState, useRef } from "react"
import io from "socket.io-client"
import { useLocation, Link } from "react-router-dom"
import { ArrowLeft, Loader, LogIn, Send, MessageCircle } from "lucide-react"

// Initialize socket connection outside the component to prevent re-initialization on re-renders
const RENDER_BASE_URL = import.meta.env.VITE_RENDER_API_BASE_URL
console.log("url:  ", RENDER_BASE_URL)

const socket = io(RENDER_BASE_URL)

const Chat = () => {
  const [message, setMessage] = useState("")
  const [chat, setChat] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [error, setError] = useState("")

  const location = useLocation()
  const { barterId, senderId: initialSenderId, receiverId: initialReceiverId } = location.state || {}

  const chatContainerRef = useRef(null) // Ref for auto-scrolling chat

  const BASE_URL = import.meta.env.VITE_API_BASE_URL
  console.log("RENDER_BASE_URL:", RENDER_BASE_URL)
  console.log("BASE_URL:", BASE_URL)
  useEffect(() => {
    const checkAuthAndConnectChat = async () => {
      try {
        setLoading(true)
        setError("")

        // Authenticate user first
        const authResponse = await fetch(`${BASE_URL}users/userprofile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })

        if (authResponse.status === 401) {
          setIsAuthenticated(false)
          setLoading(false)
          console.log("Chat.jsx: Authentication failed (401).")
          return
        }

        if (!authResponse.ok) {
          throw new Error("Failed to verify authentication")
        }

        const authData = await authResponse.json()
        const userId = authData.user._id || authData.user.id
        setCurrentUserId(userId)
        setIsAuthenticated(true)
        console.log("Chat.jsx: User authenticated. Current User ID:", userId)

        // Socket connection status logging
        socket.on("connect", () => {
          console.log("Socket.IO: Connected to server!")
          if (barterId) {
            console.log("Chat.jsx: Emitting join_room on connect:", { barterId, userId })
            socket.emit("join_room", { barterId, userId })
          }
        })

        socket.on("disconnect", () => {
          console.log("Socket.IO: Disconnected from server.")
        })

        socket.on("connect_error", (err) => {
          console.error("Socket.IO: Connection Error:", err.message)
          setError(`Failed to connect to chat server: ${err.message}. Please ensure backend is running.`)
        })

        // If already connected (e.g., component re-rendered but socket is persistent)
        if (socket.connected && barterId) {
          console.log("Chat.jsx: Socket already connected, emitting join_room:", { barterId, userId })
          socket.emit("join_room", { barterId, userId })
        } else if (!socket.connected) {
          console.log("Chat.jsx: Socket not connected, waiting for 'connect' event.")
        }
      } catch (err) {
        setError("Failed to load chat. Please try again.")
        console.error("Error during chat authentication/connection:", err)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndConnectChat()

    // Socket listeners for messages and history
    const handleReceiveMessage = (data) => {
      console.log("Chat.jsx: Received new message:", data)
      setChat((prev) => [...prev, data])
    }

    const handleChatHistory = (historyData) => {
      console.log("Chat.jsx: Received chat history:", historyData)
      setChat(historyData)
    }

    socket.on("receive_message", handleReceiveMessage)
    socket.on("chat_history", handleChatHistory)

    // Cleanup function for socket listeners
    return () => {
      console.log("Chat.jsx: Cleaning up socket listeners.")
      socket.off("connect")
      socket.off("disconnect")
      socket.off("connect_error")
      socket.off("receive_message", handleReceiveMessage)
      socket.off("chat_history", handleChatHistory)
      if (barterId && currentUserId) {
        // Only emit leave if we actually joined
        socket.emit("leave_room", { barterId, userId: currentUserId })
      }
    }
  }, [barterId, currentUserId, RENDER_BASE_URL]) // Re-run if barterId or currentUserId changes

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chat])

  const sendMessage = () => {
    if (!message.trim() || !barterId || !currentUserId) {
      console.warn("Chat.jsx: Cannot send message. Missing message content, barterId, or currentUserId.")
      return
    }

    const messageData = {
      barterId,
      senderId: currentUserId, // Use the authenticated user's ID
      receiverId: initialReceiverId, // This might need to be dynamically determined on backend
      content: message,
      timestamp: new Date().toISOString(), // Send ISO string for consistent parsing
    }

    console.log("Chat.jsx: Emitting send_message:", messageData)
    socket.emit("send_message", messageData)
    setMessage("")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading chat...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-8 md:px-16 rounded-b-3xl shadow-lg">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Link
                to="/"
                className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-xl transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </Link>
            </div>
            <h1 className="text-4xl font-bold mb-2">Chat</h1>
            <p className="text-lg opacity-90">Connect with your barter partner</p>
          </div>
        </div>

        {/* Login Required Message */}
        <div className="max-w-4xl mx-auto px-6 mt-10">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Login Required</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              You need to be logged in to access the chat. Please sign in to continue.
            </p>
            <Link
              to="/login-signup"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 inline-flex items-center space-x-3 text-lg shadow-lg hover:shadow-xl"
            >
              <LogIn className="w-6 h-6" />
              <span>Sign In / Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()} // Simple refresh to retry
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!barterId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Chat Not Found</h2>
          <p className="text-gray-600 mb-6">Please navigate to chat from an active barter.</p>
          <Link
            to="/active-requests"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            View Active Barters
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 flex items-center shadow-lg">
        <Link to="/active-requests" className="text-white hover:text-blue-100 mr-4">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Barter Partner</h2>
            <p className="text-sm text-blue-100">Online</p>
          </div>
        </div>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-1 p-4 overflow-y-auto bg-gray-100"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23f3f4f6' fillOpacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {chat.length === 0 && (
          <div className="text-center text-gray-500 py-20">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No messages yet</p>
            <p className="text-sm">Start the conversation with your barter partner!</p>
          </div>
        )}

        <div className="space-y-3">
          {chat.map((msg) => (
            <div key={msg._id} className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm relative ${
                  msg.senderId === currentUserId
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-md"
                    : "bg-white text-gray-800 rounded-bl-md border border-gray-200"
                }`}
              >
                <div
                  className={`absolute bottom-0 w-0 h-0 ${
                    msg.senderId === currentUserId
                      ? "right-0 border-l-[8px] border-l-purple-500 border-t-[8px] border-t-transparent"
                      : "left-0 border-r-[8px] border-r-white border-t-[8px] border-t-transparent"
                  }`}
                />

                <p className="text-sm leading-relaxed mb-1">{msg.content}</p>
                <div className="flex items-center justify-end space-x-1">
                  <p className={`text-xs ${msg.senderId === currentUserId ? "text-blue-100" : "text-gray-500"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  {msg.senderId === currentUserId && (
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-blue-100 rounded-full"></div>
                      <div className="w-1 h-1 bg-blue-100 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center space-x-3">
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              disabled={!isAuthenticated || !barterId}
            />
          </div>
          <button
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
              message.trim()
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-200 text-gray-400"
            }`}
            onClick={sendMessage}
            disabled={!message.trim() || !isAuthenticated || !barterId}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat
