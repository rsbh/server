import http from "http";
import Logger from "./logger";
import Router from "./router";

interface ServerOptions {
  port?: number;
}

export default class Server {
  port: number;
  app: http.Server;
  logger: Logger;
  router: Router;

  constructor(options?: ServerOptions) {
    this.port = options?.port || Number(process.env.PORT) || 3000;
    this.logger = new Logger();
    this.router = new Router();
    this.app = http.createServer(this.router.requestListener);
  }

  public async start() {
    return new Promise((resolve, reject) => {
      this.app.listen(this.port, () => {
        const address = this.app.address();
        if (!address) {
          this.logger.error(`Unable to start server`);
          reject(`Unable to start server`);
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

  public async stop() {
    return new Promise(() => {
      this.app.close(() => {
        this.logger.log(`Server Successfully Stopped`);
      });
    });
  }
}
