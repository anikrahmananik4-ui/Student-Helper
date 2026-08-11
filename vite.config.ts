import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

function vercelApiDevPlugin(): Plugin {
  return {
    name: 'vercel-api-dev-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api')) {
          return next();
        }

        try {
          const urlObj = new URL(req.url, 'http://localhost:3000');
          const pathname = urlObj.pathname;

          let filePath = path.resolve(__dirname, `.${pathname}.ts`);
          if (!fs.existsSync(filePath)) {
            filePath = path.resolve(__dirname, `.${pathname}/index.ts`);
          }

          if (fs.existsSync(filePath)) {
            if (req.method !== 'GET' && req.method !== 'HEAD' && !(req as any).body) {
              const buffers: Buffer[] = [];
              for await (const chunk of req) {
                buffers.push(chunk);
              }
              const rawBody = Buffer.concat(buffers).toString('utf-8');
              try {
                (req as any).body = JSON.parse(rawBody || '{}');
              } catch {
                (req as any).body = rawBody;
              }
            }

            (res as any).status = function (code: number) {
              res.statusCode = code;
              return res;
            };
            (res as any).json = function (data: any) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return res;
            };

            const module = await server.ssrLoadModule(filePath);
            const handler = module.default;
            if (typeof handler === 'function') {
              return await handler(req, res);
            }
          }
        } catch (err) {
          console.error('Vite API Dev Plugin Error:', err);
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), vercelApiDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
