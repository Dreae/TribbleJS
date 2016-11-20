import { RequestHandler, HttpMethod } from "./types";

export interface Router {
  GET(path: string, handler: RequestHandler);
  POST(path: string, handler: RequestHandler);
  route(method: HttpMethod, path: string);
}

export class HttpRouter implements Router {
  rootNode: RouterNode;
  constructor() {
    this.rootNode = new RouterNode(null);
  }

  GET(path: string, handler: RequestHandler) {
    this.addHandler(HttpMethod.GET, path, handler);
  }

  POST(path: string, handler: RequestHandler) {
    this.addHandler(HttpMethod.POST, path, handler);
  }

  addHandler(method: HttpMethod, path: string, handler: RequestHandler) {
    let parts = path.replace(/^\//, '').replace(/\/$/, '').split('/');
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

  route(method: HttpMethod, path: string): [{[index:string]: string}, RequestHandler] {
    let parts = path.replace(/^\//, '').replace(/\/$/, '').split('/');
    let node = this.rootNode;
    let params = { };

    while(parts.length > 0) {
      let part = parts.shift();
      if(node.children[part]) {
        node = node.children[part]
      } else {
        Object.keys(node.children).map((key) => {
          if(key[0] == ':') {
            params[key.replace(/^:/, '')] = part;
          }

          node = node.children[key];
        });
      }
    }

    return [params, node.handlers[method]];
  }
}

class RouterNode {
  parent: RouterNode;
  children: {[index: string]: RouterNode};
  handlers: {[index: number]: RequestHandler};
  constructor(parent: RouterNode) {
    this.parent = parent;
    this.handlers = { };
    this.children = { };
  }
}