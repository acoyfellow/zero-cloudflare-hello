# Zero on Cloudflare

[![check](https://github.com/acoyfellow/zero-cloudflare-hello/actions/workflows/check.yml/badge.svg)](https://github.com/acoyfellow/zero-cloudflare-hello/actions/workflows/check.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](./LICENSE)

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/acoyfellow/zero-cloudflare-hello)

**A Zero native executable, running in a Cloudflare Container, exposed by a tiny Worker.**

- Live proof: https://zero.coey.dev
- One-page explainer: https://zero.coey.dev/about
- Source: https://github.com/acoyfellow/zero-cloudflare-hello
- Deploy your fork: https://deploy.workers.cloudflare.com/?url=https://github.com/acoyfellow/zero-cloudflare-hello
- Zero: https://github.com/vercel-labs/zero

Visit the live URL. The response is stdout from this Zero program:

```zero
pub fun main(world: World) -> Void raises {
    check world.out.write("hello from Zero on Cloudflare infra\n")
}
```

Expected body:

```txt
hello from Zero on Cloudflare infra
```

## The whole idea

```txt
browser / curl
      ↓
Cloudflare Worker             src/index.ts
      ↓
Cloudflare Container          Dockerfile + server.mjs
      ↓
261-byte Zero Linux ELF       artifacts/hello-linux-musl-x64
      ↓
stdout returned as HTTP text
```

Zero v0.1.1 can emit tiny static Linux executables directly. This repo ships one of those executables in a Cloudflare Container. The Worker routes HTTP to the container; the small Node adapter runs `/hello` and returns the Zero program's stdout.

## Read this repo in 7 minutes

| Path | What it proves |
|---|---|
| [`hello.0`](hello.0) | The entire Zero source program. |
| [`artifacts/hello-linux-musl-x64`](artifacts/hello-linux-musl-x64) | The committed 261-byte Linux ELF used by one-click deploys. |
| [`Dockerfile`](Dockerfile) | The container image: Node adapter + Zero executable. |
| [`server.mjs`](server.mjs) | HTTP-to-process adapter inside the container. |
| [`src/index.ts`](src/index.ts) | Worker → Container routing. |
| [`wrangler.jsonc`](wrangler.jsonc) | Container, Durable Object binding, static `/about`, and deploy config. |
| [`static/index.html`](static/index.html) | The tiny shareable `/about` page for `zero.coey.dev`. |
| [`scripts/build-zero.sh`](scripts/build-zero.sh) | Rebuild the ELF from `hello.0` with the Zero compiler. |

That is the repo. Everything else is package metadata or CI.

## Why a Container?

Cloudflare Workers execute JavaScript or WebAssembly. This demo is about Zero's **native Linux executable** output, so a Cloudflare Container is the honest Cloudflare target.

Zero's current docs expose early `wasm32-web` route reports and HTTP/network metadata helpers, but they do **not** claim a hosted Worker deployment path or a native request/response server runtime yet. The adapter is intentionally visible instead of hidden.

## Deploy your own

Click the deploy button at the top. It forks the repo into your GitHub account and deploys the Worker + Container configuration from [`wrangler.jsonc`](wrangler.jsonc). First-time Containers can take a few minutes to become ready after deployment.

The deployable artifact is committed on purpose:

- the Deploy to Cloudflare flow can build the container without installing an experimental language toolchain;
- the interesting binary is only **261 bytes**;
- [`hello.0`](hello.0) and [`scripts/build-zero.sh`](scripts/build-zero.sh) keep the source-to-artifact path inspectable.

## Run locally

Install dependencies and run Wrangler:

```sh
npm install
npm run dev
```

Or test only the container:

```sh
npm run container:build
npm run container:test
curl http://127.0.0.1:8080/
```

Container health endpoint:

```sh
curl http://127.0.0.1:8080/health
# ok
```

## Rebuild the Zero executable

Install Zero from its release installer, then regenerate the committed artifact:

```sh
curl -fsSL https://zerolang.ai/install.sh | bash
export PATH="$HOME/.zero/bin:$PATH"
npm run build:zero
```

The script runs the structured checker first and then builds:

```sh
zero check --json hello.0
zero build --emit exe --target linux-musl-x64 hello.0 --out artifacts/hello-linux-musl-x64
```

At the time this repo was created, the artifact was:

```txt
target: linux-musl-x64
kind:   static ELF executable
size:   261 bytes
sha1:   268e4ccd8af56e13e56c7f6ee86705e49ca3ddc7
```

## What the Zero code says

| Zero | Meaning |
|---|---|
| `main(world: World)` | The runtime hands the program an explicit capability object. |
| `world.out.write(...)` | Output is explicit, not a hidden process global. |
| `check` | Writing may fail; propagate that failure. |
| `raises` | `main` declares that it can fail. |

That is the language concept this demo is meant to make tangible.

## Non-goals

| Non-goal | Why |
|---|---|
| A production Zero web framework | Zero is new and its HTTP server runtime is not public today. |
| A pure Worker Zero deployment | This repo demonstrates native ELF output on Containers. |
| Hiding the adapter | The Worker/container seam is the point of the demo. |
| Installing Zero during one-click deploy | Committing 261 bytes keeps the public fork/deploy path boring. |

## Local verification used for this repo

```sh
docker build --platform linux/amd64 -t zero-cloudflare-hello:local .
docker run --rm --platform linux/amd64 -p 8080:8080 zero-cloudflare-hello:local
curl http://127.0.0.1:8080/
```

Expected response:

```txt
hello from Zero on Cloudflare infra
```
