import { useEffect, useState } from "react"
import {
  Eye,
  Activity,
  X,
  Users,
  Star,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  Repeat,
  Plus,
  List,
  CheckCircle,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const ViewRequests = () => {
  const [loading, setLoading] = useState(true)
  const [barter, setBarter] = useState([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const itemsPerPage = 6
  const [sendingRequest, setSendingRequest] = useState({})
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [requestMode, setRequestMode] = useState("existing") // "existing" or "new"
  const [userSkillPosts, setUserSkillPosts] = useState([])
  const [selectedExistingPost, setSelectedExistingPost] = useState("")
  const [loadingUserPosts, setLoadingUserPosts] = useState(false)
  const navigate = useNavigate()
  const [requestForm, setRequestForm] = useState({
    type: "offer",
    skillDescription: "",
    requiredSkills: "",
    providedSkills: "",
    barterDateTime: "",
  })

  useEffect(() => {
    fetchBarter()
  }, [])

  const fetchBarter = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await fetch("http://localhost:5000/api/barter/getBarter", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch barter data")
      }

      const data = await response.json()
      if (data.status === 200) {
        setBarter(data.barter || [])
      } else {
        throw new Error(data.message || "Failed to load barter data")
      }
    } catch (err) {
      setError("Failed to load barter data. Please try again.")
      console.error("Error fetching barter:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserSkillPosts = async () => {
    try {
      setLoadingUserPosts(true)
      const response = await fetch("http://localhost:5000/api/skill/my-skillposts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        console.log("fetching my skill posts 1");
      if (response.ok) {
        console.log("fetching my skill posts");
        
        const data = await response.json()
        console.log(data);
        
        setUserSkillPosts(data || [])
      } else {
        console.error("Failed to fetch user skill posts")
        setUserSkillPosts([])
      }
    } catch (err) {
      console.error("Error fetching user skill posts:", err)
      setUserSkillPosts([])
    } finally {
      setLoadingUserPosts(false)
    }
  }

  // Filter and search functionality
  const filteredBarter = barter.filter((item) => {
    const matchesSearch =
      item.requiredSkills.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.providedSkills.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.skillDescription.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterType === "all" || item.type === filterType

    return matchesSearch && matchesFilter
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredBarter.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredBarter.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterType])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "request":
        return "bg-blue-100 text-blue-800"
      case "offer":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSendRequest = async (receiverPost) => {
    setSelectedPost(receiverPost)
    setShowRequestModal(true)
    setRequestMode("existing")
    setSelectedExistingPost("")
    console.log("handleSendRequest");
    
     await fetchUserSkillPosts()
    // Reset form
    setRequestForm({
      type: "offer",
      skillDescription: "",
      requiredSkills: "",
      providedSkills: "",
      barterDateTime: "",
    })

    // Fetch user's existing skill posts
   
  }
   const viewDetails= async(id)=>{
      navigate(`/skillpost/${id}`);
   }

  const submitBarterRequest = async () => {
    if (!selectedPost){console.log(
      "post not selected"
    );
    return
    } 
    console.log("post selected");
    

    try {
      setSendingRequest((prev) => ({ ...prev, [selectedPost._id]: true }))

      const requestData = {
        
        receiverId: selectedPost.userId,
        receiverSkillPostId: selectedPost._id,
      }
      console.log(requestMode);
      
      if (requestMode === "existing") {
        if (!selectedExistingPost) {
          setError("Please select an existing skill post")
          return
        }
        requestData.senderSkillPostId = selectedExistingPost
      } else {
        // Create new skill post
        if (
          !requestForm.skillDescription ||
          !requestForm.requiredSkills ||
          !requestForm.providedSkills ||
          !requestForm.barterDateTime
        ) {
          setError("Please fill in all required fields")
          return
        }

        requestData.newSkillPost = {
          type: requestForm.type,
          skillDescription: requestForm.skillDescription,
          requiredSkills: requestForm.requiredSkills,
          providedSkills: requestForm.providedSkills,
          barterDateTime: requestForm.barterDateTime,
        }

         const response = await fetch("http://localhost:5000/api/skill/postskill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(requestData.newSkillPost),
      });

      if (!response.ok) {
        throw new Error("Failed to create skill post");
      }

      const result = await response.json();
      requestData.senderSkillPostId = result.skill._id
      }

      const response = await fetch("http://localhost:5000/api/barter/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Barter request sent successfully!")
        setShowRequestModal(false)
        setSelectedExistingPost("")
        setRequestForm({
          type: "offer",
          skillDescription: "",
          requiredSkills: "",
          providedSkills: "",
          barterDateTime: "",
        })
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(data.message || "Failed to send request")
      }
    } catch (err) {
      setError("Failed to send request. Please try again.")
      console.error("Error sending request:", err)
    } finally {
      setSendingRequest((prev) => ({ ...prev, [selectedPost._id]: false }))
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setRequestForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleModeChange = (mode) => {
    setRequestMode(mode)
    setError("") // Clear any existing errors
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading barter requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Open Barter Requests</h1>
          <p className="text-gray-600">Discover skill exchange opportunities in our community</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
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

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                <option value="all">All Types</option>
                <option value="request">Requests</option>
                <option value="offer">Offers</option>
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchBarter}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors duration-200 flex items-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {currentItems.length} of {filteredBarter.length} results
            {searchTerm && ` for "${searchTerm}"`}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
            <button onClick={() => setError("")} className="ml-auto text-red-600 hover:text-red-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
            <Star className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-700">{success}</p>
            <button onClick={() => setSuccess("")} className="ml-auto text-green-600 hover:text-green-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Barter Cards */}
        {currentItems.length > 0 ? (
          <div className="grid gap-6">
            {currentItems.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">
                          Looking for: <span className="text-blue-600">{item.requiredSkills}</span>
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(item.type)}`}>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">
                        <span className="font-medium">Offering:</span>{" "}
                        <span className="text-green-600 font-semibold">{item.providedSkills}</span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Description:</h4>
                    <p className="text-gray-700 leading-relaxed">{item.skillDescription}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Barter Date: {formatDateTime(item.barterDateTime)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Posted: {formatDate(item.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() =>
                          handleSendRequest(item)
                         }
                        disabled={sendingRequest[item._id]}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl transition-colors duration-200 flex items-center space-x-2"
                      >
                        {sendingRequest[item._id] ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Repeat className="w-4 h-4" />
                        )}
                        <span>{sendingRequest[item._id] ? "Sending..." : "Send Request"}</span>
                      </button>
                       <button onClick={()=> viewDetails(item._id)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-xl transition-colors duration-200 flex items-center space-x-2">
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Barter Requests Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterType !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Be the first to create a barter request!"}
            </p>
            {(searchTerm || filterType !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("")
                  setFilterType("all")
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages} ({filteredBarter.length} total results)
              </div>

              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Page Numbers */}
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                          currentPage === pageNum ? "bg-blue-600 text-white" : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        {barter.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Total Requests</h4>
              <p className="text-2xl font-bold text-blue-600">{barter.length}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Active Today</h4>
              <p className="text-2xl font-bold text-green-600">
                {
                  barter.filter((item) => {
                    const today = new Date().toDateString()
                    const itemDate = new Date(item.createdAt).toDateString()
                    return today === itemDate
                  }).length
                }
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Unique Skills</h4>
              <p className="text-2xl font-bold text-purple-600">
                {
                  new Set([...barter.map((item) => item.requiredSkills), ...barter.map((item) => item.providedSkills)])
                    .size
                }
              </p>
            </div>
          </div>
        )}

        {/* Send Request Modal */}
        {showRequestModal && selectedPost && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-800">Send Barter Request</h3>
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-600 mt-2">
                  Requesting: <span className="font-semibold text-blue-600">{selectedPost.requiredSkills}</span>
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Mode Selection */}
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => handleModeChange("existing")}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      requestMode === "existing"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <List className="w-5 h-5" />
                    <span>Use Existing Post</span>
                  </button>
                  <button
                    onClick={() => handleModeChange("new")}
                    className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      requestMode === "new" ? "bg-white text-purple-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create New Post</span>
                  </button>
                </div>

                {/* Existing Post Selection */}
                {requestMode === "existing" && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                      <List className="w-5 h-5 mr-2" />
                      Select Your Existing Skill Post
                    </h4>

                    {loadingUserPosts ? (
                      <div className="text-center py-8">
                        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-gray-600">Loading your skill posts...</p>
                      </div>
                    ) : userSkillPosts.length > 0 ? (
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {userSkillPosts.map((post) => (
                          <div
                            key={post._id}
                            onClick={() => setSelectedExistingPost(post._id)}
                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                              selectedExistingPost === post._id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(post.type)}`}
                                >
                                  {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                                </span>
                                {selectedExistingPost === post._id && <CheckCircle className="w-5 h-5 text-blue-600" />}
                              </div>
                              <span className="text-xs text-gray-500">{formatDate(post.createdAt)}</span>
                            </div>
                            <h5 className="font-semibold text-gray-800 mb-1">
                              Need: <span className="text-blue-600">{post.requiredSkills}</span>
                            </h5>
                            <p className="text-sm text-gray-600 mb-2">
                              Offer: <span className="text-green-600 font-medium">{post.providedSkills}</span>
                            </p>
                            <p className="text-sm text-gray-700 line-clamp-2">{post.skillDescription}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-xl">
                        <List className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 mb-2">No existing skill posts found</p>
                        <p className="text-sm text-gray-500">Create a new skill post to send this request</p>
                        <button
                          onClick={() => handleModeChange("new")}
                          className="mt-3 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Create New Post →
                        </button>
                      </div>
                    )}

                    {userSkillPosts.length > 0 && (
                      <button
                        onClick={submitBarterRequest}
                        disabled={!selectedExistingPost || sendingRequest[selectedPost._id]}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        {sendingRequest[selectedPost._id] ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Repeat className="w-5 h-5" />
                        )}
                        <span>{sendingRequest[selectedPost._id] ? "Sending Request..." : "Send Request"}</span>
                      </button>
                    )}
                  </div>
                )}

                {/* New Post Creation */}
                {requestMode === "new" && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                      <Plus className="w-5 h-5 mr-2" />
                      Create New Skill Post
                    </h4>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                      <select
                        name="type"
                        value={requestForm.type}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        <option value="offer">Offer</option>
                        <option value="request">Request</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        What skill do you need? *
                      </label>
                      <input
                        type="text"
                        name="requiredSkills"
                        value={requestForm.requiredSkills}
                        onChange={handleFormChange}
                        placeholder="e.g., Web Development, Graphic Design"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        What skill can you offer? *
                      </label>
                      <input
                        type="text"
                        name="providedSkills"
                        value={requestForm.providedSkills}
                        onChange={handleFormChange}
                        placeholder="e.g., Photography, Language Teaching"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                      <textarea
                        name="skillDescription"
                        value={requestForm.skillDescription}
                        onChange={handleFormChange}
                        rows={4}
                        placeholder="Describe your skill offering and what you're looking for..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Preferred Barter Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        name="barterDateTime"
                        value={requestForm.barterDateTime}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <button
                      onClick={submitBarterRequest}
                      disabled={sendingRequest[selectedPost._id]}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      {sendingRequest[selectedPost._id] ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                      <span>
                        {sendingRequest[selectedPost._id] ? "Creating & Sending..." : "Create & Send Request"}
                      </span>
                    </button>
                  </div>
                )}

                {/* Cancel Button */}
                <div className="flex justify-center pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewRequests
