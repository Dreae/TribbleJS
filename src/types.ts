import { IncomingMessage, ServerResponse } from "http";

export type RequestHandler = (request: IncomingMessage, response: ServerResponse) => string;

export enum HttpMethod {
  GET,
  POST
}