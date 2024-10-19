export const hmrHandler = async (_req: Request): Promise<Response> => {
  if (_req.headers.get("upgrade") != "websocket") {
    return new Response(null, { status: 501 });
  }

  const { socket, response } = Deno.upgradeWebSocket(_req);

  socket.addEventListener("close", () => {
    hmrClient.disconnect();
  });

  socket.addEventListener("error", (error) => {
    console.error("WebSocket error:", error);
    hmrClient.disconnect();
  });

  hmrClient.connect(socket);

  return response;
};

class HMRClient {
  socket?: WebSocket;

  constructor() {}

  connect(socket: WebSocket) {
    this.socket = socket;
  }

  disconnect() {
    this.socket?.close();
    this.socket = undefined;
  }

  reload() {
    this.socket?.send("reload");
  }
}

export const hmrClient = new HMRClient();
