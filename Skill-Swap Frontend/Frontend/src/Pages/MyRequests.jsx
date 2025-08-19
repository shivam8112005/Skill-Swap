// import { useState, useEffect } from "react"
// import { Link } from "react-router-dom"
// import {
//   ArrowLeft,
//   Send,
//   Inbox,
//   Clock,
//   CheckCircle,
//   XCircle,
//   Eye,
//   MessageCircle,
//   Calendar,
//   AlertCircle,
//   Loader,
//   LogIn,
//   RefreshCw,
//   Filter,
//   Search,
//   Award,
//   TrendingUp,
// } from "lucide-react"
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const MyRequests = () => {
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState("")
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [requests, setRequests] = useState([])
//   const [sentRequests, setSentRequests] = useState([])
//   const [activeTab, setActiveTab] = useState("received")
//   const [searchTerm, setSearchTerm] = useState("")
//   const [filterStatus, setFilterStatus] = useState("all")

//   useEffect(() => {
//     checkAuthAndFetchRequests()
//   }, [])

//   const checkAuthAndFetchRequests = async () => {
//     try {
//       console.log('inside checkAuthAndFetchRequests');
      
//       setLoading(true)
//       setError("")

//       const response = await fetch(`${BASE_URL}barter/my-requests`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//       })

//       if (response.status === 401) {
//         setIsAuthenticated(false)
//         return
//       }

//       if (!response.ok) {
//         throw new Error("Failed to fetch requests")
//       }

//       const data = await response.json()
//       setRequests(data.requests || [])
//       setSentRequests(data.sent || [])
//       setIsAuthenticated(true)
//     } catch (err) {
//       setError("Failed to load requests. Please try again.")
//       console.error("Error fetching requests:", err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleStatusUpdate = async (requestId, newStatus) => {
//     try {
//       const response = await fetch(`${BASE_URL}barter/request/${requestId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({ status: newStatus }),
//       })

//       if(newStatus === "accepted"){
        
//       }

//       if (response.ok) {
//         // Refresh the requests
//         checkAuthAndFetchRequests()
//       }
//     } catch (err) {
//       console.error("Error updating request status:", err)
//     }
//   }

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "pending":
//         return "bg-yellow-100 text-yellow-800"
//       case "accepted":
//         return "bg-green-100 text-green-800"
//       case "rejected":
//         return "bg-red-100 text-red-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "pending":
//         return Clock
//       case "accepted":
//         return CheckCircle
//       case "rejected":
//         return XCircle
//       default:
//         return Clock
//     }
//   }

  

//   const filteredRequests = (requestList) => {
//     return requestList.filter((request) => {
//       const matchesSearch =
//         request.senderSkillPost?.requiredSkills?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         request.senderSkillPost?.providedSkills?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         request.receiverSkillPost?.requiredSkills?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         request.receiverSkillPost?.providedSkills?.toLowerCase().includes(searchTerm.toLowerCase())

//       const matchesFilter = filterStatus === "all" || request.status === filterStatus

//       return matchesSearch && matchesFilter
//     })
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
//         <div className="text-center">
//           <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
//           <p className="text-gray-600 text-lg">Loading your requests...</p>
//         </div>
//       </div>
//     )
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
//             <h1 className="text-4xl font-bold mb-2">My Requests</h1>
//             <p className="text-lg opacity-90">Manage your barter requests</p>
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
//               You need to be logged in to view your barter requests. Please sign in to continue.
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
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-8 md:px-16 rounded-b-3xl shadow-lg">
//         <div className="max-w-6xl mx-auto">
//           <div className="flex items-center justify-between mb-6">
//             <Link
//               to="/"
//               className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-xl transition-colors duration-200"
//             >
//               <ArrowLeft className="w-5 h-5" />
//               <span>Back to Dashboard</span>
//             </Link>
//             <button
//               onClick={checkAuthAndFetchRequests}
//               className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-xl transition-colors duration-200"
//             >
//               <RefreshCw className="w-5 h-5" />
//               <span>Refresh</span>
//             </button>
//           </div>
//           <h1 className="text-4xl font-bold mb-2">My Requests</h1>
//           <p className="text-lg opacity-90">Manage your sent and received barter requests</p>
//         </div>
//       </div>

//       <div className="max-w-6xl mx-auto px-6 mt-10 space-y-8">
//         {/* Error Message */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
//             <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
//             <p className="text-red-700">{error}</p>
//           </div>
//         )}

//         {/* Tab Navigation */}
//         <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//           <div className="flex">
//             <button
//               onClick={() => setActiveTab("received")}
//               className={`flex-1 px-8 py-6 font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
//                 activeTab === "received"
//                   ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
//                   : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
//               }`}
//             >
//               <Inbox className="w-6 h-6" />
//               <span>Received ({requests.length})</span>
//             </button>
//             <button
//               onClick={() => setActiveTab("sent")}
//               className={`flex-1 px-8 py-6 font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
//                 activeTab === "sent"
//                   ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
//                   : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
//               }`}
//             >
//               <Send className="w-6 h-6" />
//               <span>Sent ({sentRequests.length})</span>
//             </button>
//           </div>
//         </div>

//         {/* Search and Filter */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search by skills..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//               />
//             </div>
//             <div className="relative">
//               <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <select
//                 value={filterStatus}
//                 onChange={(e) => setFilterStatus(e.target.value)}
//                 className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
//               >
//                 <option value="all">All Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="accepted">Accepted</option>
//                 <option value="rejected">Rejected</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Requests List */}
//         <div className="space-y-6">
//           {activeTab === "received" ? (
//             filteredRequests(requests).length > 0 ? (
//               filteredRequests(requests).map((request) => {
//                 console.log(request);
                
//                 return(
//                 <div
//                   key={request._id}
//                   className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
//                 >
//                   <div className="p-6">
//                     <div className="flex justify-between items-start mb-4">
//                       <div className="flex-1">
//                         <div className="flex items-center space-x-3 mb-2">
//                           <h3 className="text-xl font-bold text-gray-800">Incoming Request</h3>
//                           <span
//                             className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}
//                           >
//                             {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
//                           </span>
//                         </div>
//                         <p className="text-gray-600 mb-2">
//                           <span className="font-medium">From:</span> {request.sender?.name || "Unknown User"}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="grid md:grid-cols-2 gap-6 mb-6">
//                       <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
//                         <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
//                           <TrendingUp className="w-4 h-4 mr-2" />
//                           They Want
//                         </h4>
//                         <p className="text-blue-700 font-medium">{request.senderSkillPost?.requiredSkills}</p>
//                         <p className="text-blue-600 text-sm mt-1">{request.senderSkillPost?.skillDescription}</p>
//                       </div>
//                       <div className="bg-green-50 rounded-xl p-4 border border-green-200">
//                         <h4 className="font-semibold text-green-800 mb-2 flex items-center">
//                           <Award className="w-4 h-4 mr-2" />
//                           They Offer
//                         </h4>
//                         <p className="text-green-700 font-medium">{request.senderSkillPost?.providedSkills}</p>
//                         <p className="text-green-600 text-sm mt-1">In exchange for your skills</p>
//                       </div>
//                     </div>

//                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                       <div className="flex items-center space-x-4 text-sm text-gray-600">
//                         <div className="flex items-center space-x-2">
//                           <Calendar className="w-4 h-4" />
//                           <span>Received: {formatDate(request.createdAt)}</span>
//                         </div>
//                       </div>

//                       {request.status === "pending" && (
//                         <div className="flex space-x-3">
//                           <button
//                             onClick={() => handleStatusUpdate(request._id, "rejected")}
//                             className="bg-red-100 hover:bg-red-200 text-red-700 px-6 py-2 rounded-xl transition-colors duration-200 flex items-center space-x-2"
//                           >
//                             <XCircle className="w-4 h-4" />
//                             <span>Decline</span>
//                           </button>
//                           <button
//                             onClick={() => handleStatusUpdate(request._id, "accepted")}
//                             className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl transition-colors duration-200 flex items-center space-x-2"
//                           >
//                             <CheckCircle className="w-4 h-4" />
//                             <span>Accept</span>
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>)
// })
//             ) : (
//               <div className="text-center py-16">
//                 <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                   <Inbox className="w-12 h-12 text-gray-400" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">No Received Requests</h3>
//                 <p className="text-gray-600">You haven't received any barter requests yet.</p>
//               </div>
//             )
//           ) : filteredRequests(sentRequests).length > 0 ? (
//             filteredRequests(sentRequests).map((request) => (
//               <div
//                 key={request._id}
//                 className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
//               >
//                 <div className="p-6">
//                   <div className="flex justify-between items-start mb-4">
//                     <div className="flex-1">
//                       <div className="flex items-center space-x-3 mb-2">
//                         <h3 className="text-xl font-bold text-gray-800">Sent Request</h3>
//                         <span
//                           className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}
//                         >
//                           {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
//                         </span>
//                       </div>
//                       <p className="text-gray-600 mb-2">
//                         <span className="font-medium">To:</span> {request.receiver?.name || "Unknown User"}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="grid md:grid-cols-2 gap-6 mb-6">
//                     <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
//                       <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
//                         <TrendingUp className="w-4 h-4 mr-2" />
//                         You Want
//                       </h4>
//                       <p className="text-purple-700 font-medium">{request.receiverSkillPost?.requiredSkills}</p>
//                       <p className="text-purple-600 text-sm mt-1">{request.receiverSkillPost?.skillDescription}</p>
//                     </div>
//                     <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
//                       <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
//                         <Award className="w-4 h-4 mr-2" />
//                         You Offer
//                       </h4>
//                       <p className="text-orange-700 font-medium">{request.senderSkillPost?.providedSkills}</p>
//                       <p className="text-orange-600 text-sm mt-1">Your skill offering</p>
//                     </div>
//                   </div>

//                   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                     <div className="flex items-center space-x-4 text-sm text-gray-600">
//                       <div className="flex items-center space-x-2">
//                         <Calendar className="w-4 h-4" />
//                         <span>Sent: {formatDate(request.createdAt)}</span>
//                       </div>
//                     </div>

//                     <div className="flex space-x-3">
//                       <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-xl transition-colors duration-200 flex items-center space-x-2">
//                         <Eye className="w-4 h-4" />
//                         <span>View Details</span>
//                       </button>
//                       <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-6 py-2 rounded-xl transition-colors duration-200 flex items-center space-x-2">
//                         <MessageCircle className="w-4 h-4" />
//                         <span>Message</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-center py-16">
//               <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <Send className="w-12 h-12 text-gray-400" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-800 mb-2">No Sent Requests</h3>
//               <p className="text-gray-600">You haven't sent any barter requests yet.</p>
//             </div>
//           )}
//         </div>

//         {/* Stats Summary */}
//         <div className="grid md:grid-cols-3 gap-6">
//           <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
//             <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
//               <Inbox className="w-6 h-6 text-blue-600" />
//             </div>
//             <h4 className="font-semibold text-gray-800 mb-2">Received</h4>
//             <p className="text-2xl font-bold text-blue-600">{requests.length}</p>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
//             <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
//               <Send className="w-6 h-6 text-purple-600" />
//             </div>
//             <h4 className="font-semibold text-gray-800 mb-2">Sent</h4>
//             <p className="text-2xl font-bold text-purple-600">{sentRequests.length}</p>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
//             <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
//               <CheckCircle className="w-6 h-6 text-green-600" />
//             </div>
//             <h4 className="font-semibold text-gray-800 mb-2">Pending</h4>
//             <p className="text-2xl font-bold text-green-600">
//               {[...requests, ...sentRequests].filter((req) => req.status === "pending").length}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default MyRequests










import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  Send,
  Inbox,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MessageCircle,
  Calendar,
  AlertCircle,
  Loader,
  LogIn,
  RefreshCw,
  Filter,
  Search,
  User,
  ExternalLink,
  X,
  Star,
} from "lucide-react"

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const MyRequests = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [requests, setRequests] = useState([])
  const [sentRequests, setSentRequests] = useState([])
  const [activeTab, setActiveTab] = useState("received")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  useEffect(() => {
    checkAuthAndFetchRequests()
  }, [])

  const checkAuthAndFetchRequests = async () => {
    try {
      console.log("inside checkAuthAndFetchRequests")

      setLoading(true)
      setError("")

      const response = await fetch(`${BASE_URL}barter/my-requests`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (response.status === 401) {
        setIsAuthenticated(false)
        return
      }

      if (!response.ok) {
        throw new Error("Failed to fetch requests")
      }

      const data = await response.json()
      setRequests(data.requests || [])
      setSentRequests(data.sent || [])
      setIsAuthenticated(true)
    } catch (err) {
      setError("Failed to load requests. Please try again.")
      console.error("Error fetching requests:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      const response = await fetch(`${BASE_URL}barter/request/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Refresh the requests
        checkAuthAndFetchRequests()
        // Close modal if open
        if (showDetailsModal) {
          setShowDetailsModal(false)
          setSelectedRequest(null)
        }
      }
    } catch (err) {
      console.error("Error updating request status:", err)
    }
  }

  const openDetailsModal = (request) => {
    setSelectedRequest(request)
    setShowDetailsModal(true)
  }

  const closeDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedRequest(null)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return Clock
      case "accepted":
        return CheckCircle
      case "rejected":
        return XCircle
      default:
        return Clock
    }
  }

  const filteredRequests = (requestList) => {
    return requestList.filter((request) => {
      const matchesSearch =
        request.senderSkillPost?.requiredSkills?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.senderSkillPost?.providedSkills?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.receiverSkillPost?.requiredSkills?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.receiverSkillPost?.providedSkills?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.sender?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.receiver?.name?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFilter = filterStatus === "all" || request.status === filterStatus

      return matchesSearch && matchesFilter
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your requests...</p>
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
            <h1 className="text-4xl font-bold mb-2">My Requests</h1>
            <p className="text-lg opacity-90">Manage your barter requests</p>
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
              You need to be logged in to view your barter requests. Please sign in to continue.
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-8 md:px-16 rounded-b-3xl shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/"
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-xl transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
            <button
              onClick={checkAuthAndFetchRequests}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-xl transition-colors duration-200"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh</span>
            </button>
          </div>
          <h1 className="text-4xl font-bold mb-2">My Requests</h1>
          <p className="text-lg opacity-90">Manage your sent and received barter requests</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-10 space-y-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="flex">
            <button
              onClick={() => setActiveTab("received")}
              className={`flex-1 px-8 py-6 font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                activeTab === "received"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              <Inbox className="w-6 h-6" />
              <span>Received ({requests.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("sent")}
              className={`flex-1 px-8 py-6 font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                activeTab === "sent"
                  ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                  : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
              }`}
            >
              <Send className="w-6 h-6" />
              <span>Sent ({sentRequests.length})</span>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by skills or names..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-6">
          {activeTab === "received" ? (
            filteredRequests(requests).length > 0 ? (
              filteredRequests(requests).map((request) => (
                <div
                  key={request._id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">Incoming Request</h3>
                          <p className="text-gray-600">
                            <span className="font-medium">From:</span> {request.sender?.name || "Unknown User"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}
                        >
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Skill Posts Comparison */}
                    <div className="grid lg:grid-cols-2 gap-6 mb-6">
                      {/* Sender's Post (What they want/offer) */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-blue-800 flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            Their Request
                          </h4>
                          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Sender</span>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs font-medium text-blue-700 mb-1">THEY WANT:</p>
                            <p className="text-blue-800 font-semibold">
                              {request.senderSkillPost?.requiredSkills || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-blue-700 mb-1">THEY OFFER:</p>
                            <p className="text-blue-700">
                              {request.senderSkillPost?.providedSkills || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-blue-700 mb-1">DESCRIPTION:</p>
                            <p className="text-blue-600 text-sm line-clamp-2">
                              {request.senderSkillPost?.skillDescription || "No description provided"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Receiver's Post (Your post they're interested in) */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-green-800 flex items-center">
                            <Star className="w-4 h-4 mr-2" />
                            Your Post
                          </h4>
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Receiver</span>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs font-medium text-green-700 mb-1">YOU WANT:</p>
                            <p className="text-green-800 font-semibold">
                              {request.receiverSkillPost?.requiredSkills || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-green-700 mb-1">YOU OFFER:</p>
                            <p className="text-green-700">
                              {request.receiverSkillPost?.providedSkills || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-green-700 mb-1">DESCRIPTION:</p>
                            <p className="text-green-600 text-sm line-clamp-2">
                              {request.receiverSkillPost?.skillDescription || "No description provided"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Received: {formatDate(request.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={() => openDetailsModal(request)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl transition-colors duration-200 flex items-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>

                        {request.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(request._id, "rejected")}
                              className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-xl transition-colors duration-200 flex items-center space-x-2"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>Decline</span>
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(request._id, "accepted")}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-colors duration-200 flex items-center space-x-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Accept</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Inbox className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Received Requests</h3>
                <p className="text-gray-600">You haven't received any barter requests yet.</p>
              </div>
            )
          ) : filteredRequests(sentRequests).length > 0 ? (
            filteredRequests(sentRequests).map((request) => (
              <div
                key={request._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Send className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Sent Request</h3>
                        <p className="text-gray-600">
                          <span className="font-medium">To:</span> {request.receiver?.name || "Unknown User"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Skill Posts Comparison */}
                  <div className="grid lg:grid-cols-2 gap-6 mb-6">
                    {/* Your Post (What you want/offer) */}
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-5 border border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-purple-800 flex items-center">
                          <Star className="w-4 h-4 mr-2" />
                          Your Request
                        </h4>
                        <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">Sender</span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-purple-700 mb-1">YOU WANT:</p>
                          <p className="text-purple-800 font-semibold">
                            {request.senderSkillPost?.requiredSkills || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-purple-700 mb-1">YOU OFFER:</p>
                          <p className="text-purple-700">
                            {request.senderSkillPost?.providedSkills || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-purple-700 mb-1">DESCRIPTION:</p>
                          <p className="text-purple-600 text-sm line-clamp-2">
                            {request.senderSkillPost?.skillDescription || "No description provided"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Their Post (What they want/offer) */}
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-orange-800 flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Their Post
                        </h4>
                        <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">Receiver</span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-orange-700 mb-1">THEY WANT:</p>
                          <p className="text-orange-800 font-semibold">
                            {request.receiverSkillPost?.requiredSkills || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-orange-700 mb-1">THEY OFFER:</p>
                          <p className="text-orange-700">
                            {request.receiverSkillPost?.providedSkills || "Not specified"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-orange-700 mb-1">DESCRIPTION:</p>
                          <p className="text-orange-600 text-sm line-clamp-2">
                            {request.receiverSkillPost?.skillDescription || "No description provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Sent: {formatDate(request.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => openDetailsModal(request)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl transition-colors duration-200 flex items-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                      <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-xl transition-colors duration-200 flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4" />
                        <span>Message</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Sent Requests</h3>
              <p className="text-gray-600">You haven't sent any barter requests yet.</p>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Received</h4>
            <p className="text-2xl font-bold text-blue-600">{requests.length}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Send className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Sent</h4>
            <p className="text-2xl font-bold text-purple-600">{sentRequests.length}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Pending</h4>
            <p className="text-2xl font-bold text-green-600">
              {[...requests, ...sentRequests].filter((req) => req.status === "pending").length}
            </p>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Request Details</h2>
                  <p className="text-blue-100">
                    {activeTab === "received" ? "Incoming" : "Sent"} Request • {formatDate(selectedRequest.createdAt)}
                  </p>
                </div>
                <button
                  onClick={closeDetailsModal}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status and Participants */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Participants
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Sender:</span>
                      <span className="font-medium">{selectedRequest.sender?.name || "Unknown"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Receiver:</span>
                      <span className="font-medium">{selectedRequest.receiver?.name || "Unknown"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Status & Timeline
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedRequest.status)}`}
                      >
                        {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">{formatDate(selectedRequest.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Skill Posts */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2">
                  Skill Exchange Details
                </h3>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Sender's Skill Post */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-blue-800 flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Sender's Post
                      </h4>
                      <Link
                        to={`/profile/${selectedRequest.sender?._id}`}
                        className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View Profile</span>
                      </Link>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-blue-700 mb-2">SKILLS WANTED:</p>
                        <p className="text-blue-800 font-medium bg-blue-100 p-3 rounded-lg">
                          {selectedRequest.senderSkillPost?.requiredSkills || "Not specified"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-blue-700 mb-2">SKILLS OFFERED:</p>
                        <p className="text-blue-700 bg-blue-100 p-3 rounded-lg">
                          {selectedRequest.senderSkillPost?.providedSkills || "Not specified"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-blue-700 mb-2">DESCRIPTION:</p>
                        <p className="text-blue-600 bg-blue-100 p-3 rounded-lg text-sm leading-relaxed">
                          {selectedRequest.senderSkillPost?.skillDescription || "No description provided"}
                        </p>
                      </div>

                      {selectedRequest.senderSkillPost?.barterDateTime && (
                        <div>
                          <p className="text-sm font-semibold text-blue-700 mb-2">PREFERRED DATE & TIME:</p>
                          <p className="text-blue-600 bg-blue-100 p-3 rounded-lg text-sm flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(selectedRequest.senderSkillPost.barterDateTime)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Receiver's Skill Post */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-green-800 flex items-center">
                        <Star className="w-5 h-5 mr-2" />
                        Receiver's Post
                      </h4>
                      <Link
                        to={`/profile/${selectedRequest.receiver?._id}`}
                        className="text-green-600 hover:text-green-800 flex items-center space-x-1 text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View Profile</span>
                      </Link>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-green-700 mb-2">SKILLS WANTED:</p>
                        <p className="text-green-800 font-medium bg-green-100 p-3 rounded-lg">
                          {selectedRequest.receiverSkillPost?.requiredSkills || "Not specified"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-green-700 mb-2">SKILLS OFFERED:</p>
                        <p className="text-green-700 bg-green-100 p-3 rounded-lg">
                          {selectedRequest.receiverSkillPost?.providedSkills || "Not specified"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-green-700 mb-2">DESCRIPTION:</p>
                        <p className="text-green-600 bg-green-100 p-3 rounded-lg text-sm leading-relaxed">
                          {selectedRequest.receiverSkillPost?.skillDescription || "No description provided"}
                        </p>
                      </div>

                      {selectedRequest.receiverSkillPost?.barterDateTime && (
                        <div>
                          <p className="text-sm font-semibold text-green-700 mb-2">PREFERRED DATE & TIME:</p>
                          <p className="text-green-600 bg-green-100 p-3 rounded-lg text-sm flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(selectedRequest.receiverSkillPost.barterDateTime)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {activeTab === "received" && selectedRequest.status === "pending" && (
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => handleStatusUpdate(selectedRequest._id, "rejected")}
                    className="bg-red-100 hover:bg-red-200 text-red-700 px-6 py-3 rounded-xl transition-colors duration-200 flex items-center space-x-2 font-medium"
                  >
                    <XCircle className="w-5 h-5" />
                    <span>Decline Request</span>
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedRequest._id, "accepted")}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-colors duration-200 flex items-center space-x-2 font-medium"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Accept Request</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyRequests
