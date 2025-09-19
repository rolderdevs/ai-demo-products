import { cors } from '@elysiajs/cors';
import { Elysia, t } from 'elysia';
import { streamAi } from './src';

const app = new Elysia({ prefix: '/api' }).use(cors()).post(
  '/chat',
  async (p) => {
    return streamAi(p.body.messages);
  },
  {
    body: t.Any(),
  },
);

// Development server (runs locally with `bun run api/index.ts`)
if (process.env.NODE_ENV !== 'production') {
  app.listen({ port: 3000 });
  console.log('API is running on http://localhost:3000');
}

export default app.handle;
