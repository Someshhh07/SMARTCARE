import express from 'express';
import path from 'path';
import apiRouter from './server/routes/api.js';
import { authMiddleware } from './server/middleware/auth.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Global Auth/Session Header parsing middleware
  app.use(authMiddleware as express.RequestHandler);

  // Healthcheck endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'operational',
      system: 'SmartCare Cloud Health Gateway',
      environment: process.env.NODE_ENV || 'development',
      academicPrototype: true,
      timestamp: new Date().toISOString(),
    });
  });

  // Mount central API router
  app.use('/api', apiRouter);

  // Development: Vite Middleware / Production: Static Files
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SmartCare Cloud] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[SmartCare Cloud] Failed to start server:', err);
  process.exit(1);
});
