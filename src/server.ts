import http from "http";

interface ServerOptions {
  port?: number;
}

export default class Server {
  port: number;
  app: http.Server;

  constructor(options?: ServerOptions) {
    this.port = options?.port || 3000;
    this.app = http.createServer();
  }

  public async start() {
    return new Promise((resolve, reject) => {
      this.app.listen(this.port, () => {
        const address = this.app.address();
        if (!address) {
          console.log(`Unable to start server`);
          reject(`Unable to start server`);
        } else {
          const addsString =
            typeof address === "string"
              ? address
              : `${address.address}:${address.port}`;
          console.log(`Server started on ${addsString}`);
          resolve(addsString);
        }
      });
    });
  }
}
