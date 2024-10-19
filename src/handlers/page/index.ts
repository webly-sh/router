import { renderLayout } from "@/handlers/page/layout.tsx";
import { renderToString } from "react-dom/server";
import type { JSX } from "react";
import { hmrScript } from "@/hmr/index.ts";

export const pageHandler = async (
  _req: Request,
  _basePath: string
): Promise<Response> => {
  const url = new URL(_req.url);

  let path = url.pathname;
  if (!path.endsWith("/")) {
    path += "/";
  }

  try {
    let pageDir = `${_basePath}/pages${path}`;

    // Compile Tailwind CSS
    const tailwindFilePath = `/static/global.css`;

    // Read page-specific CSS files
    const cssFileContents: string[] = [];

    for await (const dirEntry of Deno.readDir(pageDir)) {
      if (dirEntry.name.endsWith(".css")) {
        cssFileContents.push(
          await Deno.readTextFile(`${pageDir}/${dirEntry.name}`)
        );
      }
    }

    // Dynamically import the file
    if (!pageDir.endsWith("/")) {
      pageDir += "/";
    }

    let content = "";
    for (const css of cssFileContents) {
      content += `<style>${css}</style>`;
    }

    content += `<link href="${tailwindFilePath}" rel="stylesheet">`;

    if (Deno.env.get("DEBUG") === "true") {
      content += hmrScript;
    }

    // load page
    let module;
    try {
      module = await import(new URL(`file://${pageDir}page.tsx`).href);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        // If .tsx file is not found, try .jsx
        module = await import(new URL(`file://${pageDir}page.jsx`).href);
      } else {
        // If it's a different error, rethrow it
        throw error;
      }
    }

    const defaultExport = module.default;

    if (
      typeof defaultExport !== "function" &&
      typeof defaultExport !== "string"
    ) {
      throw new Error("Invalid export type");
    }

    if (typeof defaultExport === "string") {
      content += defaultExport;
    } else {
      const response: Response | JSX.Element = await defaultExport(_req);

      if (response instanceof Response) {
        return response;
      }

      // Load layouts
      const layouts: JSX.Element[] = [];
      let currentDir = pageDir;
      const pagesDir = `${_basePath}/pages`;

      const currentDirSegments = currentDir.split("/");
      const pagesDirSegments = pagesDir.split("/");
      const includedLayouts: string[] = [];

      while (currentDirSegments.length >= pagesDirSegments.length) {
        try {
          const layoutPath = currentDir.endsWith("/")
            ? `${currentDir}layout.tsx`
            : `${currentDir}/layout.tsx`;

          if (includedLayouts.includes(layoutPath)) {
            throw new Error("Layout already included");
          }

          await Deno.stat(layoutPath);
          const layoutModule = await import(
            new URL(`file://${layoutPath}`).href
          );
          layouts.unshift(layoutModule.default); // Add to the beginning of the array
          includedLayouts.push(layoutPath);
        } catch (_) {
          // No layout in this directory, continue
        }
        // Move up one directory
        currentDirSegments.pop();
        currentDir = currentDirSegments.join("/");
      }

      content += renderToString(
        layouts.length > 0 ? renderLayout(layouts, response) : response
      );
    }

    return new Response(content, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.error(
      `Error loading page: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    return new Response("Not found", { status: 404 });
  }
};
