import { ServerResponse } from "http";
import Request from "./request";

export default class Response extends ServerResponse {
  constructor(req: Request) {
    super(req);
  }

  public send(chunk: any) {
    this.end(chunk);
  }
}
