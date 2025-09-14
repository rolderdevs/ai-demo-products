import { streamAi } from '@/ai/indext';

export async function POST(req: Request) {
  return streamAi(req);
}
