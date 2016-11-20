import { Router, HttpRouter } from "./Router";
import { Controller } from "./Controller";
import { HttpMethod } from "./types";
import { Server, createServer, IncomingMessage, ServerResponse } from "http";

export class Application implements Router<Controller> {
  port: number;
  address: string;
  router: Router<Controller>;
  server: Server;

  constructor(port = 8080, address = "127.0.0.1") {
    this.port = port;
    this.address = address;
    this.server = createServer(this.handle.bind(this));
    this.router = new HttpRouter<Controller>();
  }

  GET(path: string, handler: Controller) {
    this.router.GET(path, handler);
  }

  POST(path: string, handler: Controller) {
    this.router.POST(path, handler);
  }

  route(method: HttpMethod, path: string) {
    return this.router.route(method, path);
  }

  handle(request: IncomingMessage, response: ServerResponse) {
    let result = this.route(HttpMethod.GET, request.url);
    if(result.handler) {
      result.handler.handle(result.parts, request, response);
    } else {
      response.writeHead(404);
      response.end();
    }
  }

  listen(callback) {
    this.server.listen(this.port, this.address, callback);
  }
}