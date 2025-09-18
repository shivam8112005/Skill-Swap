import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  LogIn,
  Loader,
  AlertCircle,
  X,
  Plus,
  FileText,
  Target,
  Gift,
} from "lucide-react"

// You'll need to replace this with your actual API base URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/"

const MyPosts = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState("pending")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedPost, setSelectedPost] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [postToDelete, setPostToDelete] = useState(null)

  useEffect(() => {
    checkAuthAndFetchPosts()
  }, [])

  const checkAuthAndFetchPosts = async () => {
    try {
      console.log("inside checkAuthAndFetchPosts")

      setLoading(true)
      setError("")

      const response = await fetch(`${BASE_URL}skill/my-skillposts`, {
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
        throw new Error("Failed to fetch posts")
      }

      const data = await response.json()
      setPosts(data.posts || [])
      setIsAuthenticated(true)
    } catch (err) {
      setError("Failed to load posts. Please try again.")
      console.error("Error fetching posts:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`${BASE_URL}skill/deletepost/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (response.ok) {
        // Refresh the posts
        checkAuthAndFetchPosts()
        // Close modals
        setShowDeleteModal(false)
        setPostToDelete(null)
        if (showDetailsModal) {
          setShowDetailsModal(false)
          setSelectedPost(null)
        }
      } else {
        setError("Failed to delete post. Please try again.")
      }
    } catch (err) {
      console.error("Error deleting post:", err)
      setError("Failed to delete post. Please try again.")
    }
  }

  const openDetailsModal = (post) => {
    setSelectedPost(post)
    setShowDetailsModal(true)
  }

  const closeDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedPost(null)
  }

  const openDeleteModal = (post) => {
    setPostToDelete(post)
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setPostToDelete(null)
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

  const filteredPosts = (postList) => {
    return postList.filter((post) => {
      const matchesSearch =
        post.requiredSkills?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.providedSkills?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.skillDescription?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFilter = filterStatus === "all" || post.status === filterStatus

      return matchesSearch && matchesFilter
    })
  }

  const pendingPosts = posts.filter((post) => post.status === "pending")
  const acceptedPosts = posts.filter((post) => post.status === "accepted")

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your posts...</p>
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
            <h1 className="text-4xl font-bold mb-2">My Posts</h1>
            <p className="text-lg opacity-90">Manage your skill posts</p>
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
              You need to be logged in to view your skill posts. Please sign in to continue.
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
            <div className="flex space-x-3">
              <button
                onClick={checkAuthAndFetchPosts}
                className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-xl transition-colors duration-200"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Refresh</span>
              </button>
              <Link
                to="/send-request"
                className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-xl transition-colors duration-200"
              >
                <Plus className="w-5 h-5" />
                <span>New Post</span>
              </Link>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">My Posts</h1>
          <p className="text-lg opacity-90">Manage your skill posts and track their status</p>
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
              onClick={() => setActiveTab("pending")}
              className={`flex-1 px-8 py-6 font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                activeTab === "pending"
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg"
                  : "text-gray-600 hover:bg-yellow-50 hover:text-yellow-700"
              }`}
            >
              <Clock className="w-6 h-6" />
              <span>Pending ({pendingPosts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("accepted")}
              className={`flex-1 px-8 py-6 font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                activeTab === "accepted"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              <CheckCircle className="w-6 h-6" />
              <span>Accepted ({acceptedPosts.length})</span>
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
                placeholder="Search by skills or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            {/* <div className="relative">
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
            </div> */}
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {activeTab === "pending" ? (
            filteredPosts(pendingPosts).length > 0 ? (
              filteredPosts(pendingPosts).map((post) => (
                <div
                  key={post._id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">Pending Post</h3>
                          <p className="text-gray-600">Awaiting approval</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(post.status)}`}
                        >
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-5 border border-yellow-200 mb-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold text-yellow-700 mb-2 flex items-center">
                            <Target className="w-4 h-4 mr-2" />
                            SKILLS WANTED:
                          </p>
                          <p className="text-yellow-800 font-medium bg-yellow-100 p-3 rounded-lg">
                            {post.requiredSkills || "Not specified"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-yellow-700 mb-2 flex items-center">
                            <Gift className="w-4 h-4 mr-2" />
                            SKILLS OFFERED:
                          </p>
                          <p className="text-yellow-700 bg-yellow-100 p-3 rounded-lg">
                            {post.providedSkills || "Not specified"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-yellow-700 mb-2 flex items-center">
                            <FileText className="w-4 h-4 mr-2" />
                            DESCRIPTION:
                          </p>
                          <p className="text-yellow-600 bg-yellow-100 p-3 rounded-lg text-sm line-clamp-3">
                            {post.skillDescription || "No description provided"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Created: {formatDate(post.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={() => openDetailsModal(post)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl transition-colors duration-200 flex items-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                        <Link
                          to={`/edit-post/${post._id}`}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-xl transition-colors duration-200 flex items-center space-x-2"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </Link>
                        <button
                          onClick={() => openDeleteModal(post)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-xl transition-colors duration-200 flex items-center space-x-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Pending Posts</h3>
                <p className="text-gray-600 mb-6">You don't have any pending skill posts.</p>
                <Link
                  to="/create-post"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 inline-flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Your First Post</span>
                </Link>
              </div>
            )
          ) : filteredPosts(acceptedPosts).length > 0 ? (
            filteredPosts(acceptedPosts).map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Accepted Post</h3>
                        <p className="text-gray-600">Available for barter</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(post.status)}`}
                      >
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200 mb-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-green-700 mb-2 flex items-center">
                          <Target className="w-4 h-4 mr-2" />
                          SKILLS WANTED:
                        </p>
                        <p className="text-green-800 font-medium bg-green-100 p-3 rounded-lg">
                          {post.requiredSkills || "Not specified"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-green-700 mb-2 flex items-center">
                          <Gift className="w-4 h-4 mr-2" />
                          SKILLS OFFERED:
                        </p>
                        <p className="text-green-700 bg-green-100 p-3 rounded-lg">
                          {post.providedSkills || "Not specified"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-green-700 mb-2 flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          DESCRIPTION:
                        </p>
                        <p className="text-green-600 bg-green-100 p-3 rounded-lg text-sm line-clamp-3">
                          {post.skillDescription || "No description provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Created: {formatDate(post.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => openDetailsModal(post)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl transition-colors duration-200 flex items-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                      {/* <Link
                        to={`/edit-post/${post._id}`}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-xl transition-colors duration-200 flex items-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </Link> */}
                      <button
                        onClick={() => openDeleteModal(post)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-xl transition-colors duration-200 flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Accepted Posts</h3>
              <p className="text-gray-600">You don't have any accepted skill posts yet.</p>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Pending</h4>
            <p className="text-2xl font-bold text-yellow-600">{pendingPosts.length}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Accepted</h4>
            <p className="text-2xl font-bold text-green-600">{acceptedPosts.length}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Total Posts</h4>
            <p className="text-2xl font-bold text-blue-600">{posts.length}</p>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Post Details</h2>
                  <p className="text-blue-100">
                    {selectedPost.status.charAt(0).toUpperCase() + selectedPost.status.slice(1)} Post •{" "}
                    {formatDate(selectedPost.createdAt)}
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
              {/* Status and Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Post Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedPost.status)}`}
                      >
                        {selectedPost.status.charAt(0).toUpperCase() + selectedPost.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">{formatDate(selectedPost.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Barter Details
                  </h3>
                  <div className="space-y-2">
                    {selectedPost.barterDateTime && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Preferred Time:</span>
                        <span className="font-medium">{formatDate(selectedPost.barterDateTime)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Post ID:</span>
                      <span className="font-medium text-xs">{selectedPost._id}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Post Content */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2">
                  Skill Exchange Details
                </h3>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2 flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        SKILLS WANTED:
                      </p>
                      <p className="text-blue-800 font-medium bg-blue-100 p-3 rounded-lg">
                        {selectedPost.requiredSkills || "Not specified"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2 flex items-center">
                        <Gift className="w-4 h-4 mr-2" />
                        SKILLS OFFERED:
                      </p>
                      <p className="text-blue-700 bg-blue-100 p-3 rounded-lg">
                        {selectedPost.providedSkills || "Not specified"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-blue-700 mb-2 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        DESCRIPTION:
                      </p>
                      <p className="text-blue-600 bg-blue-100 p-3 rounded-lg text-sm leading-relaxed">
                        {selectedPost.skillDescription || "No description provided"}
                      </p>
                    </div>

                    {selectedPost.barterDateTime && (
                      <div>
                        <p className="text-sm font-semibold text-blue-700 mb-2 flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          PREFERRED DATE & TIME:
                        </p>
                        <p className="text-blue-600 bg-blue-100 p-3 rounded-lg text-sm flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(selectedPost.barterDateTime)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Link
                  to={`/edit-post/${selectedPost._id}`}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-6 py-3 rounded-xl transition-colors duration-200 flex items-center space-x-2 font-medium"
                >
                  <Edit className="w-5 h-5" />
                  <span>Edit Post</span>
                </Link>
                <button
                  onClick={() => {
                    closeDetailsModal()
                    openDeleteModal(selectedPost)
                  }}
                  className="bg-red-100 hover:bg-red-200 text-red-700 px-6 py-3 rounded-xl transition-colors duration-200 flex items-center space-x-2 font-medium"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Delete Post</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && postToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Delete Post</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete this skill post? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeletePost(postToDelete._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl transition-colors duration-200 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyPosts
