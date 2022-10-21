import { Handlers } from "$fresh/server.ts";
import * as mainLogic from "../../src/manage.ts";
import providers from "../../src/providers/index.ts";

export const handler: Handlers = {
  async GET(req) {
    const url = new URL(req.url);
    const path = url.pathname.split("/");
    const username = path[path.length - 1];
    const proxyTarget = await mainLogic.getProxyTarget(username);
    if (proxyTarget) {
      const provider = await providers.getProvider(proxyTarget.provider);
      return new Response(await provider.getAddr({
        target: proxyTarget.target,
        username,
        host: url.host,
        proto: url.protocol,
      }), {
        headers: {
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "*",
        },
      });

    } else {
      return new Response(JSON.stringify("Not found"), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "*",
        },
      });
    }
  },
};