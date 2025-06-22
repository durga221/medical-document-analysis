import React, { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { LanguageSelector } from './components/LanguageSelector';
import { ChatInterface } from './components/ChatInterface';
import { Message } from './types';
import { Bot, Upload, Settings, Zap, Brain, FileText, Globe, Sparkles, Shield, Award, Users, Clock } from 'lucide-react';

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const API_URL = 'http://localhost:8000';

  useEffect(() => {
    async function checkBackendHealth() {
      try {
        const response = await fetch(`${API_URL}/health`);
        if (!response.ok) {
          console.warn('Backend health check failed. Server might be down.');
        }
      } catch (error) {
        console.error('Error connecting to backend:', error);
      }
    }
    
    checkBackendHealth();
  }, []);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setUploadedFile(file);
    setMessages([]);
    setDocumentId(null);
    setShowUploadModal(false);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Uploading file:', file.name);
      
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as any;
        console.error('API Error:', response.status, errorData);
        throw new Error(`File upload failed: ${errorData.detail || 'Server error'}`);
      }

      const data = await response.json();
      setDocumentId(data.document_id);
      console.log('File uploaded successfully. Document ID:', data.document_id);
      
      setMessages([
        {
          id: Date.now().toString(),
          content: `✨ Document "${file.name}" has been successfully processed and is ready for analysis. Ask me anything about your medical document!`,
          isUser: false,
          timestamp: new Date(),
        },
      ]);

    } catch (error: any) {
      console.error('Error processing file:', error);
      setMessages([
        {
          id: Date.now().toString(),
          content: `❌ Error processing document: ${error.message || 'Unknown error'}. Please try again.`,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
      setUploadedFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    if (!documentId) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: "📄 Please upload a document first to start analyzing your medical content.",
          isUser: false,
          timestamp: new Date(),
        }
      ]);
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: 'typing-indicator',
        content: '🤔 Analyzing your question...',
        isUser: false,
        timestamp: new Date(),
      },
    ]);

    try {
      console.log('Sending query to backend with language:', selectedLanguage);
      
      const response = await fetch(`${API_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document_id: documentId,
          question: content,
          language: selectedLanguage
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as any;
        console.error('API Error:', response.status, errorData);
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received response from backend');
      
      setMessages((prev) => 
        prev.filter(msg => msg.id !== 'typing-indicator').concat({
          id: Date.now().toString(),
          content: data.response,
          isUser: false,
          timestamp: new Date(),
        })
      );
    } catch (error: any) {
      console.error('Error getting response:', error);
      setMessages((prev) => 
        prev.filter(msg => msg.id !== 'typing-indicator').concat({
          id: Date.now().toString(),
          content: `❌ Error: ${error.message || 'Could not get response from server'}. Please try again.`,
          isUser: false,
          timestamp: new Date(),
        })
      );
    }
  };

  const suggestedQuestions = [
    "What are the main findings in this document?",
    "Summarize the key medical information",
    "What are the recommended treatments?",
    "Are there any important warnings or side effects?",
    "What tests or procedures are mentioned?",
    "Explain the diagnosis in simple terms",
    "What medications are prescribed?",
    "Are there any lifestyle recommendations?"
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-[576px]' : 'w-20'} bg-white/80 backdrop-blur-xl border-r border-white/20 transition-all duration-500 ease-in-out flex flex-col`}>
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse">
              <Brain className="w-7 h-7 text-white" />
            </div>
            {sidebarOpen && (
              <div className="animate-fade-in">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MediAI
                </h1>
                <p className="text-sm text-gray-500 font-medium">Medical Document Analysis</p>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-8 overflow-y-auto">
          {/* Website Description */}
          {sidebarOpen && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-8 animate-fade-in-up w-full max-w-none">
              <h3 className="text-2xl font-extrabold text-gray-900 mb-4">About MediAI</h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4 font-medium">
                MediAI is an advanced AI-powered medical document analysis platform designed to help healthcare professionals and patients understand complex medical documents quickly and accurately.
              </p>
              <p className="text-base text-blue-700 font-semibold mb-4">Available in many languages including English, Hindi, Telugu, Tamil, Kannada, and more!</p>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-base text-gray-700 font-semibold">Secure & Private</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span className="text-base text-gray-700 font-semibold">AI-Powered</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="text-base text-gray-700 font-semibold">Multi-Language</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span className="text-base text-gray-700 font-semibold">24/7 Available</span>
                </div>
              </div>
            </div>
          )}

          {/* Current Document */}
          {uploadedFile && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 animate-bounce-in">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center animate-pulse">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                {sidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-gray-900 truncate">
                      {uploadedFile.name}
                    </p>
                    <p className="text-sm text-green-600 font-medium">Ready for analysis</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Language Selector */}
          {sidebarOpen && (
            <div className="space-y-4 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center space-x-3">
                <Globe className="w-6 h-6 text-gray-500" />
                <span className="text-xl font-extrabold text-gray-700">Language</span>
              </div>
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
            </div>
          )}

          {/* Quick Actions */}
          {sidebarOpen && (
            <div className="space-y-4 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center space-x-3">
                <Zap className="w-6 h-6 text-gray-500" />
                <span className="text-xl font-extrabold text-gray-700">Quick Actions</span>
              </div>
              <div className="space-y-3">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(question)}
                    disabled={!documentId}
                    className="w-full text-left p-5 bg-white/60 hover:bg-white/80 border border-white/40 rounded-xl text-lg text-gray-700 hover:text-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-lg font-medium"
                    style={{animationDelay: `${0.6 + index * 0.1}s`}}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Toggle Sidebar */}
        <div className="p-4 border-t border-white/20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full p-4 bg-white/60 hover:bg-white/80 border border-white/40 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105"
          >
            <Settings className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white/60 backdrop-blur-xl border-b border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-3 hover:bg-white/60 rounded-xl transition-all duration-300 hover:scale-110"
              >
                <Bot className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Medical Document Assistant</h2>
                <p className="text-base text-gray-500">AI-powered analysis and insights</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Upload className="w-5 h-5" />
              <span className="text-base">Upload Document</span>
            </button>
          </div>
        </div>

        {/* Chat Area with max width and larger font */}
        <div className="flex-1 flex justify-center items-stretch bg-transparent">
          <div className="w-full max-w-3xl mx-auto py-8 px-2 md:px-8" style={{ fontSize: '1.25rem', lineHeight: '2rem' }}>
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Medical Document</h3>
              <p className="text-base text-gray-500">Drop your PDF file to start analyzing</p>
            </div>
            
            <FileUpload onFileUpload={handleFileUpload} />
            
            <button
              onClick={() => setShowUploadModal(false)}
              className="w-full mt-6 p-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all duration-300 hover:scale-105"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 text-center animate-scale-in">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Processing Document</h3>
            <p className="text-base text-gray-500">Analyzing your medical document...</p>
            <div className="mt-6 w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;