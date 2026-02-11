# Repository Guidelines

## Project Structure & Module Organization
- `src/pages/` contains Astro routes, including dynamic routes like `posts/[...slug].astro` and `tags/[tag].astro`.
- `src/components/` holds UI and behavior modules; Dock code is split into `dock/data`, `dock/logic`, and `dock/ui`.
- `src/blog/` stores Markdown posts, registered through `src/content.config.ts`.
- `src/layouts/`, `src/styles/`, `src/utils/`, and `src/scripts/` contain shared layout, styling, helpers, and runtime scripts.
- `public/` serves static files directly; `assets/` keeps source images for Capacitor icons/splash generation.
- `android/` is the native shell project; `dist/` and `.astro/` are generated outputs.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run dev`: start the Astro dev server (`http://localhost:4321`).
- `npm run build`: create a production build in `dist/`.
- `npm run preview`: preview the production build locally.
- `npm run astro -- check`: run Astro/TypeScript and content checks.
- `npx cap sync android`: sync web assets to the Android project after web changes.
- `cd android && .\gradlew.bat test`: run Android unit tests.

## Coding Style & Naming Conventions
- Use TypeScript with ESM and keep code consistent with the current style: 2-space indentation, semicolons, and single quotes in script blocks.
- Prefer small, focused modules and explicit named exports.
- Use `PascalCase` for components (for example, `DockItem.astro`) and `camelCase` for utility/data modules (for example, `dockUtils.ts`).
- Keep route filenames lowercase and use Astro dynamic segment syntax (`[tag].astro`, `[...slug].astro`).
- Keep global overrides in `src/styles/global.css`; keep Tailwind utility classes close to markup.

## Testing Guidelines
- There is no dedicated JS test runner configured yet; treat `npm run astro -- check` and `npm run build` as required pre-PR validation.
- For UI work, manually verify `/`, `/blog`, `/about`, `/bookmarks`, and at least one post page.
- Android tests live in `android/app/src/test` and `android/app/src/androidTest`.

## Commit & Pull Request Guidelines
- Follow the Conventional Commit pattern used in recent history: `feat(scope): ...`, `fix(scope): ...`, `style(scope): ...`, `chore(scope): ...`.
- Keep commits focused; avoid generic messages like `debug`.
- PRs should include a clear summary, impacted routes/components, linked issue (if applicable), and screenshots/GIFs for UI changes.
- Call out content schema updates (for example, changes in `src/content.config.ts` or frontmatter fields) in the PR description.
