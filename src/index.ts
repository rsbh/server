import Server, { Request, Response } from "./server";
import Joi from "joi";

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
  server.router.use({
    path: "/",
    method: "GET",
    validate: {
      query: Joi.object({
        abc: Joi.string(),
      }),
    },
    handler: async (req: Request, res: Response) => {
      res.send("Use method");
    },
  });
  await server.start();
}

main();
