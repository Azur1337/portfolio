# portfolio

Portfolio of **Azur** (Miguel Cadeddu), fullstack engineer & UI/UX designer.
Live at [0x187.dev](https://0x187.dev).

The page reads as a terminal session: warm paper ground, Geist Mono, a 2D ASCII
glyph field on canvas, scroll-driven text reveals and dark editor panels.
Built with SvelteKit, Svelte 5 (runes), Tailwind CSS v4 and Bun.

## Development

```sh
bun install
bun run dev      # http://localhost:5173
bun run build    # production build (adapter-node)
bun run check    # type check
bun run lint     # prettier + eslint
bun run test     # unit tests
```

## Deploy

The site builds to a plain Node server (`@sveltejs/adapter-node`) and runs
containerized:

```sh
docker compose up --build   # serves on :3000, healthcheck at /healthz
```
