import { IncomingMessage, ServerResponse } from "node:http";

export default class Router {
  constructor() {
    this.requestListener = this.requestListener.bind(this);
    this.notFound = this.notFound.bind(this);
  }

  public async requestListener(req: IncomingMessage, res: ServerResponse) {
    return this.notFound(req, res);
  }

  private async notFound(req: IncomingMessage, res: ServerResponse) {
    const { method, url } = req;
    const message = `Route ${method}:${url} not found`;
    res.writeHead(404);
    res.end(message);
  }
}
