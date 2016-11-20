import { Router, HttpRouter } from "./Router";
import { HttpMethod, RequestHandler } from "./types";
import { IncomingMessage, ServerResponse } from "http";

export class Controller implements Router<RequestHandler> {
  router: Router<RequestHandler>;

  constructor() {
    this.router = new HttpRouter<RequestHandler>();
  }

  GET(path: string, handler: RequestHandler) {
    this.router.GET(path, handler);
  }

  POST(path: string, handler: RequestHandler) {
    this.router.POST(path, handler);
  }

  route(method: HttpMethod, path: string[]) {
    return this.router.route(method, path);
  }

  handle(routeParts: string[], request: IncomingMessage, response: ServerResponse) {
    let result = this.route(HttpMethod.GET, routeParts);

    if(result.handler && result.parts.length == 0) {
      result.handler(request, response);
    } else {
      response.writeHead(404);
      response.end();
    }
  }
}