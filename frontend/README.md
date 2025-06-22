# Medical Document Chatbot - Frontend

This is the frontend application for the Medical Document Analysis AI Assistant.

## Features

- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **File Upload**: Drag & drop PDF upload with visual feedback
- **Multi-language Support**: Support for English, Hindi, Telugu, Tamil, Kannada, and more
- **Real-time Chat**: AI-powered chat interface for medical document analysis
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool and dev server
- **Lucide React** - Icons
- **React Dropzone** - File upload

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── ChatInterface.tsx
│   │   ├── FileUpload.tsx
│   │   └── LanguageSelector.tsx
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   ├── types.ts            # TypeScript type definitions
│   └── index.css           # Global styles
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## API Integration

The frontend communicates with the backend API running on `http://localhost:8000`:

- `POST /upload` - Upload PDF documents
- `POST /query` - Send questions about documents
- `GET /languages` - Get supported languages
- `GET /health` - Health check

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

This project uses ESLint for code linting and follows React best practices.

## Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Test your changes thoroughly
4. Update documentation as needed 