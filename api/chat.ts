import { streamAi } from './src/index.js';

export async function POST(request: Request) {
  const { messages } = await request.json();
  return streamAi(messages);
}
