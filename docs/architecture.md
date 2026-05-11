Architecture

The News Intelligence Platform follows a modular full-stack architecture designed for scalable news ingestion, intelligent processing, analytics generation, and efficient data delivery.

1. Frontend Layer

The frontend is built using React.js and Vite, providing a fast and responsive user interface. It communicates with the backend through REST APIs and renders:

real-time news articles,
sentiment analytics,
search and filtering systems,
pagination,
statistical dashboards,
AI-generated insights.

The frontend is responsible only for presentation and user interaction, while all business logic and data processing are handled by the backend services.

2. Backend API Layer

The backend is developed using Node.js and Express.js and acts as the core orchestration layer of the platform.

Responsibilities include:

handling API requests,
managing synchronization workflows,
processing article ingestion,
performing data normalization,
triggering AI analysis,
managing analytics endpoints,
interacting with the database.

The backend exposes RESTful APIs for:

article retrieval,
filtering,
analytics,
sync operations,
dashboard statistics.
3. News Ingestion Pipeline

The platform integrates with the NewsData.io API to fetch real-time news articles.

The ingestion pipeline performs:

paginated fetching,
retry handling,
request timeout management,
duplicate prevention,
structured normalization,
controlled synchronization.

Fetched articles are transformed into a consistent internal format before storage.

4. AI Processing Layer

An AI processing module enhances raw news articles using NLP-based analysis.

This layer generates:

AI summaries,
sentiment classification,
keyword extraction,
analytical insights.

The processed intelligence is stored alongside the original article data for faster retrieval and analytics generation.

5. Database Layer

MySQL is used as the primary persistent storage system.

The database stores:

article metadata,
article content,
AI-generated analysis,
sync history,
source information,
analytics-related data.

Database operations use optimized insert/update strategies with duplicate handling and indexed querying for efficient filtering and pagination.

6. Analytics & Insights Engine

The analytics engine aggregates processed article data to generate:

sentiment distribution,
trending topics,
source statistics,
category analysis,
dashboard metrics.

These insights are exposed through dedicated backend endpoints and visualized in the frontend dashboard.

7. Synchronization System

A scheduled synchronization service periodically fetches fresh news data automatically.

The sync system includes:

concurrency protection,
retry logic,
controlled pagination,
failure logging,
timeout handling,
sync status monitoring.

This ensures stable and resilient data ingestion even during API instability or network interruptions.

8. Overall Workflow
User interacts with the frontend dashboard.
Frontend sends API requests to the backend.
Backend fetches processed news data from MySQL.
Scheduled sync service continuously retrieves fresh news from NewsData.io.
Articles are normalized and passed through AI analysis.
Processed articles and analytics are stored in the database.
Backend serves structured intelligence data to the frontend.
Frontend visualizes insights through dashboards, filters, and article views.