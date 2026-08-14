# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## What this project is

The DSPLAY **Instagram Basic** template — a [React](https://reactjs.org/) app built with [Vite](https://vitejs.dev/), rotating through a user's Instagram-style posts (photo/video + caption) full-screen. Requires Node.js 22.22.2+, 24.15.0+, or 26+ (see `.nvmrc`). See README.md for the template's variables.

## Directory structure

```
index.html                 <-- Vite entry point
vite.config.js             <-- includes @dsplay/template-manifest's Vite plugin (see below)
public/
  dsplay-data.js            <-- mock DSPLAY data for local development
  test-assets/              <-- dev-only assets, excluded from the release build
src/
  index.jsx                 <-- React entry point
  setup-tests.js             <-- Vitest setup (referenced by vite.config.js)
  style.css                  <-- single global stylesheet (see "File and folder naming" below for why)
  components/
    app/                      <-- reads media/config, computes rotation timing, top-level layout
    posts/                    <-- cycles through the selected posts on a timer
    post/                     <-- single post: media + caption (hashtag/link/mention highlighting)
    media-slider/             <-- crossfades between a post's photos when it has more than one
    user-profile/              <-- avatar + name/handle, shown twice (portrait/landscape CSS variants)
    info/                     <-- QR code + timestamp overlay
build.sh                    <-- zips the Vite build output into template.zip
```

## File and folder naming

- **kebab-case everywhere** in `src/` (and anywhere else in this repo we author ourselves) — folders, JS/JSX files, test files. Doesn't apply to files whose name is a fixed convention from tooling (`package.json`, `vite.config.js`, etc.) or to vendored/third-party assets we don't control the naming of.
- **Author styles as `.sass` (indented syntax), never `.css`** — this applies to our own hand-authored stylesheets specifically; it does not apply to vendored or tool-generated CSS we don't hand-edit (a self-hosted Google Fonts `@font-face` file, a Flaticon/IcoMoon icon-font export, a vendored library like Bootstrap) — those stay `.css` since they'd be regenerated/replaced wholesale, not edited by hand. `.sass`'s indented syntax has no braces or semicolons — converting a `.css` file means rewriting it to the indented syntax, not just renaming it.
- **Every component gets its own folder with an `index.jsx`.** For a simple component, `index.jsx` *is* the component.
- **Always import a component by its folder, never by reaching into `index`** — `import Post from '../post'`, never `.../post/index`.
- Enforced automatically by ESLint's `unicorn/filename-case` rule for the naming half of this; the folder+`index.jsx`+import-by-folder structure is not machine-checked, just convention.
- **Judgment call:** styling is NOT split one-file-per-component here, unlike other templates. `.media`/`.photo-overlay`/`.playWrapper` are genuinely shared between two different components (`post`'s inline `PostMedia` and `media-slider`), and several other rules cross component boundaries the same way. Splitting this mechanically risked silently breaking the cascade with no visual regression test to catch it, so `src/style.css` stays a single global stylesheet. Revisit only with an actual visual check in hand.

## Runtime model

- Every `dsplay_template`/`dsplay_config`/`dsplay_media` read goes through `@dsplay/react-template-utils`'s hooks (`useTemplateVal`/`useTemplateBoolVal`/`useConfig`/`useMedia`), called inside a function component body — never `@dsplay/template-utils`'s vanilla `tval`/`tbval`/`media`/`config` directly, and never at module scope. This used to read the vanilla exports at module load time (a deliberate "don't fix what isn't broken" call made during the 2026 Vite/React 19 migration); later reversed at the maintainer's request. `@dsplay/template-utils` is no longer a direct dependency (still pulled in transitively via `@dsplay/react-template-utils`).
- `Posts` and the internal slideshow logic of `MediaSlider` are still class components (`App`, `UserProfile`, `Info`, `Post`, and `MediaSlider`'s own outer wrapper are function components) — `Posts` never touched `@dsplay/template-utils` so it was left untouched, and `MediaSlider`'s stateful rotation timer is kept as an inner class (`MediaSliderBase`) wrapped by a thin function component that calls the hooks and passes the values down as props. This avoids rewriting a working rotation timer with no test coverage, while still getting template-var reads onto hooks.
- `public/dsplay-data.js` defines `dsplay_media`/`dsplay_config`/`dsplay_template` mock globals used only in **development** (renamed from the legacy unprefixed `media`/`config`/`template` names during this migration — `@dsplay/template-utils` supports both, but every other template uses the prefixed names, so this one now matches). `build.sh` blanks its content in the production build — the DSPLAY Android app injects the real `window.DSPLAY.getData()` before any script runs.
- `media.result.data.{user,posts}` is the actual Instagram data (fetched server-side, injected as `dsplay_media`); `App` slices `posts` down to `postCount` (or a duration-derived default) and hands them to `Posts`, which advances through them on a `pageDuration` timer.

## Internationalization

No `react-i18next` here — audited and found **zero static, developer-authored UI text**: every visible string (name, handle, caption, hashtags, timestamp) comes from the `dsplay_media`/`dsplay_template` data itself, not from this template's own code. The one localization surface that exists is `moment`'s date formatting in `src/components/info/index.jsx`, driven by `dsplay_config.locale` — its locale imports now cover the same minimum set as every other template (`en, pt, es, it, de, nl`, via `pt-br`/`pt`/`es`/`de`/`it`/`nl` + built-in `en`), where before `it`/`nl` were missing and would have silently fallen back to English.

## Template variable manifest

`vite.config.js` registers `@dsplay/template-manifest`'s Vite plugin, which on every build statically scans `src/` for `tval`/`tbval`-style reads and captures `public/dsplay-data.js` as example data, writing `template-variables.json` + `template-example-data.json` into the build output — and therefore into `template.zip` (`npm run zip` runs `build.sh`, which zips the whole build output). The DSPLAY CMS reads these two files to auto-detect a template's variables and seed default preview values, instead of requiring manual registration. See [@dsplay/template-manifest](https://www.npmjs.com/package/@dsplay/template-manifest) for exactly what it detects.

## Package identity

`package.json`'s `"name"` must identify this template, not the boilerplate it was cloned from — see `template-boilerplate-react`'s AGENTS.md for the full convention. This template's is `dsplay-template-instagram-basic` (already correct, no fix needed here).

## README structure

Every DSPLAY template's `README.md` follows the same skeleton (see `template-boilerplate-react`'s AGENTS.md for the full reference copy):

1. Logo badge + `# DSPLAY - <Name>` + a one/two-sentence description.
2. *(optional, only if the template has more than one visual arrangement)* **Features**.
3. *(optional, only if appearance changes meaningfully by screen format)* **Supported screen formats**.
4. **Template variables** — a `Key | Type | Default | Description` table, ending with the "register as Template Vars in the DSPLAY CMS" reminder.
5. **Local development**, 6. *(optional)* **For developers**, 7. **Test assets** / **Packing (release build)** / **Maintaining dependencies** (-> AGENTS.md) / **More**.

Skip a numbered section entirely rather than including it empty.

## Commands

- `npm start` — dev server (Vite).
- `npm run build` — production build (runs the linter first via the `prebuild` script).
- `npm test` / `npm run test:watch` — Vitest.
- `npm run linter` / `npm run linter:fix` — ESLint on `src`.
- `npm run zip` — builds, then runs `build.sh` to produce `template.zip` ready for the [DSPLAY Web Manager](https://manager.dsplay.tv/template/create). `build/` and `template.zip` are gitignored.

## Dependency management

Regular npm dependencies, not vendored files — `npm outdated` / `npm update` for in-range bumps. For an out-of-range (typically major) bump, apply it deliberately and verify `npm start`, `npm run build`, and `npm test` still work before committing.

`qrcode.react` was bumped 0.8.0 -> 4.2.0 (React 19 peer support) — that major rewrote its API from a default export to named `QRCodeSVG`/`QRCodeCanvas` exports; `src/components/info/index.jsx` now imports `{ QRCodeSVG as QRCode }`, same `size`/`value` props as before.

### Known pending bump: ESLint 9 -> 10

`eslint`/`@eslint/js` are pinned to `^9.39.5` (latest is `10.x`). Bumping them currently fails on peer dependency conflicts: `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, and `eslint-plugin-react` haven't declared ESLint 10 support yet as of 2026-08-12 — they're still the actively-maintained canonical packages, not abandoned or superseded, just lagging behind the major. `eslint-plugin-react-hooks` already supports it. `eslint-plugin-unicorn` is pinned to `65.0.1` for the same reason (`66.0.0+` requires ESLint `>=10.4`). Don't force this with `--legacy-peer-deps` — re-check peer ranges periodically and bump all of them together once the laggards catch up.

## Commit messages

Every commit title must start with an emoji, followed by a short, imperative summary — e.g. `⬆️ upgrading deps`.

- The human maintainer uses [gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli) for manual commits, so gitmoji conventions (`✨` feature, `🐛` fix, `⬆️` upgrade deps, `♻️` refactor, `🔥` remove code, `📝` docs) are a good default.
- Agents are not required to stick to the official gitmoji list — pick whichever emoji best represents the actual change in that commit, as long as it's placed at the start of the title.
