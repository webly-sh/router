import { apiHandler } from "@/handlers/api.ts";
import { fileHandler } from "@/handlers/file.ts";
import { pageHandler } from "@/handlers/page/index.ts";
import { hmrHandler } from "@/hmr/index.ts";

export const handleRequest = async (_req: Request): Promise<Response> => {
  const url = new URL(_req.url);

  const basePath = url.pathname.split("/")[1];

  if (Deno.env.get("DEBUG") === "true" && basePath === "_hmr") {
    return hmrHandler(_req);
  }

  switch (basePath) {
    case "api": {
      const response = await apiHandler(_req);
      return response;
    }
    case "uploads": {
      const response = await fileHandler(url);
      return response;
    }
    case "static": {
      const response = await fileHandler(url);
      return response;
    }
    default: {
      const response = await pageHandler(_req);
      return response;
    }
  }
};
