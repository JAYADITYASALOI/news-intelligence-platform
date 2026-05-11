News Intelligence Platform
AI-Powered Real-Time News Analysis and Intelligence Dashboard
A full-stack intelligent news aggregation and analysis platform that transforms raw news data into structured insights using AI-driven processing, sentiment analysis, summarization, and advanced filtering.

Demo Video
Prototype Video Link:
https://drive.google.com/file/d/12WhgMG-Dt5Fyu0VQATnwQLQefN731mDM/view?usp=drive_link
https://1drv.ms/v/c/a9e0688a1c14fa97/IQBwVY5twGmBT556Qb5EQDUlAWcuNrNFsnIk2j09YCDjUcs?e=9PVquV

GitHub Repository
Repository Link:
https://github.com/JAYADITYASALOI/news-intelligence-platform

Project Overview
In today’s digital ecosystem, massive volumes of news are generated every minute across multiple domains such as technology, business, politics, cybersecurity, finance, and global affairs. The primary challenge is not the availability of information, but the overload of unstructured information. Traditional news platforms mainly focus on displaying articles, while users still spend significant time trying to:
•	Understand article relevance
•	Analyze sentiment
•	Identify trends
•	Compare sources
•	Extract useful insights
•	Filter large-scale information efficiently
The platform automatically fetches real-time news data, processes and analyzes articles using AI-driven logic, stores structured information in a relational database, and presents the results through an interactive analytics dashboard.
Key Features
Real-Time News Synchronization
•	Fetches live news data from NewsData.io API
•	Handles multi-page news synchronization
•	Supports scheduled sync jobs
•	Duplicate article prevention
•	API pagination handling
•	Fault-tolerant synchronization workflow

AI-Powered News Intelligence
The platform transforms raw articles into structured intelligence using:
•	AI-generated summaries
•	Sentiment analysis
•	Keyword extraction
•	Insight generation
•	Article normalization

Advanced Search and Filtering
•	Search articles by keyword
•	Filter by sentiment
•	Filter by category
•	Filter by source
•	Filter by date range
•	Sort by publication date

Modern Interactive Dashboard
The frontend dashboard provides:
•	Responsive UI
•	Pagination support
•	Dynamic article rendering
•	Analytics overview
•	Real-time updates
•	Structured article cards
•	Clean user experience
Scalable Backend Architecture
•	Controllers
•	Services
•	Routes
•	Middleware
•	Utility layers
•	Scheduled jobs
This improves maintainability, scalability, debugging, and future extensibility.
Technology Stack
Frontend
•	React.js
•	Vite
•	Axios
•	CSS
Why React + Vite?
•	Component-based architecture
•	Fast rendering performance
•	Reusable UI components
•	Extremely fast development environment
•	Optimized production builds
Backend
•	Node.js
•	Express.js
•	Axios
Why Node.js + Express?
•	Efficient asynchronous API handling
•	Lightweight REST API development
•	Scalable server-side architecture
•	Ideal for real-time data ingestion systems
Database
•	MySQL
External API
•	NewsData.io API
System Architecture
┌─────────────────────┐
│    NewsData.io API  │
└──────────┬──────────┘
│
▼
┌─────────────────────┐
│  News Sync Service  │
└──────────┬──────────┘
│
▼
┌─────────────────────┐
│ AI Processing Layer │
│ - Summarization     │
│ - Sentiment         │
│ - Keywords          │
│ - Insights          │
└──────────┬──────────┘
│
▼
┌─────────────────────┐
│      MySQL DB       │
└──────────┬──────────┘
│
▼
┌─────────────────────┐
│   Express Backend   │
└──────────┬──────────┘
│
▼
┌─────────────────────┐
│ React Frontend UI   │
└─────────────────────┘

Database Architecture
Core Capabilities
•	Article deduplication using hashing
•	AI metadata persistence
•	Source tracking
•	Category management
•	Efficient filtering and pagination
•	Sync run tracking
Major Stored Fields
•	Article title
•	Description
•	Content
•	Source information
•	Published date
Folder Structure
news-intelligence-platform/
├── README.md
├── .gitignore
├── backend/
│   ├── package.json
│   ├── .env.example
│   └── src/
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── src/
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── README.md
└── docs/
    ├── architecture.md
    ├── screenshots/
    └── demo/
API Endpoints
Articles API
GET /api/articles
•	Search
•	Pagination
•	Sentiment filters
•	Category filters
•	Source filters
•	Date range filtering
•	Sorting
Stats API
GET /api/stats/overview
•	Total articles
•	Sentiment distribution
•	Category analytics
•	Source analytics
Sync API
POST /api/sync
Triggers manual news synchronization.
Installation and Setup
1. Clone Repository
git clone https://github.com/JAYADITYASALOI/news-intelligence-platform.git
cd news-intelligence-platform
2. Backend Setup
cd backend
npm install
Create .env using .env.example
Run backend:
npm run dev
3. Frontend Setup
cd frontend
npm install
Create .env using .env.example
Run frontend:
npm run dev
4. Database Setup
/database/schema.sql
Environment Variables
Backend
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=news_intelligence_platform
DB_USER=root
DB_PASSWORD=your_password
NEWSDATA_API_KEY=your_api_key
NEWSDATA_BASE_URL=https://newsdata.io/api/1/latest
NEWSDATA_DEFAULT_LANGUAGE=en
Frontend
VITE_API_BASE_URL=http://localhost:5000/api

Challenges Faced
During development, several production-style challenges were encountered:
•	API timeout handling
•	Socket connection resets
•	Multi-page synchronization reliability
•	Data normalization inconsistencies
•	Duplicate article handling
•	Database constraint issues
•	Large-scale pagination management
These were resolved through:
•	Optimized timeout configuration
•	Error handling middleware
•	Structured retry-safe synchronization logic
•	Improved schema validation
•	Data sanitization and normalization
Key Highlights
AI-Driven News Understanding
The platform does not simply display articles.
It converts news into structured intelligence.
Production-Style Backend Design
The backend architecture reflects real-world scalable system design principles.
Intelligent Data Processing Pipeline
The project demonstrates:
•	Data ingestion
•	Data normalization
•	AI enhancement
•	Structured storage
•	Interactive visualization


Full-Stack Engineering Demonstration
The project showcases:
•	Frontend engineering
•	Backend engineering
•	Database architecture
•	API integration
•	AI integration
•	System design
Future Enhancements
Given additional development time, the following enhancements are planned:
•	Real-time WebSocket updates
•	Multi-source news aggregation
•	JWT authentication system
•	Personalized dashboards
•	Trend prediction models
•	Interactive data visualizations
•	Docker containerization
•	Cloud deployment
•	CI/CD integration
•	Redis caching
•	Progressive Web App support
Learning Outcomes
This project provided practical experience in:
•	Full-stack application development
•	REST API design
•	Database schema design
•	Real-time synchronization systems
•	Error handling strategies
•	AI-assisted data processing
•	Scalable software architecture
Author - JAYADITYA SALOI
GitHub: https://github.com/JAYADITYASALOI
GitHub: https://github.com/JAYADITYASALOI/news-intelligence-platform

