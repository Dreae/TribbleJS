import { IncomingMessage, ServerResponse } from "http";
import { Request } from "./Request";

export type RequestHandler = (request: Request, response: ServerResponse) => void;

export enum HttpMethod {
  GET,
  POST,
  ANY
}