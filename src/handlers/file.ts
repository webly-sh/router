import { contentType } from "@std/media-types";

export const fileHandler = async (
  url: URL,
  _basePath: string
): Promise<Response> => {
  const path = url.pathname;

  try {
    const fileDir = `${_basePath}${path}`;
    const extension = path.split(".").pop() ?? ".html";

    const file = await Deno.readFile(fileDir);
    const response = new Response(file);

    // Cache the file
    const cacheControl = "public, max-age=3600"; // Cache for 1 hour
    response.headers.set("Cache-Control", cacheControl);
    response.headers.set(
      "Content-Type",
      contentType(extension) ?? "text/plain"
    );

    return response;
  } catch (error) {
    console.error(
      `Error loading file: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    return new Response("Not found", { status: 404 });
  }
};
