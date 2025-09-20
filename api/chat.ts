import type { UIMessage } from 'ai';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { streamAi } from './src/index.js';

interface RequestBody {
  messages: UIMessage[];
}

const app = new Hono();
app.use('/api/*', cors());

app.post('/api/chat', async (c) => {
  c.header('Content-Type', 'none');

  const body: RequestBody = await c.req.json();
  return streamAi(body.messages);
});

export default app;
