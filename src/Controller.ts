import { HttpRouter } from "./Router";
import { HttpMethod, RequestHandler } from "./types";
import { IncomingMessage, ServerResponse } from "http";

export class Controller extends HttpRouter<RequestHandler> {
  constructor() {
    super()
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