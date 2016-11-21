import { IncomingMessage, ServerResponse } from "http";
import { Request } from "./Request";
import { Response } from "./Response";

export type RequestHandler = (request: Request) => Promise<Response>;
export type BeforeMiddleware = RequestHandler;
export type AfterMiddleware = (request: Request, response: Response) => Promise<Response>;

export enum HttpMethod {
  GET,
  POST,
  ANY
}