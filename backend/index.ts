import cors from '@elysiajs/cors';
import type { UIMessage } from 'ai';
import { Elysia } from 'elysia';
import { streamAi } from './src/index';

const port = process.env.PORT || 3000;

const app = new Elysia()
  .use(cors())
  .post('/api/chat', async ({ body }) => {
    const { messages } = (await body) as { messages: UIMessage[] };
    return streamAi(messages);
  })
  .listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
