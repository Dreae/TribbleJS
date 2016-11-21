import { IncomingMessage } from "http";
import { HttpMethod } from "./types";
import { Readable } from "stream";

export interface Request extends IncomingMessage {
  params: {[index: string]: string};
}

export function makeRequest(req: IncomingMessage): Request {
  let request = req as Request;
  Object.assign(request, {
    params: { }
  });

  return request;
}