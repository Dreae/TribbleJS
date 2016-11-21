import { HttpRouter } from "./Router";
import { Request } from "./Request";
import { Response } from "./Response";
import { HttpMethod, RequestHandler } from "./types";
import { ServerResponse } from "http";

export class Controller extends HttpRouter<RequestHandler> {
  routes: {[index: string]: any};
  constructor() {
    super();
    Object.keys(this.routes).map((key) => {
      this.addHandler(this.routes[key].method, key, this.routes[key].handler.bind(this));
    });
  }

  handle(routeParts: string[], request: Request): Promise<Response> {
    let result = this.route(HttpMethod[request.method], routeParts);

    if(result.handler && result.parts.length == 0) {
      return result.handler(request);
    } else {
      let response = new Response();
      response.statusCode = 404;
      response.write("Not found");

      return Promise.resolve(response);
    }
  }
}