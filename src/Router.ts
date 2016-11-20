import { RequestHandler, HttpMethod } from "./types";

export interface Router<T> {
  GET(path: string, handler: T);
  POST(path: string, handler: T);
  route(method: HttpMethod, path: string | string[]): RouteResult<T>;
}

export class HttpRouter<T> implements Router<T> {
  rootNode: RouterNode<T>;
  constructor() {
    this.rootNode = new RouterNode<T>(null);
  }

  GET(path: string, handler: T) {
    this.addHandler(HttpMethod.GET, path, handler);
  }

  POST(path: string, handler: T) {
    this.addHandler(HttpMethod.POST, path, handler);
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
        let newNode = new RouterNode(node);
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
        Object.keys(node.children).map((key) => {
          if(key[0] == ':') {
            params[key.replace(/^:/, '')] = part;
          }

          tempNode = node.children[key];
        });

        if(tempNode) {
          node = tempNode;
          parts.shift();
        } else {
          break;
        }
      }
    }

    return new RouteResult<T>(params, node.handlers[method], parts);
  }
}

class RouteResult<T> {
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
  parent: RouterNode<T>;
  children: {[index: string]: RouterNode<T>};
  handlers: {[index: number]: T};
  constructor(parent: RouterNode<T>) {
    this.parent = parent;
    this.handlers = { };
    this.children = { };
  }
}