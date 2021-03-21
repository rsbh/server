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
  await server.start();
}

main();
