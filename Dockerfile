# Cloudflare talks HTTP to Containers. This tiny Node adapter receives the
# request, runs the Zero executable, and returns the executable's stdout.
# The Zero release artifact is linux-musl-x64. Cloudflare's deploy flow builds
# linux/amd64; use `docker build --platform linux/amd64 ...` locally too.
FROM node:22-alpine

WORKDIR /app
COPY artifacts/hello-linux-musl-x64 /hello
COPY server.mjs /app/server.mjs
RUN chmod +x /hello

ENV PORT=8080
EXPOSE 8080
CMD ["node", "/app/server.mjs"]
