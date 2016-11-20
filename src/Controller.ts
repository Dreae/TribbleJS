import { Router } from "./Router";
import { HttpMethod } from "./types";
import { IncomingMessage, ServerResponse } from "http";

export class Controller {
  router: Router;

  get(request: IncomingMessage, response: ServerResponse) {
    let handler = this.router.route(HttpMethod.GET, request.url);
    if(handler) {
      handler(request, response);
    } else {
      response.writeHead(404);
    }
  }
}