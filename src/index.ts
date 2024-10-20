import { apiHandler } from "@/handlers/api.ts";
import { fileHandler } from "@/handlers/file.ts";
import { pageHandler } from "@/handlers/page/index.ts";
import { hmrHandler } from "@/hmr/index.ts";

export interface RouterConfig {
  basePath?: string;
}

export const createRequestHandler =
  (_config?: RouterConfig) =>
  async (_req: Request): Promise<Response> => {
    const basePath = _config?.basePath ?? Deno.cwd();

    const url = new URL(_req.url);

    const baseSlug = url.pathname.split("/")[1];

    if (Deno.env.get("DEBUG") === "true" && baseSlug === "_hmr") {
      return hmrHandler(_req);
    }

    switch (baseSlug) {
      case "api": {
        const response = await apiHandler(_req, basePath);
        return response;
      }
      case "uploads": {
        const response = await fileHandler(url, basePath);
        return response;
      }
      case "static": {
        const response = await fileHandler(url, basePath);
        return response;
      }
      default: {
        const extension = url.pathname.split(".").pop();

        if (extension === "tsx" || extension === "jsx") {
          return await pageHandler(_req, basePath);
        }

        let path = url.pathname.startsWith("/pages")
          ? url.pathname
          : `/pages${url.pathname}`;
        if (!extension || extension.startsWith("/")) {
          path = `${path}/index.html`;
        }

        const response = await fileHandler(
          new URL(`${url.protocol}//${url.host}${path}`),
          basePath
        );
        return response;
      }
    }
  };
