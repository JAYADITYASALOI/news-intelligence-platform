Database Architecture

The News Intelligence Platform uses a relational database architecture built on MySQL to ensure structured storage, efficient querying, scalable ingestion, and reliable analytics generation.

The database is designed to support:

real-time news ingestion,
AI-generated insights,
duplicate prevention,
advanced filtering,
pagination,
analytics computation,
synchronization tracking.
1. Core Database Design

The database follows a normalized yet performance-oriented structure where articles act as the central entity of the system.

Key design goals include:

fast read performance,
reliable data consistency,
scalable ingestion handling,
optimized analytics queries,
efficient duplicate detection.

The architecture separates:

raw article data,
processed AI outputs,
synchronization metadata,
analytical information.
2. Articles Table

The articles table is the primary storage layer of the platform.

It stores:

article metadata,
article content,
source information,
publication details,
AI-generated analysis,
raw API responses.

Typical stored fields include:

article title,
description,
content,
article URL,
image URL,
source details,
author information,
country,
category,
language,
publication timestamp,
AI summary,
AI sentiment,
AI insights,
extracted keywords,
synchronization references.

Each article is uniquely identified using a generated article hash to prevent duplicate insertions across multiple sync runs.

3. Duplicate Prevention Strategy

To avoid storing duplicate news entries, the system generates a unique hash using stable article identifiers such as:

article URL,
title,
source name,
publication timestamp.

This hash is enforced using unique constraints and upsert operations.

Benefits:

prevents redundant storage,
reduces database growth,
improves analytics accuracy,
ensures cleaner datasets.
4. AI Intelligence Storage

AI-generated outputs are stored directly alongside article records for faster retrieval.

Stored AI fields include:

AI-generated summary,
sentiment classification,
extracted keywords,
analytical insights.

This eliminates repeated AI processing requests and improves dashboard performance.

5. Synchronization Tracking

The database maintains synchronization metadata to track ingestion operations.

The sync system records:

sync execution identifiers,
ingestion timestamps,
fetched article counts,
processing status,
synchronization history.

This enables:

monitoring,
debugging,
audit tracking,
failure recovery.
6. Query Optimization

The database is optimized for high-frequency read operations using:

indexed columns,
pagination-friendly queries,
filtered retrieval,
selective field access.

Indexes are typically applied to:

publication date,
sentiment,
category,
source name,
article hash,
synchronization identifiers.

This ensures fast dashboard loading and efficient analytics generation even with large datasets.

7. Data Normalization

Incoming API responses often contain inconsistent structures such as arrays or nested objects.

The ingestion layer normalizes:

country values,
categories,
author fields,
source metadata,
timestamps.

This guarantees consistent storage formats across all records.

8. Analytics Support

The database architecture supports real-time analytics generation by enabling efficient aggregation queries for:

sentiment distribution,
source analysis,
trending categories,
publication trends,
keyword frequency,
article statistics.

These aggregated insights power the analytics dashboard displayed to users.

9. Scalability Considerations

The architecture is designed to scale for larger ingestion volumes through:

controlled pagination,
incremental synchronization,
optimized inserts,
retry-safe upsert operations,
efficient indexing strategies.

This allows the platform to handle continuous news ingestion without significant performance degradation.

10. Database Workflow
News articles are fetched from external APIs.
Raw article data is normalized.
Duplicate detection is performed using article hashes.
AI processing generates summaries and insights.
Structured records are inserted into MySQL.
Existing records are updated using upsert operations.
Analytics queries aggregate stored intelligence data.
Processed insights are served to the frontend dashboard through backend APIs.