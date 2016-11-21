import { HttpRouter } from "./Router";
import { Controller } from "./Controller";
import { HttpMethod, RequestHandler, BeforeMiddleware, AfterMiddleware } from "./types";
import { Request, makeRequest } from "./Request";
import { Server, createServer, IncomingMessage, ServerResponse } from "http";
import { Response } from "./Response";

import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";

export class Application extends HttpRouter<Controller> {
  port: number;
  address: string;
  server: Server;
  beforeMiddleware: BeforeMiddleware[] = [];
  afterMiddleware: AfterMiddleware[] = [];

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

  before(middleware: BeforeMiddleware) {
    this.beforeMiddleware.push(middleware);
  }

  after(middleware: AfterMiddleware) {
    this.afterMiddleware.push(middleware);
  }

  handle(request: IncomingMessage, response: ServerResponse) {
    let req: Request = makeRequest(request);
    this.parseBody(req).then(() => {
      return this.runBefore(request);
    }).then((res) => {
      let result = this.route(HttpMethod[request.method], request.url);
      if(result.handler) {
        return result.handler.handle(result.parts, req).then((handlerRes) => {
          return res.compose(handlerRes);
        });
      } else {
        let res = new Response();
        res.statusCode = 400;
        res.write("Not found");

        return Promise.resolve(res);
      }
    }).then((res) => {
      return this.runAfter(request, res);
    }).then((res) => {
      res.finalize(response);
    }).catch((err) => {
      console.error(err);

      response.writeHead(500);
      response.write("Internal server error");
      response.end();
    });
  }

  listen(callback) {
    this.server.listen(this.port, this.address, callback);
  }

  private parseBody(request: Request) {
    return new Promise((resolve) => {
      this.cookieParser(request, null, resolve);
    }).then(() => {
      return new Promise((resolve) => {
        this.jsonParser(request, null, resolve);
      });
    }).then(() => {
      return new Promise((resolve) => {
        this.urlEncodedParser(request, null, resolve);
      });
    });
  }

  private runBefore(request: Request): Promise<Response> {
    return Promise.all(this.beforeMiddleware.map((middleware) => {
      let promise = middleware(request);
      if(promise) {
        return promise;
      } else {
        return Promise.resolve(null);
      }
    })).then((responses) => {
      return responses.reduce((a, b) => {
        if(b) {
          return a.compose(b);
        } else { 
          return a;
        }
      }, new Response())
    });
  }

  private runAfter(request: Request, response: Response): Promise<Response> {
    return Promise.all(this.afterMiddleware.map((middleware) => {
      let promise = middleware(request, response);
      if(promise) {
        return promise;
      } else {
        return Promise.resolve(null);
      }
    })).then((responses) => {
      return responses.reduce((a, b) => {
        if(b) {
          return a.compose(b); 
        } else {
          return a;
        }
      }, response)
    });
  }
}