import { IncomingMessage, ServerResponse } from "node:http";
import FindMyWay, { HTTPVersion } from "find-my-way";

type httpHandler = (req: IncomingMessage, res: ServerResponse) => Promise<void>;
type httpMethods = "GET" | "POST" | "PUT" | "DELETE";

interface Route {
  method: httpMethods;
  path: string;
  handler: httpHandler;
}

export default class Router {
  router: FindMyWay.Instance<HTTPVersion.V1>;
  constructor() {
    this.router = FindMyWay({ defaultRoute: this.notFound });
    this.requestListener = this.requestListener.bind(this);
    this.notFound = this.notFound.bind(this);
  }

  public async requestListener(req: IncomingMessage, res: ServerResponse) {
    this.router.lookup(req, res);
  }

  private async notFound(req: IncomingMessage, res: ServerResponse) {
    const { method, url } = req;
    const message = `Route ${method}:${url} not found`;
    res.writeHead(404);
    res.end(message);
  }

  public async get(path: string, handler: httpHandler) {
    this.router.on("GET", path, handler);
  }

  public async use(route: Route) {
    const { path, method, handler } = route;
    this.router.on(method, path, handler);
  }
}
