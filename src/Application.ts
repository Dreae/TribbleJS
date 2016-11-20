import { HttpRouter } from "./Router";
import { Controller } from "./Controller";
import { HttpMethod } from "./types";
import { Request, makeRequest } from "./Request";
import { Server, createServer, IncomingMessage, ServerResponse } from "http";

import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";

export class Application extends HttpRouter<Controller> {
  port: number;
  address: string;
  server: Server;

  cookieParser: any;
  jsonParser: any;
  urlEncodedParser: any;

  constructor(port = 8080, address = "127.0.0.1") {
    super();
    this.port = port;
    this.address = address;
    this.server = createServer(this.handle.bind(this));

    this.cookieParser = cookieParser();
    this.jsonParser = bodyParser.json();
    this.urlEncodedParser = bodyParser.urlencoded({extended: true});
  }

  handle(request: IncomingMessage, response: ServerResponse) {
    let result = this.route(HttpMethod[request.method], request.url);
    if(result.handler) {
      let req: Request = makeRequest(request);

      new Promise((resolve) => {
        this.cookieParser(req, null, resolve);
      }).then(() => {
        return new Promise((resolve) => {
          this.jsonParser(req, null, resolve);
        });
      }).then(() => {
        return new Promise((resolve) => {
          this.urlEncodedParser(req, null, resolve);
        });
      }).then(() => {
        result.handler.handle(result.parts, req, response);
      }).catch((err) => {
        console.error(err);

        response.writeHead(500);
        response.write("Internal server error");
        response.end();
      });
    } else {
      response.writeHead(404);
      response.end();
    }
  }

  listen(callback) {
    this.server.listen(this.port, this.address, callback);
  }
}