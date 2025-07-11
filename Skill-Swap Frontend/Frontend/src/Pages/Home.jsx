import React, { useState } from 'react';
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
import Navigation from '../Components/Navigation';

const Home = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Users },
    { id: 'view-requests', label: 'View Open Barter Requests', icon: Eye },
    { id: 'send-request', label: 'Send Barter Request', icon: Send },
    { id: 'active-requests', label: 'Active Barter Requests', icon: Activity },
    { id: 'chat', label: 'Chat with Active Barter', icon: MessageCircle },
    { id: 'profile', label: 'Profile Page', icon: User },
    { id: 'text-quiz', label: 'Summarize Text & Generate Quiz', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const featuredSkills = [
    { name: 'Web Development', requests: 24, rating: 4.8 },
    { name: 'Graphic Design', requests: 18, rating: 4.9 },
    { name: 'Data Analysis', requests: 12, rating: 4.7 },
    { name: 'Language Teaching', requests: 31, rating: 4.6 },
    { name: 'Photography', requests: 15, rating: 4.8 },
    { name: 'Music Production', requests: 8, rating: 4.9 }
  ];

  const recentActivities = [
    { user: 'Sarah M.', action: 'requested help with Python programming', time: '2 hours ago' },
    { user: 'John D.', action: 'offered guitar lessons', time: '4 hours ago' },
    { user: 'Emily R.', action: 'completed a logo design barter', time: '1 day ago' },
    { user: 'Mike T.', action: 'started chatting about web development', time: '2 days ago' }
  ];

  const handleTabClick = (tabId) => {
    if (tabId === 'text-quiz') {
      setIsModalOpen(true);
    } else {
      setActiveTab(tabId);
    }
    setIsSidebarOpen(false);
  };

  const renderContent = () => {
    
     
        return (
          <div className="space-y-8">
            <div className="text-center bg-blue-50 p-8 rounded-lg">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome Shivam!</h1>
              <p className="text-lg text-gray-600 mb-6">Connect with others to exchange skills and learn something new</p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Start Bartering
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Featured Skills</h2>
                <div className="space-y-3">
                  {featuredSkills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800">{skill.name}</h3>
                        <p className="text-sm text-gray-600">{skill.requests} active requests</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">{skill.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">How It Works</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Send className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-800 mb-2">Post Your Request</h3>
                  <p className="text-sm text-gray-600">Describe what skill you want to learn and what you can offer in return</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-medium text-gray-800 mb-2">Find Matches</h3>
                  <p className="text-sm text-gray-600">Browse available requests and connect with people who need your skills</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-medium text-gray-800 mb-2">Start Learning</h3>
                  <p className="text-sm text-gray-600">Chat with your match and begin exchanging knowledge</p>
                </div>
              </div>
            </div>
          </div>
        );
     
    
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`h-screen bg-white transition-all duration-300 ${isSidebarOpen ? 'w-60' : 'w-16'}`}>

  <Navigation activeTab={activeTab}
  setActiveTab={setActiveTab}
  isSidebarOpen={isSidebarOpen}
  setIsSidebarOpen={setIsSidebarOpen}
  setIsModalOpen={setIsModalOpen} />
</div>



      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              {navigationItems.find(item => item.id === activeTab)?.label || 'Home'}
            </h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <User className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Text Summarize & Quiz Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Summarize Text & Generate Quiz</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paste your text here</label>
                <textarea
                  rows="6"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Enter text to summarize and generate quiz from..."
                />
              </div>
              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Generate Summary
                </button>
                <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Create Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;