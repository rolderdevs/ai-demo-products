import { Elysia } from 'elysia';
import { streamAi } from './src/index';
import { UIMessage } from 'ai';

const port = process.env.PORT || 3000;

const app = new Elysia().post('/api/chat', async ({set,body}) => {
  const { messages } = await body as {messages: UIMessage[]};
  return streamAi(messages);
}).listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
