import { IncomingMessage } from "http";
import { HttpMethod } from "./types";
import { Readable } from "stream";

export interface Request extends IncomingMessage { }

let _Request = { };

export function makeRequest(req: IncomingMessage): Request {
  let request = req as Request;
  Object.assign(request, _Request);

  return request;
}