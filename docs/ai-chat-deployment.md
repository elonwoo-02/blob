# AI Chat Deployment Notes

## Required environment variables

Set all variables for both `Preview` and `Production` in Cloudflare Pages:

- `OPENAI_API_KEY` (Secret)
- `OPENAI_MODEL` (for example: `gpt-4o-mini`)
- `OPENAI_BASE_URL` (optional if using default OpenAI endpoint)

If `OPENAI_API_KEY` is missing, `/api/ai/chat` returns:

- `500 OPENAI_API_KEY is missing on server.`

## Local runtime options

1. `npm run dev` (`astro dev`)
- Good for fast UI iteration.
- API route is served from `src/pages/api/ai/chat.ts`.

2. `wrangler pages dev dist` (recommended for API parity)
- Closer to Cloudflare Pages Functions behavior.
- API route is served from `functions/api/ai/chat.ts`.

## Request behavior

- Client now prefers `POST /api/ai/chat` for all environments.
- Client falls back to `GET /api/ai/chat?q=...&h=...` when POST is unsupported.
- GET fallback also sends:
  - `x-ai-question`
  - `x-ai-history`

When no usable question or message exists, API returns:

- `400 Missing question/messages in request.`
