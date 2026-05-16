# Zero on Cloudflare

[![check](https://github.com/acoyfellow/zero-cloudflare-hello/actions/workflows/check.yml/badge.svg)](https://github.com/acoyfellow/zero-cloudflare-hello/actions/workflows/check.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](./LICENSE)

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/acoyfellow/zero-cloudflare-hello)

**A Zero native executable, running in a Cloudflare Container, exposed by a tiny Worker.**

- Live: https://zero.coey.dev
- Source: https://github.com/acoyfellow/zero-cloudflare-hello
- Deploy: https://deploy.workers.cloudflare.com/?url=https://github.com/acoyfellow/zero-cloudflare-hello

```sh
curl https://zero.coey.dev
# hello from Zero on Cloudflare infra
```

The program behind that response:

```zero
pub fun main(world: World) -> Void raises {
    check world.out.write("hello from Zero on Cloudflare infra\n")
}
```

## How it works

```txt
request → Worker → Container → Zero ELF → stdout response
```

Zero emits a Linux executable. Cloudflare Containers run Linux executables. The Worker forwards HTTP to a small container adapter, which runs the Zero binary and returns stdout.

## Repo map

| Path | Purpose |
|---|---|
| [`hello.0`](hello.0) | Zero source. |
| [`artifacts/hello-linux-musl-x64`](artifacts/hello-linux-musl-x64) | 261-byte deployable ELF. |
| [`src/index.ts`](src/index.ts) | Worker → Container routing. |
| [`server.mjs`](server.mjs) | Container HTTP adapter. |
| [`Dockerfile`](Dockerfile) | Container image. |
| [`wrangler.jsonc`](wrangler.jsonc) | Cloudflare deployment config. |

## Deploy

Click the button above. It forks this repo and deploys the Worker + Container. First-time Containers can take a few minutes to become ready.

The tiny ELF is committed so one-click deploy does not need to install the experimental Zero compiler.

## Rebuild the Zero binary

```sh
curl -fsSL https://zerolang.ai/install.sh | bash
export PATH="$HOME/.zero/bin:$PATH"
npm run build:zero
```

## Scope

This demonstrates **Zero native output on Cloudflare Containers**. Zero does not yet expose a production native HTTP server runtime, so the container includes a visible HTTP adapter.
