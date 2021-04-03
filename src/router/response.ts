import { ServerResponse } from "http";

export default class Response {
  raw: ServerResponse;
  constructor(rawResp: ServerResponse) {
    this.raw = rawResp;
  }

  public send(chunk: any) {
    this.raw.end(chunk);
  }
}
