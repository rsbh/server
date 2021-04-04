import { ServerResponse } from "http";
import Request from "./request";

export default class Response extends ServerResponse {
  constructor(req: Request) {
    super(req);
  }

  public send(chunk: any) {
    this.end(chunk);
  }

  public json(chunk: any) {
    this.setHeader("Content-Type", "application/json");
    this.end(JSON.stringify(chunk));
  }

  public status(code: number) {
    this.statusCode = code;
    return this;
  }
}
