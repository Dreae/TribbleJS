import { HttpRouter } from "./Router";
import { Request } from "./Request";
import { Response } from "./Response";
import { HttpMethod, RequestHandler } from "./types";
import { ServerResponse } from "http";

export class Controller extends HttpRouter<RequestHandler> {
  constructor() {
    super()
  }

  handle(routeParts: string[], request: Request): Promise<Response> {
    let result = this.route(HttpMethod[request.method], routeParts);

    if(result.handler && result.parts.length == 0) {
      return result.handler(request);
    } else {
      let response = new Response();
      response.write("Not found");

      return Promise.resolve(response);
    }
  }
}