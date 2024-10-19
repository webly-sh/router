export const hmrScript = `
<script>
  function triggerHMRReload() {
    const socket = new WebSocket("ws://" + window.location.host + "/_hmr");

    socket.onopen = () => {
      console.log("HMR WebSocket connection established");
    };

    socket.onmessage = (event) => {
      console.log("HMR message received:", event.data);
      const data = event.data;
      if (data === "reload") {
        console.log("HMR reload triggered");
        window.location.reload();
      } else {
        console.log("HMR message received:", data);
      }
    };

    socket.onerror = (error) => {
      console.error("HMR WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("HMR WebSocket connection closed");
      // Attempt to reconnect after a short delay
      setTimeout(triggerHMRReload, 1000);
    };

    console.log("HMR reload function ready");
  }

  // Call the function to set up HMR reload
  triggerHMRReload();
</script>
`;

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

export const hmrClient: HMRClient = new HMRClient();
