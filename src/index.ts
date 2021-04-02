import Server from "./server";

async function main() {
  const server = new Server();
  const signalHandler = async () => {
    try {
      await server.stop();
      process.exit(0);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  };
  process.on("SIGINT", signalHandler);
  process.on("SIGTERM", signalHandler);
  server.router.get("/ping", async (req, res) => {
    res.end("Hello world");
  });
  server.router.use({
    path: "/",
    method: "GET",
    handler: async (req, res) => {
      res.end("Use method");
    },
  });
  await server.start();
}

main();
