export const apiHandler = async (_req: Request): Promise<Response> => {
  const method = _req.method;
  const url = new URL(_req.url);

  let path = url.pathname;
  if (!path.endsWith("/")) {
    path += "/";
  }

  const apiDir = `${Deno.cwd()}${path}`;

  try {
    const module = await import(`${apiDir}${method.toLowerCase()}.ts`);
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
