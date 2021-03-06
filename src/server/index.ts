import http from "http";
import Logger from "../logger";
import Router from "../router";
import Request from "../router/request";
import Response from "../router/response";

interface ServerOptions {
  port?: number;
}

class Server {
  port: number;

  app: http.Server;

  logger: Logger;

  router: Router;

  constructor(options?: ServerOptions) {
    this.port = options?.port || Number(process.env.PORT) || 3000;
    this.logger = new Logger();
    this.router = new Router();
    this.app = http.createServer(
      { IncomingMessage: Request, ServerResponse: Response },
      this.router.lookup
    );
  }

  public async start(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.app.listen(this.port, () => {
        const address = this.app.address();
        if (!address) {
          this.logger.error("Unable to start server");
          reject(new Error("Unable to start server"));
        } else {
          const addsString =
            typeof address === "string"
              ? address
              : `${address.address}:${address.port}`;
          this.logger.log(`Server started on ${addsString}`);
          resolve(addsString);
        }
      });
    });
  }

  public async stop(): Promise<void> {
    return new Promise(() => {
      this.logger.log(`Stopping Server`);
      this.app.close(() => {
        this.logger.log("Server Successfully Stopped");
      });
    });
  }
}

module.exports = Server;
export default Server;
export { Request, Response };
