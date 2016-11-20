import { Router, HttpRouter } from "./Router";
import { HttpMethod, RequestHandler } from "./types";
import { IncomingMessage, ServerResponse } from "http";

export class Controller implements Router {
  router: Router;

  constructor() {
    this.router = new HttpRouter();
  }

  GET(path: string, handler: RequestHandler) {
    this.router.GET(path, handler)
  }

  POST(path: string, handler: RequestHandler) {
    this.router.POST(path, handler);
  }

  route(method: HttpMethod, path: string) {
    return this.router.route(method, path);
  }

  handle(request: IncomingMessage, response: ServerResponse) {
    let handler = this.route(HttpMethod.GET, request.url);
    if(handler[1]) {
      handler[1](request, response);
    } else {
      response.writeHead(404);
    }
  }
}