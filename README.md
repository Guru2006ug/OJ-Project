# 🏆 CodeGuru - Online Judge Platform

<div align="center">

**A modern, full-stack online judge platform for competitive programming and coding practice**

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

[🌐 Live Demo](https://www.code-guru.online)

</div>

## ✨ Features

### 🎯 Core Functionality
- **Multi-language Support**: C++, Java, and Python compilation and execution
- **Real-time Code Editor**: Monaco Editor with syntax highlighting and auto-completion
- **Problem Management**: Create, edit, and solve coding problems with custom test cases
- **Automated Testing**: Run code against sample and hidden test cases
- **Submission Tracking**: Complete history of user submissions with results

### 🤖 AI-Powered Features
- **AI Code Review**: Get intelligent code analysis using Google Gemini AI
- **Code Quality Assessment**: Automated suggestions for improvements
- **Best Practices Guidance**: Learn better coding patterns and techniques

### 🎨 User Experience
- **Modern UI/UX**: Beautiful dark/light mode interface with Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates**: Live compilation results and feedback
- **Boilerplate Templates**: Auto-generated starter code for each language

### 🔐 Security & Authentication
- **JWT Authentication**: Secure user sessions with HTTP-only cookies
- **Protected Routes**: Role-based access control
- **Input Validation**: Comprehensive validation for all user inputs
- **CORS Configuration**: Secure cross-origin resource sharing

## 🏗️ Architecture

### Frontend (React + Vite)
```
Frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Compiler.jsx     # Code editor and execution
│   │   ├── Problem.jsx      # Problem management
│   │   ├── Auth/            # Authentication components
│   │   └── ...
│   ├── context/             # React context providers
│   ├── api.js              # API configuration
│   └── index.css           # Tailwind CSS styles
├── public/                 # Static assets
└── package.json
```

### Backend (Node.js + Express)
```
Backend/
├── Controller/             # Route controllers
├── models/                # MongoDB models
│   ├── User.js            # User schema
│   ├── Problem.js         # Problem schema
│   └── Submission.js      # Submission schema
├── routes/                # API routes
├── Compiler/              # Code execution engines
│   ├── executeCpp.js      # C++ compiler
│   ├── executeJava.js     # Java compiler
│   └── executePython.js   # Python interpreter
├── middleware/            # Custom middleware
├── database/              # Database configuration
└── index.js              # Server entry point
```

## ⚙️ Custom Compiler Engine

### 🏗️ **Built from Scratch**
Our Online Judge features a **custom-designed compiler engine** built entirely from the ground up, without relying on any external sandbox libraries or third-party compilation services.

### 🔧 **Core Design Principles**
- **Native Implementation**: Direct system calls to language compilers (g++, javac, python3)
- **File-based Execution**: Secure temporary file handling with UUID-based naming
- **Process Management**: Custom subprocess execution with timeout controls
- **Memory Management**: Automatic cleanup of temporary files and processes
- **Error Handling**: Comprehensive error capture and user-friendly messaging

### 🛡️ **Security Architecture**
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Code     │────│  File Generator  │────│ Temp Directory │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Compiler Engine │────│  Process Spawn   │────│   Execution     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Output Cap.   │────│  Error Handling  │────│    Cleanup      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 💡 **Key Features**
- **No Sandbox Dependencies**: Built without Docker sandboxes or external isolation tools
- **Direct Compilation**: Interfaces directly with system compilers
- **Resource Control**: Built-in timeout and memory management
- **Multi-language Support**: Unified interface for C++, Java, and Python
- **Real-time Feedback**: Immediate compilation and execution results

### 🎯 **Execution Flow**
1. **Code Reception**: User code received via API endpoint
2. **File Generation**: Unique temporary file created with UUID naming
3. **Compilation**: Direct system call to appropriate compiler
4. **Execution**: Process spawning with input/output redirection
5. **Result Capture**: Output collection and error handling
6. **Cleanup**: Automatic removal of temporary files and processes

This custom approach provides **maximum control**, **optimal performance**, and **simplified deployment** without the overhead of complex sandboxing solutions.

## 🚀 Quick Start

### Prerequisites
- Node.js (≥16.0.0)
- MongoDB Atlas account
- Google Gemini API key
- Docker (optional)

### 🐳 Docker Setup (Recommended)

1. **Clone the repository**
```bash
git clone https://github.com/Guru2006ug/OJ-Project.git
cd Online-Judge
```

2. **Set up environment variables**
```bash
# Backend/.env
MONGODB_URL=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:3000
PORT=5000
```

```bash
# Frontend/frontend/.env
# For local development:
VITE_API_BASE_URL=http://localhost:5000

# For production:
# VITE_API_BASE_URL=https://backend.code-guru.online
```

3. **Run with Docker**
```bash
cd Backend
docker-compose up --build
```

4. **Start Frontend**
```bash
cd Frontend/frontend
npm install
npm run dev
```

### 💻 Local Development Setup

#### Backend Setup
```bash
cd Backend
npm install
npm run dev
```

#### Frontend Setup
```bash
cd Frontend/frontend
npm install
npm run dev
```

## 📋 Environment Variables

### Backend Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URL` | MongoDB connection string | ✅ |
| `SECRET_KEY` | JWT signing secret | ✅ |
| `GOOGLE_GEMINI_API_KEY` | Google AI API key | ✅ |
| `FRONTEND_URL` | Frontend application URL | ✅ |
| `PORT` | Server port (default: 5000) | ❌ |

### Frontend Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | ✅ |

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Code Editor**: Monaco Editor
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Markdown**: React Markdown

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcryptjs
- **AI Integration**: Google Generative AI
- **File Handling**: UUID for unique file names

### DevOps & Deployment
- **Containerization**: Docker & Docker Compose
- **Process Management**: PM2 (production)
- **Environment**: Environment variables with dotenv

## 📝 API Documentation

### Authentication Endpoints
```http
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
GET  /api/auth/me         # Get current user
POST /api/auth/logout     # User logout
```

### Problem Management
```http
GET    /api/problems       # Get all problems
GET    /api/problems/:id   # Get problem by ID
POST   /api/problems       # Create new problem (authenticated)
PUT    /api/problems/:id   # Update problem (authenticated)
DELETE /api/problems/:id   # Delete problem (authenticated)
```

### Code Compilation
```http
POST /api/compiler         # Compile and run code
```

### AI Code Review
```http
POST /api/ai/ai-review     # Get AI code review (authenticated)
```

### Submissions
```http
GET  /api/submissions/:problemId  # Get user submissions for a problem
POST /api/submissions            # Submit solution
```

## 🎯 Usage Guide

### For Students/Developers
1. **Sign Up**: Create an account on the platform
2. **Browse Problems**: Explore available coding challenges
3. **Solve Problems**: Use the built-in code editor with boilerplate templates
4. **Test Solutions**: Run code against sample and hidden test cases
5. **Get AI Review**: Receive intelligent feedback on your code
6. **Track Progress**: Monitor your submission history

### For Educators/Problem Setters
1. **Create Problems**: Add new coding challenges with test cases
2. **Set Difficulty**: Categorize problems as easy, medium, or hard
3. **Define Test Cases**: Create both visible sample and hidden test cases
4. **Monitor Submissions**: Track student progress and submissions

## 🔧 Supported Programming Languages

| Language | File Extension | Compiler/Interpreter |
|----------|----------------|---------------------|
| C++ | `.cpp` | g++ (GNU Compiler) |
| Java | `.java` | javac + java |
| Python | `.py` | python3 |

### Language-specific Features
- **C++**: STL libraries, competitive programming headers
- **Java**: Scanner input handling, Main class structure
- **Python**: Common imports, proper main function structure

## 🎨 UI/UX Features

### Design Highlights
- **Dark/Light Mode**: Toggle between themes
- **Responsive Layout**: Mobile-first design approach
- **Modern Aesthetics**: Glassmorphism effects and smooth animations
- **Intuitive Navigation**: Clear user flow and navigation
- **Code Syntax Highlighting**: Monaco Editor with VS Code experience

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Compatible**: ARIA labels and semantic HTML
- **High Contrast Support**: Accessible color schemes
- **Responsive Text**: Scalable font sizes

## 🚀 Deployment

### Production Deployment
1. **Build Frontend**
```bash
cd Frontend/frontend
npm run build
```

2. **Deploy Backend**
```bash
cd Backend
docker build -t online-judge-backend .
docker run -p 5000:5000 online-judge-backend
```

3. **Environment Configuration**
- Set production environment variables
- Configure MongoDB Atlas for production
- Set up SSL certificates for HTTPS
- Configure reverse proxy (Nginx recommended)

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **CORS Configuration**: Controlled cross-origin requests
- **Input Sanitization**: Prevention of code injection attacks
- **Rate Limiting**: Protection against abuse (recommended to add)
- **Environment Variables**: Sensitive data protection

## 🐛 Troubleshooting

### Common Issues

**Backend Connection Issues**
- Verify MongoDB connection string
- Check if backend server is running on correct port
- Ensure environment variables are properly set

**Frontend Build Issues**
- Clear node_modules and reinstall dependencies
- Check Node.js version compatibility
- Verify environment variables format

**Code Execution Issues**
- Ensure Docker containers have necessary compilers installed
- Check file permissions in codes/ and outputs/ directories
- Verify language-specific syntax in boilerplate templates

## 📊 Performance

### Optimization Features
- **Code Splitting**: Lazy loading for better performance
- **API Caching**: Optimized database queries
- **File Cleanup**: Automatic temporary file management
- **Connection Pooling**: MongoDB connection optimization
- **Compression**: Gzip compression for API responses

## 📈 Future Enhancements

### Planned Features
- [ ] **Contest Mode**: Time-based competitive programming contests
- [ ] **Leaderboards**: User ranking and achievement system
- [ ] **Discussion Forums**: Community interaction for each problem
- [ ] **Video Tutorials**: Integrated learning content
- [ ] **Code Templates**: More language support and templates
- [ ] **Plagiarism Detection**: Code similarity analysis
- [ ] **Administrative Dashboard**: Enhanced problem management
- [ ] **API Rate Limiting**: Enhanced security measures


## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Monaco Editor**: Providing excellent code editing experience
- **Google Gemini AI**: Powering intelligent code reviews
- **MongoDB Atlas**: Reliable cloud database service
- **Tailwind CSS**: Beautiful and responsive UI components
- **React Community**: Extensive ecosystem and support

## 📞 Support

For support, please reach out through:
- **Email**: 2300030442cseird@gmail.com



---

<div align="center">
  <p>Made with ❤️ to all the learners</p>
  <p>
    <a href="https://www.code-guru.online">🌐 Website</a> •
    <a href="https://github.com/Guru2006ug/OJ-Project">📂 Repository</a> •
  </p>
</div>
