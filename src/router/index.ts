import { IncomingMessage, ServerResponse } from "http";
import FindMyWay from "find-my-way";
import Joi, { ValidationError } from "joi";
import Request from "./request";
import Response from "./response";

type httpHandler = (req: Request, res: Response) => Promise<void>;
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
  router: FindMyWay.Instance<FindMyWay.HTTPVersion.V1>;
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
    req: Request,
    res: Response,
    errors: validationErrors
  ) {
    const message = `Bad Request`;
    res.raw.setHeader("Content-Type", "application/json");
    res.raw.writeHead(400);
    res.raw.end(
      JSON.stringify({
        message,
        errors,
      })
    );
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

  private getHandlerWrapper(route: Route) {
    const { validate = {}, handler } = route;
    return (message: IncomingMessage, serverResponse: ServerResponse) => {
      const req = new Request(message);
      const res = new Response(serverResponse);
      const errors = this.validateReq(validate, req);
      if (Object.keys(errors).length > 0)
        return this.badRequest(req, res, errors);
      return handler(req, res);
    };
  }

  public async use(route: Route) {
    const { path, method } = route;
    const handler = this.getHandlerWrapper(route);
    this.router.on(method, path, handler);
  }
}
