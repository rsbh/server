import { IncomingMessage } from "http";
import querystring, { ParsedUrlQuery } from "querystring";
import parseurl from "parseurl";
import { Socket } from "net";

export default class Request extends IncomingMessage {
  pathname: string;
  search: string;
  query: ParsedUrlQuery;

  constructor(socket: Socket) {
    super(socket);
    const url = parseurl(this);
    this.pathname = url?.pathname || "";
    this.search = url?.search || "";
    const searchWithoutPrefix = url?.search?.replace(/^\?/, "") || "";
    const query = querystring.parse(searchWithoutPrefix);
    this.query = Object.assign({}, query);
  }
}
