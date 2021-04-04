import { IncomingMessage } from "http";
import querystring, { ParsedUrlQuery } from "querystring";
import parseurl from "parseurl";
import { Socket } from "net";

export default class Request extends IncomingMessage {
  constructor(socket: Socket) {
    super(socket);
  }

  public get query(): ParsedUrlQuery {
    const url = parseurl(this);
    const searchWithoutPrefix = url?.search?.replace(/^\?/, "") || "";
    const query = querystring.parse(searchWithoutPrefix);
    return Object.assign({}, query);
  }
}
