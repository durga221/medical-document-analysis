import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, X, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDragReject, setIsDragReject] = useState(false);
  const [isDragAccept, setIsDragAccept] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      setError('Please upload a valid PDF file (max 10MB)');
      return;
    }
    if (acceptedFiles.length > 0) {
      setError(null);
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 10485760, // 10MB
    onDragEnter: () => {
      setIsDragReject(false);
      setIsDragAccept(false);
    },
    onDragLeave: () => {
      setIsDragReject(false);
      setIsDragAccept(false);
    },
    onDropAccepted: () => {
      setIsDragAccept(true);
      setTimeout(() => setIsDragAccept(false), 1000);
    },
    onDropRejected: () => {
      setIsDragReject(true);
      setTimeout(() => setIsDragReject(false), 2000);
    }
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 overflow-hidden
          ${isDragActive && !isDragReject ? 'border-blue-500 bg-blue-50/50 scale-105' : ''}
          ${isDragReject ? 'border-red-500 bg-red-50/50 shake' : ''}
          ${isDragAccept ? 'border-green-500 bg-green-50/50 scale-105' : ''}
          ${!isDragActive ? 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30 hover:scale-[1.02]' : ''}
        `}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 left-4 w-8 h-8 bg-blue-500 rounded-full"></div>
          <div className="absolute top-12 right-8 w-4 h-4 bg-purple-500 rounded-full"></div>
          <div className="absolute bottom-8 left-12 w-6 h-6 bg-blue-400 rounded-full"></div>
        </div>

        <input {...getInputProps()} />
        <div className="relative z-10 flex flex-col items-center space-y-6">
          {/* Icon */}
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-300 ${
            isDragReject 
              ? 'bg-red-100 text-red-500' 
              : isDragAccept 
              ? 'bg-green-100 text-green-500' 
              : isDragActive 
              ? 'bg-blue-100 text-blue-500' 
              : 'bg-gray-100 text-gray-400'
          }`}>
            {isDragReject ? (
              <AlertCircle className="w-10 h-10" />
            ) : isDragAccept ? (
              <CheckCircle className="w-10 h-10" />
            ) : isDragActive ? (
              <Upload className="w-10 h-10" />
            ) : (
              <FileText className="w-10 h-10" />
            )}
          </div>

          {/* Text Content */}
          <div className="space-y-3">
            <h3 className={`text-lg font-bold transition-colors ${
              isDragReject ? 'text-red-600' : 
              isDragAccept ? 'text-green-600' : 
              isDragActive ? 'text-blue-600' : 'text-gray-900'
            }`}>
              {isDragReject
                ? 'Invalid file type'
                : isDragAccept
                ? 'File accepted!'
                : isDragActive
                ? 'Drop your file here'
                : 'Drop your medical PDF here'}
            </h3>
            <p className="text-sm text-gray-500">
              {isDragReject 
                ? 'Only PDF files are supported' 
                : 'PDF files only, max 10MB'}
            </p>
            {!isDragActive && (
              <p className="text-xs text-gray-400">
                Click to browse or drag and drop
              </p>
            )}
          </div>

          {/* Upload Button */}
          {!isDragActive && (
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl">
              <Upload className="w-4 h-4" />
              <span>Choose File</span>
            </button>
          )}
        </div>

        {/* Success Animation */}
        {isDragAccept && (
          <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-ping">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-4 animate-in slide-in-from-top-2">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-sm text-red-700 flex-1">{error}</span>
            <button
              onClick={() => setError(null)}
              className="hover:bg-red-100 p-1 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl p-4 text-center">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h4 className="text-sm font-semibold text-gray-900">AI Analysis</h4>
          <p className="text-xs text-gray-500">Smart document processing</p>
        </div>
        <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl p-4 text-center">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <h4 className="text-sm font-semibold text-gray-900">PDF Support</h4>
          <p className="text-xs text-gray-500">Medical document format</p>
        </div>
        <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl p-4 text-center">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
          <h4 className="text-sm font-semibold text-gray-900">Secure</h4>
          <p className="text-xs text-gray-500">Privacy focused</p>
        </div>
      </div>
    </div>
  );
}