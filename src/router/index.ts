import { IncomingMessage, ServerResponse } from "node:http";
import FindMyWay, { HTTPVersion } from "find-my-way";
import Joi, { ValidationError } from "joi";
import Request from "./request";
type httpHandler = (req: IncomingMessage, res: ServerResponse) => Promise<void>;
type httpMethods = "GET" | "POST" | "PUT" | "DELETE";

interface validateOptions {
  query?: Joi.ObjectSchema;
}

interface validationErrors {
  query?: ValidationError;
}

interface Route {
  method: httpMethods;
  path: string;
  validate?: validateOptions;
  handler: httpHandler;
}

export default class Router {
  router: FindMyWay.Instance<HTTPVersion.V1>;
  constructor() {
    this.router = FindMyWay({ defaultRoute: this.notFound });
    this.requestListener = this.requestListener.bind(this);
    this.notFound = this.notFound.bind(this);
    this.badRequest = this.badRequest.bind(this);
  }

  public async requestListener(req: IncomingMessage, res: ServerResponse) {
    this.router.lookup(req, res);
  }

  private async notFound(req: IncomingMessage, res: ServerResponse) {
    const { method, url } = req;
    const message = `Route ${method}:${url} not found`;
    res.setHeader("Content-Type", "application/json");
    res.writeHead(404);
    res.end(
      JSON.stringify({
        message,
      })
    );
  }

  private async badRequest(
    req: IncomingMessage,
    res: ServerResponse,
    errors: validationErrors
  ) {
    const message = `Bad Request`;
    res.setHeader("Content-Type", "application/json");
    res.writeHead(400);
    res.end(
      JSON.stringify({
        message,
        errors,
      })
    );
  }

  public async get(path: string, handler: httpHandler) {
    this.router.on("GET", path, handler);
  }

  private validateReq(
    validateRules: validateOptions,
    req: Request
  ): validationErrors {
    const errors: validationErrors = {};
    if (validateRules?.query) {
      errors["query"] = validateRules?.query.validate(req.query).error;
    }
    return errors;
  }

  private getHandlerWrapper(route: Route): httpHandler {
    const { validate = {}, handler } = route;
    return (message: IncomingMessage, res: ServerResponse) => {
      const req = new Request(message);
      const errors = this.validateReq(validate, req);
      if (errors) return this.badRequest(req, res, errors);
      return handler(req, res);
    };
  }

  public async use(route: Route) {
    const { path, method } = route;
    const handler = this.getHandlerWrapper(route);
    this.router.on(method, path, handler);
  }
}
