import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import env from './config/env.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import articleRoutes from './routes/articleRoutes.js';
import syncRoutes from './routes/syncRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

const app = express();

const allowedOrigins = env.CORS_ORIGIN === '*'
  ? true
  : env.CORS_ORIGIN.split(',').map((item) => item.trim()).filter(Boolean);

app.use(helmet());
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'News Intelligence Platform API is running',
    endpoints: {
      health: '/api/health',
      articles: '/api/articles',
      articleById: '/api/articles/:id',
      overview: '/api/stats/overview',
      sync: '/api/sync',
      latestSync: '/api/sync/latest'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'OK'
  });
});

app.use('/api/articles', articleRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/stats', statsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;