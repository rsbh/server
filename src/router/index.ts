import { IncomingMessage, ServerResponse } from "node:http";

type httpHandler = (req: IncomingMessage, res: ServerResponse) => Promise<void>;

interface Route {
  method: string;
  path: string;
  handler: httpHandler;
}

const getRouteKey = (method: string, path: string) => {
  return method.toLowerCase() + "__" + path.toLowerCase();
};

export default class Router {
  routes: Record<string, Route>;
  constructor() {
    this.routes = {};
    this.requestListener = this.requestListener.bind(this);
    this.notFound = this.notFound.bind(this);
  }

  public async requestListener(req: IncomingMessage, res: ServerResponse) {
    const { method, url } = req;
    if (!method || !url) return this.notFound(req, res);
    const key = getRouteKey(method, url);
    const route = this.routes[key];
    if (!route) return this.notFound(req, res);
    return route.handler(req, res);
  }

  private async notFound(req: IncomingMessage, res: ServerResponse) {
    const { method, url } = req;
    const message = `Route ${method}:${url} not found`;
    res.writeHead(404);
    res.end(message);
  }

  public async use(method: string = "GET", path: string, handler: httpHandler) {
    const key = getRouteKey(method, path);
    this.routes[key] = {
      method,
      path,
      handler,
    };
  }
}
