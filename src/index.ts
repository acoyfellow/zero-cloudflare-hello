import { Container, getContainer } from "@cloudflare/containers";

export class ZeroHelloContainer extends Container {
  defaultPort = 8080;
  sleepAfter = "2m";
}

interface Env {
  ASSETS: Fetcher;
  ZERO_HELLO: DurableObjectNamespace<ZeroHelloContainer>;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/about") {
      const assetUrl = new URL("/", url);
      return env.ASSETS.fetch(new Request(assetUrl, request));
    }

    const container = getContainer(env.ZERO_HELLO, "singleton");
    const response = await container.fetch(
      new Request(`http://container${url.pathname}${url.search}`, request),
    );

    return new Response(response.body, response);
  },
} satisfies ExportedHandler<Env>;
