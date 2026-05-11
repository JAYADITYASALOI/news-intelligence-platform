import mysql from 'mysql2/promise';
import env from './env.js';

const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS sync_runs (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    status ENUM('running', 'success', 'partial', 'failed') NOT NULL DEFAULT 'running',
    source VARCHAR(100) NOT NULL DEFAULT 'newsdata.io',
    query_text VARCHAR(255) NULL,
    country VARCHAR(20) NULL,
    category VARCHAR(100) NULL,
    language VARCHAR(20) NULL,
    fetched_count INT NOT NULL DEFAULT 0,
    inserted_count INT NOT NULL DEFAULT 0,
    skipped_count INT NOT NULL DEFAULT 0,
    error_message TEXT NULL,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX idx_sync_runs_status (status),
    INDEX idx_sync_runs_started_at (started_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
  `CREATE TABLE IF NOT EXISTS articles (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    article_hash CHAR(64) NOT NULL,
    title VARCHAR(1000) NOT NULL,
    description TEXT NULL,
    content LONGTEXT NULL,
    article_url TEXT NOT NULL,
    image_url TEXT NULL,
    source_id VARCHAR(255) NULL,
    source_name VARCHAR(255) NULL,
    source_url TEXT NULL,
    author VARCHAR(255) NULL,
    country VARCHAR(255) NULL,
    category VARCHAR(255) NULL,
    language VARCHAR(20) NULL,
    published_at DATETIME NULL,
    ai_summary TEXT NULL,
    ai_sentiment ENUM('positive', 'negative', 'neutral') NOT NULL DEFAULT 'neutral',
    ai_insights JSON NULL,
    ai_keywords JSON NULL,
    raw_json JSON NULL,
    sync_run_id BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_articles_article_hash (article_hash),
    INDEX idx_articles_published_at (published_at),
    INDEX idx_articles_source_name (source_name),
    INDEX idx_articles_category (category),
    INDEX idx_articles_sentiment (ai_sentiment),
    CONSTRAINT fk_articles_sync_run
      FOREIGN KEY (sync_run_id) REFERENCES sync_runs(id)
      ON DELETE SET NULL
      ON UPDATE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
];

const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true
});

export async function testConnection() {
  const [rows] = await pool.query('SELECT 1 AS ok');
  return rows?.[0]?.ok === 1;
}

export async function initializeDatabase() {
  for (const statement of schemaStatements) {
    await pool.query(statement);
  }
}

export async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

export async function execute(sql, params = []) {
  const [result] = await pool.execute(sql, params);
  return result;
}

export default pool;