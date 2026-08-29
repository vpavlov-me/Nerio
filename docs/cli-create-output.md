# CLI project bootstrap and structured output

`nerio create` writes one new deterministic package-mode project from a maintained, clean-tested
framework profile:

```bash
pnpm dlx @nerio-ui/cli@1.0.0-beta.1 create my-next-app --framework next
pnpm dlx @nerio-ui/cli@1.0.0-beta.1 create my-vite-app --framework vite
```

The only supported profile is `current`. It pins the exact tested React, Next.js or Vite,
TypeScript, and Tailwind versions. Generated styles import Tailwind, the public token bridge, and
the residual UI stylesheet, then scan compiled `@nerio-ui/ui` output. The Next.js project keeps
static imports in the server-safe entrypoint and interactive imports in a client component; it does
not add `transpilePackages`.

The directory must be relative to the current directory, stay within it, use lowercase npm-safe
letters, numbers, and hyphens in every path segment, and not already exist. The CLI rejects existing
target entries, including dangling symlinks, and symlinked existing parents. It writes every file to
an adjacent temporary directory and renames that complete directory into place, so a handled write
failure cannot leave a partial project at the requested target. It does not install packages,
initialize Git, or run generated or third-party scripts.

`--json` emits one compact object on stdout:

```json
{
  "schemaVersion": "1.0.0",
  "command": "create",
  "status": "created",
  "directory": "my-next-app",
  "framework": "next",
  "mode": "package",
  "profile": "current",
  "files": ["..."],
  "nextSteps": ["cd my-next-app", "pnpm install", "pnpm dev"]
}
```

Exit code `0` means the complete directory was created. Exit code `1` means validation or writing
failed. Errors remain on stderr and the requested target remains absent when a handled failure
occurs.

Source mode is deliberately not another generator profile: use `nerio init` and `nerio add` inside
an existing framework project when editable source is required. React Router remains unsupported
until it has the same maintained clean-consumer evidence. Backend, authentication, database,
deployment, product workflow, and arbitrary-script generation are outside the command boundary.
