// import { useState, useEffect } from "react"
// import { useParams, Link } from "react-router-dom"
// import {
//   User,
//   Mail,
//   Calendar,
//   Star,
//   Award,
//   Shield,
//   CheckCircle,
//   AlertCircle,
//   ArrowLeft,
//   Eye,
//   EyeOff,
//   MessageCircle,
//   Clock,
//   Globe,
//   Lock,
//   Loader,
// } from "lucide-react"

// const UserProfile = () => {
//   const { id } = useParams()
//   const [userData, setUserData] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState("")
//   const [showContactModal, setShowContactModal] = useState(false)
//   const [message, setMessage] = useState("")

//   const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

//   // Fetch user profile data by ID
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         setLoading(true)
//         setError("")

//         const response = await fetch(`http://localhost:5000/api/users/profile/${id}`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         })

//         if (!response.ok) {
//           throw new Error("Failed to fetch profile data")
//         }

//         const data = await response.json()
//         console.log(data);
        
//         setUserData(data.user || data)
//       } catch (err) {
//         setError("Failed to load profile data. Please try again.")
//         console.error("Error fetching profile:", err)
//       } finally {
//         setLoading(false)
//       }
//     }

//     if (id) {
//       fetchUserProfile()
//     }
//   }, [id])

//   const handleContact = () => {
//     setShowContactModal(true)
//   }

//   const handleSendMessage = () => {
//     // Handle message sending logic
//     console.log("Sending message:", message)
//     setShowContactModal(false)
//     setMessage("")
//   }

//   const formatJoinDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     })
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
//         <div className="text-center">
//           <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
//           <p className="text-gray-600 text-lg">Loading profile...</p>
//         </div>
//       </div>
//     )
//   }

//   if ( !userData) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
//         <div className="text-center">
//           <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
//           <p className="text-gray-600 mb-6">{error || "The profile you're looking for doesn't exist."}</p>
//           <Link
//             to="/"
//             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors duration-200 inline-flex items-center space-x-2"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             <span>Go Back</span>
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   // Check if profile is private

//   if (userData.private === true) {
//     console.log(userData);
    
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
//             <h1 className="text-4xl font-bold mb-2">User Profile</h1>
//             <p className="text-lg opacity-90">View user information and skills</p>
//           </div>
//         </div>

//         {/* Private Profile Message */}
//         <div className="max-w-4xl mx-auto px-6 mt-10">
//           <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
//             <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Lock className="w-12 h-12 text-gray-400" />
//             </div>
//             <h2 className="text-3xl font-bold text-gray-800 mb-4">Private Profile</h2>
//             <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
//               This user has set their profile to private. You cannot view their details at this time.
//             </p>
//             <div className="flex items-center justify-center space-x-2 text-gray-500 mb-8">
//               <EyeOff className="w-5 h-5" />
//               <span>Profile visibility: Private</span>
//             </div>
//             <Link
//               to="/"
//               className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 inline-flex items-center space-x-2"
//             >
//               <ArrowLeft className="w-5 h-5" />
//               <span>Back to Posts</span>
//             </Link>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Public profile display
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-8 md:px-16 rounded-b-3xl shadow-lg">
//         <div className="max-w-4xl mx-auto">
//           <div className="flex items-center justify-between mb-6">
//             <Link
//               to="/"
//               className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-xl transition-colors duration-200"
//             >
//               <ArrowLeft className="w-5 h-5" />
//               <span>Back</span>
//             </Link>
//             <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
//               <Eye className="w-4 h-4" />
//               <span className="text-sm">Public Profile</span>
//             </div>
//           </div>
//           <h1 className="text-4xl font-bold mb-2">User Profile</h1>
//           <p className="text-lg opacity-90">View user information and skills</p>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto px-6 mt-10 space-y-8">
//         {/* Profile Header Card */}
//         <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-6">
//                 <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
//                   {userData.name ? (
//                     <span className="text-3xl font-bold">{userData.name.charAt(0).toUpperCase()}</span>
//                   ) : (
//                     <User className="w-12 h-12" />
//                   )}
//                 </div>
//                 <div>
//                   <h2 className="text-3xl font-bold mb-2">{userData.name || "Anonymous User"}</h2>
//                   <div className="flex items-center space-x-2 text-blue-100 mb-3">
//                     <Mail className="w-4 h-4" />
//                     <span>{userData.email || "Email not provided"}</span>
//                   </div>
//                   <div className="flex items-center space-x-4">
//                     <div className="flex items-center space-x-1">
//                       <Award className="w-4 h-4" />
//                       <span className="text-sm">{userData.skills?.length || 0} Skills</span>
//                     </div>
//                     <div className="flex items-center space-x-1">
//                       <Calendar className="w-4 h-4" />
//                       <span className="text-sm">{userData.available?.length || 0} Days Available</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <button
//                 onClick={handleContact}
//                 className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2"
//               >
//                 <MessageCircle className="w-5 h-5" />
//                 <span>Contact</span>
//               </button>
//             </div>
//           </div>

//           {/* Profile Info */}
//           <div className="p-6 border-b border-gray-100">
//             <div className="grid md:grid-cols-2 gap-6">
//               <div className="flex items-center space-x-3">
//                 <Calendar className="w-5 h-5 text-blue-600" />
//                 <div>
//                   <p className="font-medium text-gray-800">Member Since</p>
//                   <p className="text-sm text-gray-600">
//                     {userData.createdAt ? formatJoinDate(userData.createdAt) : "Recently joined"}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <Globe className="w-5 h-5 text-green-600" />
//                 <div>
//                   <p className="font-medium text-gray-800">Availability</p>
//                   <p className="text-sm text-gray-600">Available for skill exchange</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-8">
//           {/* Skills Section */}
//           <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
//             <div className="p-6 border-b border-gray-100">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-2xl font-bold text-gray-800 flex items-center">
//                   <Star className="w-6 h-6 mr-3 text-yellow-500" />
//                   Skills Offered
//                 </h3>
//                 <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
//                   {userData.skills?.length || 0} skills
//                 </span>
//               </div>
//             </div>

//             <div className="p-6">
//               <div className="flex flex-wrap gap-3">
//                 {userData.skills && userData.skills.length > 0 ? (
//                   userData.skills.map((skill, index) => (
//                     <div
//                       key={index}
//                       className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 px-4 py-2 rounded-xl"
//                     >
//                       <span className="text-gray-800 font-medium">{skill}</span>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="text-center py-8 text-gray-500 w-full">
//                     <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
//                     <p>No skills listed yet</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Availability Section */}
//           <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
//             <div className="p-6 border-b border-gray-100">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-2xl font-bold text-gray-800 flex items-center">
//                   <Calendar className="w-6 h-6 mr-3 text-green-500" />
//                   Availability
//                 </h3>
//                 <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
//                   {userData.available?.length || 0} days
//                 </span>
//               </div>
//             </div>

//             <div className="p-6">
//               <div className="space-y-3">
//                 {daysOfWeek.map((day) => {
//                   const isAvailable = userData.available?.includes(day) || false

//                   return (
//                     <div
//                       key={day}
//                       className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
//                         isAvailable ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
//                       }`}
//                     >
//                       <div className="flex items-center space-x-3">
//                         <div className={`w-4 h-4 rounded-full ${isAvailable ? "bg-green-500" : "bg-gray-300"}`} />
//                         <span className={`font-medium ${isAvailable ? "text-green-800" : "text-gray-600"}`}>{day}</span>
//                       </div>
//                       {isAvailable && <CheckCircle className="w-5 h-5 text-green-600" />}
//                     </div>
//                   )
//                 })}
//               </div>

//               {(!userData.available || userData.available.length === 0) && (
//                 <div className="text-center py-8 text-gray-500">
//                   <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
//                   <p>No availability set</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Profile Stats */}
//         <div className="grid md:grid-cols-3 gap-6">
//           <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
//             <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
//               <Star className="w-6 h-6 text-blue-600" />
//             </div>
//             <h4 className="font-semibold text-gray-800 mb-2">Skills Offered</h4>
//             <p className="text-2xl font-bold text-blue-600">{userData.skills?.length || 0}</p>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
//             <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
//               <Calendar className="w-6 h-6 text-green-600" />
//             </div>
//             <h4 className="font-semibold text-gray-800 mb-2">Days Available</h4>
//             <p className="text-2xl font-bold text-green-600">{userData.available?.length || 0}</p>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
//             <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
//               <Shield className="w-6 h-6 text-purple-600" />
//             </div>
//             <h4 className="font-semibold text-gray-800 mb-2">Profile Status</h4>
//             <p className="text-2xl font-bold text-purple-600">Public</p>
//           </div>
//         </div>

//         {/* Safety Notice */}
//         <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
//           <div className="flex items-center space-x-3 mb-4">
//             <Shield className="w-6 h-6 text-green-600" />
//             <h3 className="text-lg font-bold text-gray-800">Safety Tips</h3>
//           </div>
//           <ul className="space-y-2 text-sm text-gray-600">
//             <li className="flex items-start space-x-2">
//               <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
//               <span>Always meet in public places for in-person exchanges</span>
//             </li>
//             <li className="flex items-start space-x-2">
//               <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
//               <span>Verify skills through portfolio or references before committing</span>
//             </li>
//             <li className="flex items-start space-x-2">
//               <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
//               <span>Start with shorter sessions to build trust</span>
//             </li>
//             <li className="flex items-start space-x-2">
//               <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
//               <span>Use our platform messaging system for communication</span>
//             </li>
//           </ul>
//         </div>
//       </div>

//       {/* Contact Modal */}
//       {showContactModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
//             <div className="p-6 border-b border-gray-100">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-xl font-bold text-gray-800">Contact {userData.name || "User"}</h3>
//                 <button
//                   onClick={() => setShowContactModal(false)}
//                   className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
//                 >
//                   <ArrowLeft className="w-6 h-6" />
//                 </button>
//               </div>
//             </div>
//             <div className="p-6">
//               <div className="mb-4">
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">Your Message</label>
//                 <textarea
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   placeholder="Hi! I'm interested in connecting for skill exchange..."
//                   className="w-full h-32 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
//                 />
//               </div>
//               <div className="flex space-x-3">
//                 <button
//                   onClick={() => setShowContactModal(false)}
//                   className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-colors duration-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSendMessage}
//                   className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
//                 >
//                   <MessageCircle className="w-4 h-4" />
//                   <span>Send Message</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default UserProfile




import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import {
  User,
  Mail,
  Calendar,
  Star,
  Award,
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  MessageCircle,
  Clock,
  Globe,
  Lock,
  Loader,
} from "lucide-react"

const UserProfile = () => {
  const { id } = useParams()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showContactModal, setShowContactModal] = useState(false)
  const [message, setMessage] = useState("")
    const navigate = useNavigate();

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  // Fetch user profile data by ID
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        setError("")

        const response = await fetch(`http://localhost:5000/api/users/profile/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })

        // Handle different response statuses
        if (response.status === 403) {
          // Profile is private
          setUserData({ private: true })
          return
        }

        if (response.status === 404) {
          // Profile doesn't exist
          setError("User profile not found.")
          return
        }

        if (!response.ok) {
          // Other server errors
          throw new Error(`Server error: ${response.status}`)
        }

        const data = await response.json()

        // Check if the response indicates a private profile
        if (data.private === true || (data.user && data.user.private === true)) {
          setUserData({ private: true })
          return
        }

        setUserData(data.user || data)
      } catch (err) {
        setError("Failed to load profile data. Please try again.")
        console.error("Error fetching profile:", err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchUserProfile()
    }
  }, [id])

  const handleContact = () => {
    setShowContactModal(true)
  }

  const handleSendMessage = () => {
    // Handle message sending logic
    console.log("Sending message:", message)
    setShowContactModal(false)
    setMessage("")
  }

  const formatJoinDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The profile you're looking for doesn't exist."}</p>
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors duration-200 inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </Link>
        </div>
      </div>
    )
  }

  // Check if profile is private
  if (userData.private === true) {
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
            <h1 className="text-4xl font-bold mb-2">User Profile</h1>
            <p className="text-lg opacity-90">View user information and skills</p>
          </div>
        </div>

        {/* Private Profile Message */}
        <div className="max-w-4xl mx-auto px-6 mt-10">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Private Profile</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              This user has set their profile to private. You cannot view their details at this time.
            </p>
            <div className="flex items-center justify-center space-x-2 text-gray-500 mb-8">
              <EyeOff className="w-5 h-5" />
              <span>Profile visibility: Private</span>
            </div>
            <Link
              to="/view-requests"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 inline-flex items-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Posts</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Public profile display
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-8 md:px-16 rounded-b-3xl shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={()=> navigate(-1)}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-xl transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
              <Eye className="w-4 h-4" />
              <span className="text-sm">Public Profile</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">User Profile</h1>
          <p className="text-lg opacity-90">View user information and skills</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-10 space-y-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  {userData.name ? (
                    <span className="text-3xl font-bold">{userData.name.charAt(0).toUpperCase()}</span>
                  ) : (
                    <User className="w-12 h-12" />
                  )}
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">{userData.name || "Anonymous User"}</h2>
                  <div className="flex items-center space-x-2 text-blue-100 mb-3">
                    <Mail className="w-4 h-4" />
                    <span>{userData.email || "Email not provided"}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Award className="w-4 h-4" />
                      <span className="text-sm">{userData.skills?.length || 0} Skills</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{userData.available?.length || 0} Days Available</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={handleContact}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Contact</span>
              </button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="p-6 border-b border-gray-100">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-800">Member Since</p>
                  <p className="text-sm text-gray-600">
                    {userData.createdAt ? formatJoinDate(userData.createdAt) : "Recently joined"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-800">Availability</p>
                  <p className="text-sm text-gray-600">Available for skill exchange</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Skills Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Star className="w-6 h-6 mr-3 text-yellow-500" />
                  Skills Offered
                </h3>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {userData.skills?.length || 0} skills
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap gap-3">
                {userData.skills && userData.skills.length > 0 ? (
                  userData.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 px-4 py-2 rounded-xl"
                    >
                      <span className="text-gray-800 font-medium">{skill}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 w-full">
                    <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No skills listed yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Availability Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Calendar className="w-6 h-6 mr-3 text-green-500" />
                  Availability
                </h3>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  {userData.available?.length || 0} days
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {daysOfWeek.map((day) => {
                  const isAvailable = userData.available?.includes(day) || false

                  return (
                    <div
                      key={day}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                        isAvailable ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${isAvailable ? "bg-green-500" : "bg-gray-300"}`} />
                        <span className={`font-medium ${isAvailable ? "text-green-800" : "text-gray-600"}`}>{day}</span>
                      </div>
                      {isAvailable && <CheckCircle className="w-5 h-5 text-green-600" />}
                    </div>
                  )
                })}
              </div>

              {(!userData.available || userData.available.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No availability set</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Skills Offered</h4>
            <p className="text-2xl font-bold text-blue-600">{userData.skills?.length || 0}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Days Available</h4>
            <p className="text-2xl font-bold text-green-600">{userData.available?.length || 0}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Profile Status</h4>
            <p className="text-2xl font-bold text-purple-600">Public</p>
          </div>
        </div>

        {/* Safety Notice */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-bold text-gray-800">Safety Tips</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Always meet in public places for in-person exchanges</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Verify skills through portfolio or references before committing</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Start with shorter sessions to build trust</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Use our platform messaging system for communication</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Contact {userData.name || "User"}</h3>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hi! I'm interested in connecting for skill exchange..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserProfile

