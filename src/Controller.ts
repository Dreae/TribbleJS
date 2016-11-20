import { HttpRouter } from "./Router";
import { Request } from "./Request";
import { HttpMethod, RequestHandler } from "./types";
import { ServerResponse } from "http";

export class Controller extends HttpRouter<RequestHandler> {
  constructor() {
    super()
  }

  handle(routeParts: string[], request: Request, response: ServerResponse) {
    let result = this.route(HttpMethod[request.method], routeParts);

    if(result.handler && result.parts.length == 0) {
      result.handler(request, response);
    } else {
      response.writeHead(404);
      response.end();
    }
  }
}