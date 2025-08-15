import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, MessageCircle, Video, Calendar, Clock, User, CheckCircle, AlertCircle, Loader, LogIn, RefreshCw, Award, TrendingUp, History } from 'lucide-react'

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ActiveRequests = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeBarters, setActiveBarters] = useState([])
  const [pastBarters, setPastBarters] = useState([]) // This will be populated from a new API endpoint
  const [activeTab, setActiveTab] = useState("active")
  const [currentUserId, setCurrentUserId] = useState(null); // To store the logged-in user's ID
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndFetchBarters()
  }, [])

  const checkAuthAndFetchBarters = async () => {
    try {
      setLoading(true)
      setError("")

      // First, check authentication by fetching user profile data
      const authResponse = await fetch(`${BASE_URL}users/userprofile`, { // Using userprofile as it returns user data
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (authResponse.status === 401) {
        setIsAuthenticated(false)
        setLoading(false); // Stop loading if not authenticated
        return
      }

      if (!authResponse.ok) {
        throw new Error("Failed to verify authentication")
      }

      const authData = await authResponse.json();
      setCurrentUserId(authData.user._id || authData.user.id); // Store the user ID
      setIsAuthenticated(true)

      // If authenticated, proceed to fetch active barters
      const activeResponse = await fetch(`${BASE_URL}barter/active`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (activeResponse.ok) {
        const activeData = await activeResponse.json()
        console.log("activeData: ",activeData);
        
        setActiveBarters(activeData || [])
      } else {
        throw new Error("Failed to fetch active barters")
      }

      // Fetch past barters (assuming a /barter/past endpoint exists)
      // You will need to implement this endpoint on your backend.
      const pastResponse = await fetch(`${BASE_URL}barter/past`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (pastResponse.ok) {
        const pastData = await pastResponse.json();
        setPastBarters(pastData || []);
      } else {
        console.warn("Failed to fetch past barters, assuming no past barters or endpoint not implemented.");
        setPastBarters([]); // Set to empty array if endpoint fails
      }

    } catch (err) {
      setError("Failed to load barter data. Please try again.")
      console.error("Error fetching barters:", err)
      setIsAuthenticated(false); // Ensure isAuthenticated is false on any fetch error
    } finally {
      setLoading(false)
    }
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

  const formatTimeAgo = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
    }
  }

  const getRemainingTime = (acceptedAt) => {
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000
    const acceptedTime = new Date(acceptedAt).getTime()
    const expiryTime = acceptedTime + threeDaysInMs
    const now = new Date().getTime()
    const remaining = expiryTime - now
    if (remaining <= 0) return "Expired"
    const hours = Math.floor(remaining / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    if (days > 0) {
      return `${days}d ${remainingHours}h remaining`
    } else {
      return `${hours}h remaining`
    }
  }

  const handleMessage = (barter) => {
    console.log("Opening message for barter:", barter._id)
  }

  const handleVideoCall = (barter) => {
    console.log("Starting video call for barter:", barter._id)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your barters...</p>
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
            <h1 className="text-4xl font-bold mb-2">Active Barters</h1>
            <p className="text-lg opacity-90">Manage your ongoing skill exchanges</p>
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
              You need to be logged in to view your active barters. Please sign in to continue.
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
              onClick={checkAuthAndFetchBarters}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-xl transition-colors duration-200"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh</span>
            </button>
          </div>
          <h1 className="text-4xl font-bold mb-2">My Barters</h1>
          <p className="text-lg opacity-90">
            Barters remain active for 3 days from acceptance. Manage your ongoing and past exchanges.
          </p>
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
              onClick={() => setActiveTab("active")}
              className={`flex-1 px-8 py-6 font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                activeTab === "active"
                  ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              <CheckCircle className="w-6 h-6" />
              <span>Active Barters ({activeBarters.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`flex-1 px-8 py-6 font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                activeTab === "past"
                  ? "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <History className="w-6 h-6" />
              <span>Past Barters ({pastBarters.length})</span>
            </button>
          </div>
        </div>

        {/* Active Barters */}
        {activeTab === "active" && (
          <div className="space-y-6">
            {activeBarters.length > 0 ? (
              activeBarters.map((barter) => {
                const isCurrentUserSender = barter.sender?._id === currentUserId || barter.sender?.id === currentUserId;
                const otherUser = isCurrentUserSender ? barter.receiver : barter.sender;
                const userSkillPost = isCurrentUserSender ? barter.senderSkillPost : barter.receiverSkillPost;
                const otherSkillPost = isCurrentUserSender ? barter.receiverSkillPost : barter.senderSkillPost;

                return (
                  <div
                    key={barter._id}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-800">Active Barter Exchange</h3>
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                              Active
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                            <Clock className="w-4 h-4" />
                            <span>{getRemainingTime(barter.createdAt)}</span> {/* Use createdAt for remaining time */}
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            You Want
                          </h4>
                          <p className="text-blue-700 font-medium">{userSkillPost?.requiredSkills || "N/A"}</p>
                          <p className="text-blue-600 text-sm mt-1">
                            {userSkillPost?.skillDescription || "No description"}
                          </p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                          <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                            <Award className="w-4 h-4 mr-2" />
                            You Offer
                          </h4>
                          <p className="text-green-700 font-medium">{userSkillPost?.providedSkills || "N/A"}</p>
                          <p className="text-green-600 text-sm mt-1">
                            {userSkillPost?.skillDescription || "No description"}
                          </p>
                        </div>
                      </div>

                      {/* Partner's Details */}
                      <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 mb-6">
                        <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Partner: {otherUser?.name || "Unknown User"}
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-purple-700 mb-1">They Want</h5>
                            <p className="text-purple-600 text-sm">{otherSkillPost?.requiredSkills || "N/A"}</p>
                          </div>
                          <div>
                            <h5 className="font-medium text-purple-700 mb-1">They Offer</h5>
                            <p className="text-purple-600 text-sm">{otherSkillPost?.providedSkills || "N/A"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>Accepted: {formatTimeAgo(barter.createdAt)}</span>
                          </div>
                          {userSkillPost?.barterDateTime && (
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4" />
                              <span>Scheduled: {formatDate(userSkillPost.barterDateTime)}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-3">
                          <Link
                            to="/chat" // Assuming your chat route is /chat
                            state={{
                              barterId: barter._id.toString(), // Convert ObjectId to string here
                              senderId: barter.sender?._id, // Or barter.sender?.id
                              receiverId: barter.receiver?._id, // Or barter.receiver?.id
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-colors duration-200 flex items-center space-x-2"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Message Partner</span>
                          </Link>
                          <button
                            onClick={() => navigate(`/call/${barter._id.toString()}`)}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl transition-colors duration-200 flex items-center space-x-2"
                          >
                            <Video className="w-4 h-4" />
                            <span>Video Call</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Active Barters</h3>
                <p className="text-gray-600 mb-6">You don't have any active barter exchanges at the moment.</p>
                <Link
                  to="/requests"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors duration-200 inline-flex items-center space-x-2"
                >
                  <TrendingUp className="w-5 h-5" />
                  <span>Browse Requests</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Past Barters */}
        {activeTab === "past" && (
          <div className="space-y-6">
            {pastBarters.length > 0 ? (
              pastBarters.map((barter) => {
                const isCurrentUserSender = barter.sender?._id === currentUserId || barter.sender?.id === currentUserId;
                const otherUser = isCurrentUserSender ? barter.receiver : barter.sender;
                const userSkillPost = isCurrentUserSender ? barter.senderSkillPost : barter.receiverSkillPost;
                const otherSkillPost = isCurrentUserSender ? barter.receiverSkillPost : barter.senderSkillPost;

                return (
                  <div
                    key={barter._id}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 opacity-75 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-800">Past Barter Exchange</h3>
                            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                              Completed
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                            <History className="w-4 h-4" />
                            <span>Completed: {formatDate(barter.completedAt || barter.createdAt)}</span> {/* Assuming a completedAt field or fallback to createdAt */}
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            You Wanted
                          </h4>
                          <p className="text-blue-700 font-medium">{userSkillPost?.requiredSkills || "N/A"}</p>
                          <p className="text-blue-600 text-sm mt-1">
                            {userSkillPost?.skillDescription || "No description"}
                          </p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                          <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                            <Award className="w-4 h-4 mr-2" />
                            You Offered
                          </h4>
                          <p className="text-green-700 font-medium">{userSkillPost?.providedSkills || "N/A"}</p>
                          <p className="text-green-600 text-sm mt-1">
                            {userSkillPost?.skillDescription || "No description"}
                          </p>
                        </div>
                      </div>

                      {/* Partner's Details for Past Barters */}
                      <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 mb-6">
                        <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Partner: {otherUser?.name || "Unknown User"}
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-purple-700 mb-1">They Wanted</h5>
                            <p className="text-purple-600 text-sm">{otherSkillPost?.requiredSkills || "N/A"}</p>
                          </div>
                          <div>
                            <h5 className="font-medium text-purple-700 mb-1">They Offered</h5>
                            <p className="text-purple-600 text-sm">{otherSkillPost?.providedSkills || "N/A"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>Accepted: {formatTimeAgo(barter.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <Link
                            to="/chat" // Assuming your chat route is /chat
                            state={{
                              barterId: barter._id.toString(), // Convert ObjectId to string here
                              senderId: barter.sender?._id, // Or barter.sender?.id
                              receiverId: barter.receiver?._id, // Or barter.receiver?.id
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-colors duration-200 flex items-center space-x-2"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Message Partner</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <History className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Past Barters</h3>
                <p className="text-gray-600">Your completed barter exchanges will appear here.</p>
              </div>
            )}
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Active Barters</h4>
            <p className="text-2xl font-bold text-green-600">{activeBarters.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <History className="w-6 h-6 text-gray-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Past Barters</h4>
            <p className="text-2xl font-bold text-gray-600">{pastBarters.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Total Exchanges</h4>
            <p className="text-2xl font-bold text-blue-600">{activeBarters.length + pastBarters.length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActiveRequests;
