import { createRequestHandler } from "@/index.ts";

const main = async () => {
  const ac = new AbortController();

  const handler = createRequestHandler();

  Deno.serve({
    port: 3000,
    hostname: "localhost",
    handler: handler,
    signal: ac.signal,
    onError(err) {
      console.error(err);

      return new Response("Internal Server Error", { status: 500 });
    },
    onListen({ port, hostname }) {
      console.log(`Server started at http://${hostname}:${port}`);
      console.log(`HMR started at ws://${hostname}:${port}/_hmr`);
    },
  });

  const listener = () => {
    console.log("Interrupt received, shutting down...");
    ac.abort();
  };

  // Add SIGINT listener
  Deno.addSignalListener("SIGINT", listener);
};

if (import.meta.main) {
  main();
}
