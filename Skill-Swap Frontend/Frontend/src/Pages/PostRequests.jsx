import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Send,
  Activity,
  FileText,
  Users,
  Star,
  Calendar,
  AlertCircle,
  LogIn,
  ArrowLeft,
  Loader,
  CheckCircle,
  RefreshCw,
} from "lucide-react"
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PostRequests = () => {
  const [formData, setFormData] = useState({
    type: "request",
    skillDescription: "",
    requiredSkills: "",
    providedSkills: "",
    barterDateTime: "",
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuthentication()
  }, []);

    function getCookie(name){
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

  const checkAuthentication = async () => {
    try {
      setLoading(true)
      setError("")

      // Try to make an authenticated request to check if user is logged in
      const response = await fetch(`${BASE_URL}users/userprofiledata`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!getCookie('token')) {
        setIsAuthenticated(false)
        return
      }

      if (getCookie('token')) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    } catch (err) {
      console.error("Error checking authentication:", err)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch(`${BASE_URL}skill/postskill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create skill post")
      }

      const result = await response.json()
      console.log("Success:", result)
      setSuccess(true)

      // Reset form
      setFormData({
        type: "request",
        skillDescription: "",
        requiredSkills: "",
        providedSkills: "",
        barterDateTime: "",
      })

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000)
    } catch (error) {
      console.error("Error:", error)
      setError(error.message || "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Checking authentication...</p>
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
            <h1 className="text-4xl font-bold mb-2">Create Skill Post</h1>
            <p className="text-lg opacity-90">Share your skills with the community</p>
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
              You need to be logged in to create skill posts. Please sign in to continue and start sharing your skills
              with the community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login-signup"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 inline-flex items-center justify-center space-x-3 text-lg shadow-lg hover:shadow-xl"
              >
                <LogIn className="w-6 h-6" />
                <span>Sign In / Sign Up</span>
              </Link>
              
            </div>
          </div>
        </div>
      </div>
    )
  }

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
              <span>Back to Dashboard</span>
            </Link>
            <button
              onClick={checkAuthentication}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-xl transition-colors duration-200"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh</span>
            </button>
          </div>
          <h1 className="text-4xl font-bold mb-2">Create Skill Barter Post</h1>
          <p className="text-lg opacity-90">Share your skills and connect with others in the community</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-10 space-y-8">
      

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Post Details</h2>
            <p className="text-gray-600">Fill in the information about your skill exchange</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Type Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4">Post Type</label>
              <div className="grid grid-cols-2 gap-4">
                <label
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    formData.type === "request"
                      ? "border-blue-500 bg-blue-50 text-blue-800"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value="request"
                    checked={formData.type === "request"}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <Users className="w-6 h-6 mr-3" />
                  <div>
                    <div className="font-semibold">Request Help</div>
                    <div className="text-sm opacity-75">I need help with a skill</div>
                  </div>
                </label>
                <label
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    formData.type === "offer"
                      ? "border-green-500 bg-green-50 text-green-800"
                      : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value="offer"
                    checked={formData.type === "offer"}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <Star className="w-6 h-6 mr-3" />
                  <div>
                    <div className="font-semibold">Offer Help</div>
                    <div className="text-sm opacity-75">I can help others with a skill</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Required Skills */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                <Users className="inline w-5 h-5 mr-2" />
                What skill do you need help with? *
              </label>
              <input
                type="text"
                name="requiredSkills"
                value={formData.requiredSkills}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-lg"
                placeholder="e.g., Web Development, Photography, Language Learning"
                required
              />
            </div>

            {/* Provided Skills */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                <Star className="inline w-5 h-5 mr-2" />
                What can you offer in return? *
              </label>
              <input
                type="text"
                name="providedSkills"
                value={formData.providedSkills}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-lg"
                placeholder="e.g., Graphic Design, Writing, Music Lessons"
                required
              />
            </div>

            {/* Skill Description */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                <FileText className="inline w-5 h-5 mr-2" />
                Detailed Description *
              </label>
              <textarea
                name="skillDescription"
                value={formData.skillDescription}
                onChange={handleInputChange}
                rows="6"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none text-lg leading-relaxed"
                placeholder="Describe your request in detail. Include your experience level, what you hope to learn or teach, and any specific requirements..."
                required
              />
              <div className="mt-2 text-sm text-gray-500">
                Characters: {formData.skillDescription.length} (minimum 50 recommended)
              </div>
            </div>

            {/* Barter Date Time */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                <Calendar className="inline w-5 h-5 mr-2" />
                Preferred Barter Date & Time *
              </label>
              <input
                type="datetime-local"
                name="barterDateTime"
                value={formData.barterDateTime}
                onChange={handleInputChange}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-lg"
                required
              />
              <div className="mt-2 text-sm text-gray-500">
                Choose a date and time that works best for your skill exchange session
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">


                  {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-green-800 font-semibold">Skill post created successfully!</p>
              <p className="text-green-700 text-sm mt-1">
                Your post is now live and visible to other community members.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
            <button onClick={() => setError("")} className="ml-auto text-red-600 hover:text-red-800">
              <ArrowLeft className="w-5 h-5 rotate-45" />
            </button>
          </div>
        )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
              >
                {submitting ? (
                  <>
                    <Activity className="w-6 h-6 animate-spin" />
                    <span>Creating Post...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6" />
                    <span>Create {formData.type === "request" ? "Request" : "Offer"} Post</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Star className="w-6 h-6 mr-3 text-yellow-500" />
            Tips for a Great Post
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Be Specific</h4>
              <p className="text-gray-600 text-sm">
                Clearly describe what you need help with and what you can offer. The more specific you are, the better
                matches you'll get.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Set Realistic Expectations</h4>
              <p className="text-gray-600 text-sm">
                Be honest about your skill level and what you can realistically offer in exchange.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Choose Convenient Times</h4>
              <p className="text-gray-600 text-sm">
                Select dates and times that work well for you, and be flexible when connecting with others.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Be Professional</h4>
              <p className="text-gray-600 text-sm">
                Maintain a professional and friendly tone in your description to attract quality connections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostRequests
