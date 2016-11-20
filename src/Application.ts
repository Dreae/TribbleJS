import { HttpRouter } from "./Router";
import { Controller } from "./Controller";
import { HttpMethod } from "./types";
import { Server, createServer, IncomingMessage, ServerResponse } from "http";

export class Application extends HttpRouter<Controller> {
  port: number;
  address: string;
  server: Server;

  constructor(port = 8080, address = "127.0.0.1") {
    super();
    this.port = port;
    this.address = address;
    this.server = createServer(this.handle.bind(this));
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