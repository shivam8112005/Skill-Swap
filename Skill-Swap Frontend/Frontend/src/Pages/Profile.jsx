import React from 'react'
import { 
  Eye, 
  Send, 
  Activity, 
  MessageCircle, 
  User, 
  FileText, 
  Settings,
  Menu,
  X,
  Users,
  ArrowRight,
  Star,
  Clock
} from 'lucide-react';
const Profile = () => {
  return (
     <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Profile Page</h1>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">John Doe</h2>
                  <p className="text-gray-600">Web Developer & Designer</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Skills I Offer</h3>
                  <div className="space-y-2">
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">React Development</span>
                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm ml-2">UI/UX Design</span>
                    <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">JavaScript</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Skills I Want to Learn</h3>
                  <div className="space-y-2">
                    <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Photography</span>
                    <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm ml-2">Spanish</span>
                    <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">Guitar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
  )
}

export default Profile
