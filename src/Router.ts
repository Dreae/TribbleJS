import { RequestHandler, HttpMethod } from "./types";

export interface Router<T> {
  GET(path: string, handler: T);
  POST(path: string, handler: T);
  route(method: HttpMethod, path: string | string[]): RouteResult<T>;
}

export class HttpRouter<T> implements Router<T> {
  private rootNode = new RouterNode<T>();

  GET(path: string, handler: T) {
    this.addHandler(HttpMethod.GET, path, handler);
  }

  POST(path: string, handler: T) {
    this.addHandler(HttpMethod.POST, path, handler);
  }

  ANY(path: string, handler: T) {
    this.addHandler(HttpMethod.ANY, path, handler);
  }

  addHandler(method: HttpMethod, path: string, handler: T) {
    let parts = path.replace(/^\//, '').replace(/\/$/, '').split('/');
    if(parts[0] == '') {
      parts.shift();
    }

    let node = this.rootNode;
    while(parts.length > 0) {
      let part = parts.shift();

      if(node.children[part]) {
        node = node.children[part]
      } else {
        let newNode = new RouterNode<T>();
        node.children[part] = newNode;
        node = newNode;
      }
    }

    node.handlers[method] = handler;
  }

  route(method: HttpMethod, path: string | string[]): RouteResult<T> {
    let parts = [];
    if(typeof path == "string") {
      parts = path.replace(/^\//, '').replace(/\/$/, '').split('/');
    } else {
      parts = path;
    }
    if(parts[0] == '') {
      parts.shift();
    }

    let node = this.rootNode;
    let params = { };

    while(parts.length > 0) {
      let part = parts[0];

      if(node.children[part]) {
        node = node.children[part]
        parts.shift();
      } else {
        let tempNode = null
        let keys = Object.keys(node.children);
        for(let i = 0; i < keys.length; i++) {
          if(keys[i][0] == ':') {
            params[keys[i].replace(/^:/, '')] = part;
            tempNode = node.children[keys[i]];
            break;
          }
        }

        if(tempNode) {
          node = tempNode;
          parts.shift();
        } else {
          break;
        }
      }
    }

    let handler = node.handlers[method];
    if(handler) {
      return new RouteResult<T>(params, node.handlers[method], parts);
    } else {
      return new RouteResult<T>(params, node.handlers[HttpMethod.ANY], parts);
    }
  }
}

export class RouteResult<T> {
  params: { [index: string]: string };
  handler: T;
  parts: string[];

  constructor(params, handler, parts) {
    this.params = params;
    this.handler = handler;
    this.parts = parts;
  }
}

class RouterNode<T> {
  children: {[index: string]: RouterNode<T>};
  handlers: {[index: number]: T};
  constructor() {
    this.handlers = { };
    this.children = { };
  }
}