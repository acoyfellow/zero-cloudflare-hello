import { createServer } from "node:http";
import { spawn } from "node:child_process";

const port = Number(process.env.PORT || 8080);

function runZero(response) {
  const child = spawn("/hello", [], { stdio: ["ignore", "pipe", "pipe"] });
  const stdout = [];
  const stderr = [];

  child.stdout.on("data", (chunk) => stdout.push(chunk));
  child.stderr.on("data", (chunk) => stderr.push(chunk));
  child.on("error", (error) => {
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end(`failed to start Zero: ${error.message}\n`);
  });
  child.on("close", (code) => {
    if (code === 0) {
      response.writeHead(200, {
        "content-type": "text/plain; charset=utf-8",
        "x-zero-artifact": "linux-musl-x64 ELF",
      });
      response.end(Buffer.concat(stdout));
      return;
    }

    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end(`Zero exited ${code}\n${Buffer.concat(stderr).toString("utf8")}`);
  });
}

createServer((request, response) => {
  if (request.url === "/health") {
    response.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
    response.end("ok\n");
    return;
  }

  runZero(response);
}).listen(port, "0.0.0.0", () => {
  console.log(`Zero adapter listening on :${port}`);
});
