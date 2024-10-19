export const apiHandler = async (
  _req: Request,
  _basePath: string
): Promise<Response> => {
  const method = _req.method;
  const url = new URL(_req.url);

  let path = url.pathname;
  if (!path.endsWith("/")) {
    path += "/";
  }

  const apiDir = `${_basePath}${path}`;

  try {
    const module = await import(
      new URL(`file://${apiDir}${method.toLowerCase()}.ts`).href
    );
    return module.route(_req);
  } catch (error) {
    console.error(
      `Error loading api: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    return new Response("Not found", { status: 404 });
  }
};
