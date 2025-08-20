import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Save, Loader } from "lucide-react"

const EditPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [post, setPost] = useState(null)
  const [formData, setFormData] = useState({
    type: "",
    skillDescription: "",
    requiredSkills: [],
    providedSkills: [],
    barterDateTime: "",
  })

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/"

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
    //   const token = localStorage.getItem("token")
      const response = await fetch(`${BASE_URL}skill/editpost/${id}`, {
         method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const postData = await response.json()
        setPost(postData)
        setFormData({
          type: postData.type || "",
          skillDescription: postData.skillDescription || "",
          requiredSkills: postData.requiredSkills || [],
          providedSkills: postData.providedSkills || [],
          barterDateTime: postData.barterDateTime || "",
        })
      } else {
        console.error("Failed to fetch post")
        navigate("/my-posts")
      }
    } catch (error) {
      console.error("Error fetching post:", error)
      navigate("/my-posts")
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

  const handleSkillsChange = (e, skillType) => {
    const skills = e.target.value
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill)
    setFormData((prev) => ({
      ...prev,
      [skillType]: skills,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
    //   const token = localStorage.getItem("token")
      const response = await fetch(`${BASE_URL}skill/editpost/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        navigate("/my-posts")
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to update post")
      }
    } catch (error) {
      console.error("Error updating post:", error)
      alert("Failed to update post")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading post...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/my-posts")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to My Posts</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Edit Skill Post</h1>
          <p className="text-gray-600 mt-2">Update your skill post information</p>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Post Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select post type</option>
                <option value="offer">Skill Offer</option>
                <option value="request">Skill Request</option>
                <option value="exchange">Skill Exchange</option>
              </select>
            </div>

            {/* Skill Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skill Description *</label>
              <textarea
                name="skillDescription"
                value={formData.skillDescription}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Describe your skill in detail..."
              />
            </div>

            {/* Required Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
              <input
                type="text"
                value={formData.requiredSkills.join(", ")}
                onChange={(e) => handleSkillsChange(e, "requiredSkills")}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter required skills separated by commas (e.g., JavaScript, React, Node.js)"
              />
              <p className="text-sm text-gray-500 mt-1">Skills you need from others</p>
            </div>

            {/* Provided Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Provided Skills *</label>
              <input
                type="text"
                value={formData.providedSkills.join(", ")}
                onChange={(e) => handleSkillsChange(e, "providedSkills")}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter skills you can provide separated by commas (e.g., Python, Django, API Development)"
              />
              <p className="text-sm text-gray-500 mt-1">Skills you can offer to others</p>
            </div>

            {/* Barter Date Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Barter Date & Time</label>
              <input
                type="datetime-local"
                name="barterDateTime"
                value={formData.barterDateTime}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <p className="text-sm text-gray-500 mt-1">When would you prefer to exchange skills?</p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/my-posts")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition-colors duration-200 flex items-center space-x-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditPost
