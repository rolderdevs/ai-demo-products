import { Elysia, t } from 'elysia';

const app = new Elysia({ prefix: '/api' })
  .get('/', () => `Hello from bun@${Bun.version}`)
  .get('/hello', ({ query }) => `Hello ${query.firstName} ${query.lastName}`, {
    query: t.Object({
      firstName: t.String(),
      lastName: t.String(),
    }),
  })
  .post(
    '/users',
    async ({ body }) => {
      // Your logic here
      return { success: true, data: body };
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
      }),
    },
  );

// Development server (runs locally with `bun run api/index.ts`)
if (process.env.NODE_ENV !== 'production') {
  app.listen({ port: 3000 });
  console.log('Server is running on http://localhost:3000');
}

export default app.handle;
