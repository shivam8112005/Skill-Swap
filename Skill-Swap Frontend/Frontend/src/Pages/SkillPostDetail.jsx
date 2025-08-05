// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// function SkillPostDetail() {
//   const { id } = useParams(); // get post id from URL
//   const [post, setPost] = useState(null);

//   useEffect(() => {
//     const fetchPost = async () => {
//         console.log(id);
        
//       const res = await axios.get(`http://localhost:5000/api/skill/skillpost/${id}`);
//       setPost(res.data);
//     };
//     fetchPost();
//   }, [id]);

//   if (!post) return <p>Loading...</p>;

//   return (
//    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white pb-20">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-12 px-8 md:px-16 rounded-b-3xl shadow-lg">
//         <h1 className="text-4xl font-extrabold mb-2">Explore Skill Post</h1>
//         <p className="text-lg opacity-90">Deep dive into a skill bartering opportunity</p>
//       </div>

//       {/* Content */}
//       <div className="max-w-6xl mx-auto px-6 mt-10">
//         <div className="grid md:grid-cols-2 gap-10 items-start">
          
//           {/* Left Column */}
//           <div className="space-y-6">
//             <h2 className="text-3xl font-bold text-gray-800">About This Skill Exchange</h2>
            
//             <div className="text-gray-700 space-y-3 text-lg">
//               <p>
//                 <span className="font-semibold text-gray-900">Type:</span> {post.type}
//               </p>
//               <p>
//                 <span className="font-semibold text-gray-900">Description:</span><br />
//                 {post.skillDescription}
//               </p>
//               <p>
//                 <span className="font-semibold text-gray-900">Barter Date:</span> {new Date(post.barterDateTime).toLocaleString()}
//               </p>
//               <p>
//                 <span className="font-semibold text-gray-900">Created By:</span>
//                 <Link
//                   to={`/profile/${post.userId._id}`}
//                   className="inline-block ml-2 px-3 py-1 bg-blue-100 text-blue-700 font-medium rounded-full hover:bg-blue-200 transition"
//                 >
//                   {post.userId.name}
//                 </Link>
//               </p>
//             </div>
//           </div>

//           {/* Right Column */}
//           <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
//             <h3 className="text-xl font-semibold mb-4 text-gray-800">Skill Requirements</h3>

//             <div className="mb-4">
//               <p className="font-semibold text-gray-600">Required Skills</p>
//               <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 mt-1 rounded-full text-sm shadow">
//                 {post.requiredSkills}
//               </span>
//             </div>

//             <div>
//               <p className="font-semibold text-gray-600">Provided Skills</p>
//               <span className="inline-block bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-1 mt-1 rounded-full text-sm shadow">
//                 {post.providedSkills}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Back Button */}
//         <div className="mt-12 text-center">
//           <Link
//             to="/"
//             className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-full shadow hover:shadow-xl text-lg font-semibold transition"
//           >
//             ← Back to All Posts
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SkillPostDetail;



"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Star,
  MessageCircle,
  Share2,
  Bookmark,
  Award,
  CheckCircle,
  AlertCircle,
  Eye,
  Send,
  Globe,
  Shield,
  TrendingUp,
  User,
  Loader,
} from "lucide-react"
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SkillPostDetail() {
  const { id } = useParams() // get post id from URL
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        console.log(id)
        const res = await axios.get(`${BASE_URL}skill/skillpost/${id}`)
        setPost(res.data)
        setError(null)
      } catch (err) {
        console.error("Error fetching post:", err)
        setError("Failed to load skill post. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
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

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Skill Exchange: ${post?.requiredSkills}`,
        text: post?.skillDescription,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTypeColor = (type) => {
    return type === "request" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
  }

  const getTypeIcon = (type) => {
    return type === "request" ? TrendingUp : Award
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading skill post details...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{error ? "Error Loading Post" : "Post Not Found"}</h2>
          <p className="text-gray-600 mb-6">{error || "The skill post you're looking for doesn't exist."}</p>
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

  const TypeIcon = getTypeIcon(post.type)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-12 px-8 md:px-16 rounded-b-3xl shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/view-requests"
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-xl transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Posts</span>
            </Link>
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleBookmark}
                className={`p-3 rounded-xl transition-colors duration-200 ${
                  isBookmarked ? "bg-yellow-500 text-white" : "bg-white/20 backdrop-blur-sm hover:bg-white/30"
                }`}
              >
                <Bookmark className="w-5 h-5" />
              </button>
              <button
                onClick={handleShare}
                className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl transition-colors duration-200"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold mb-2">Explore Skill Post</h1>
          <p className="text-lg opacity-90">Deep dive into a skill bartering opportunity</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 mt-10">
        {/* Status Banner */}
        <div className="mb-8">
          <div
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${getTypeColor(post.type)}`}
          >
            <TypeIcon className="w-4 h-4" />
            <span>{post.type.charAt(0).toUpperCase() + post.type.slice(1)} Post</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Post Details */}
            <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">About This Skill Exchange</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Exchange Type</h3>
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getTypeColor(post.type)}`}
                  >
                    {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{post.skillDescription}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Session Details</h3>
                    <div className="space-y-3 text-gray-700">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Barter Date</p>
                          <p className="text-sm">{formatDate(post.barterDateTime)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Created</p>
                          <p className="text-sm">{formatDate(post.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Post Information</h3>
                    <div className="space-y-2 text-gray-700">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span>Online Exchange</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4 text-blue-600" />
                        <span>Public Post</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Exchange */}
            <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Skills Exchange</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-3">Looking For</h4>
                  <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full text-lg font-medium shadow-lg">
                    {post.requiredSkills}
                  </span>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-3">Offering</h4>
                  <span className="inline-block bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-full text-lg font-medium shadow-lg">
                    {post.providedSkills}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Profile Card */}
            <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  {post.userId?.name ? post.userId.name.charAt(0).toUpperCase() : <User className="w-10 h-10" />}
                </div>
                <h3 className="text-xl font-bold text-gray-800">{post.userId?.name || "Anonymous User"}</h3>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-gray-600">New Member</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {formatDate(post.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Globe className="w-4 h-4" />
                  <span>Available Online</span>
                </div>
              </div>

              {post.userId?._id && (
                <div className="space-y-3">
                  <Link
                    to={`/profile/${post.userId._id}`}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <User className="w-5 h-5" />
                    <span>View Profile</span>
                  </Link>

                  <button
                    onClick={handleContact}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Contact User</span>
                  </button>
                </div>
              )}
            </div>

            {/* Safety Tips */}
            <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-bold text-gray-800">Safety Tips</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Meet in public places for in-person exchanges</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Verify skills through portfolio or references</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Start with shorter sessions to build trust</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use our platform messaging system</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <Link
            to="/view-requests"
            className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-full shadow hover:shadow-xl text-lg font-semibold transition-all duration-300 flex items-center space-x-2 mx-auto w-fit"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to All Posts</span>
          </Link>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Contact {post.userId?.name || "User"}</h3>
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
                  placeholder="Hi! I'm interested in your skill exchange..."
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
                  <Send className="w-4 h-4" />
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

export default SkillPostDetail

