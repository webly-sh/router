import { apiHandler } from "./api.ts";
import { fileHandler } from "./file.ts";
import { pageHandler } from "./page.ts";

export const handleRequest = async (_req: Request): Promise<Response> => {
  const url = new URL(_req.url);

  const basePath = url.pathname.split("/")[1];

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
