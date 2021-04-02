import { IncomingMessage } from "http";
import querystring, { ParsedUrlQuery } from "querystring";
import parseurl from "parseurl";

export default class Request extends IncomingMessage {
  pathname: string;
  search: string;
  query: ParsedUrlQuery;

  constructor(req: IncomingMessage) {
    super(req.socket);
    const url = parseurl(req);
    this.pathname = url?.pathname || "";
    this.search = url?.search || "";
    this.query = querystring.parse(url?.search || "");
  }
}
